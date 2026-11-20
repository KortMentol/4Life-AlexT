const ECC_CODEWORDS_PER_BLOCK_L = [
  0, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
] as const;
const NUM_BLOCKS_L = [
  0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25,
] as const;

type Matrix = boolean[][];

function appendBits(target: number[], value: number, length: number): void {
  for (let bit = length - 1; bit >= 0; bit -= 1) {
    target.push(((value >>> bit) & 1) !== 0 ? 1 : 0);
  }
}

function getTotalCodewords(version: number): number {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const alignmentCount = Math.floor(version / 7) + 2;
    result -= (25 * alignmentCount - 10) * alignmentCount - 55;
    if (version >= 7) result -= 36;
  }
  return Math.floor(result / 8);
}

function getDataCodewordCount(version: number): number {
  const total = getTotalCodewords(version);
  const eccPerBlock = ECC_CODEWORDS_PER_BLOCK_L[version] ?? 0;
  const blockCount = NUM_BLOCKS_L[version] ?? 0;
  return total - eccPerBlock * blockCount;
}

function getAlignmentPositions(version: number): number[] {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.floor((version * 4 + count * 2 + 1) / (count * 2 - 2)) * 2;
  const positions = [6];
  for (let position = version * 4 + 10; positions.length < count; position -= step) {
    positions.splice(1, 0, position);
  }
  return positions;
}

function multiplyInField(left: number, right: number): number {
  let product = 0;
  for (let bit = 7; bit >= 0; bit -= 1) {
    product = (product << 1) ^ ((product >>> 7) * 0x11d);
    product ^= ((right >>> bit) & 1) * left;
  }
  return product;
}

function reedSolomonRemainder(data: number[], degree: number): number[] {
  let generator = [1];
  let root = 1;
  for (let i = 0; i < degree; i += 1) {
    const next = Array<number>(generator.length + 1).fill(0);
    for (let j = 0; j < generator.length; j += 1) {
      const coefficient = generator[j] ?? 0;
      next[j] = (next[j] ?? 0) ^ coefficient;
      next[j + 1] = (next[j + 1] ?? 0) ^ multiplyInField(coefficient, root);
    }
    generator = next;
    root = multiplyInField(root, 2);
  }

  const remainder = Array<number>(degree).fill(0);
  for (const byte of data) {
    const factor = byte ^ (remainder[0] ?? 0);
    for (let i = 0; i < degree - 1; i += 1) {
      remainder[i] = (remainder[i + 1] ?? 0) ^ multiplyInField(generator[i + 1] ?? 0, factor);
    }
    remainder[degree - 1] = multiplyInField(generator[degree] ?? 0, factor);
  }
  return remainder;
}

function addErrorCorrection(data: number[], version: number): number[] {
  const blockCount = NUM_BLOCKS_L[version] ?? 0;
  const eccLength = ECC_CODEWORDS_PER_BLOCK_L[version] ?? 0;
  const rawCodewordCount = getTotalCodewords(version);
  const shortBlockCount = blockCount - (rawCodewordCount % blockCount);
  const shortBlockLength = Math.floor(rawCodewordCount / blockCount);
  const shortDataLength = shortBlockLength - eccLength;
  const blocks: number[][] = [];
  let offset = 0;

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
    const blockDataLength = shortDataLength + (blockIndex < shortBlockCount ? 0 : 1);
    const blockData = data.slice(offset, offset + blockDataLength);
    offset += blockDataLength;
    blocks.push([...blockData, ...reedSolomonRemainder(blockData, eccLength)]);
  }

  const result: number[] = [];
  const longestDataBlock = shortDataLength + (shortBlockCount < blockCount ? 1 : 0);
  for (let column = 0; column < longestDataBlock; column += 1) {
    for (const block of blocks) {
      if (column < block.length - eccLength) {
        const byte = block[column];
        if (byte !== undefined) result.push(byte);
      }
    }
  }
  for (let column = 0; column < eccLength; column += 1) {
    for (const block of blocks) {
      const byte = block[block.length - eccLength + column];
      if (byte !== undefined) result.push(byte);
    }
  }
  return result;
}

function makeDataCodewords(bytes: Uint8Array, version: number): number[] {
  const capacity = getDataCodewordCount(version) * 8;
  const bits: number[] = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, version <= 9 ? 8 : 16);
  bytes.forEach((byte) => appendBits(bits, byte, 8));
  appendBits(bits, 0, Math.min(4, capacity - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const data: number[] = [];
  for (let offset = 0; offset < bits.length; offset += 8) {
    let value = 0;
    for (let bit = 0; bit < 8; bit += 1) value = (value << 1) | (bits[offset + bit] ?? 0);
    data.push(value);
  }
  for (let pad = 0xec; data.length < capacity / 8; pad ^= 0xec ^ 0x11) data.push(pad);
  return data;
}

function setFunctionModule(matrix: Matrix, functionModules: Matrix, x: number, y: number, value: boolean): void {
  const row = matrix[y];
  const flags = functionModules[y];
  if (!row || !flags || x < 0 || x >= row.length) return;
  row[x] = value;
  flags[x] = true;
}

function drawFinder(matrix: Matrix, functionModules: Matrix, centerX: number, centerY: number): void {
  for (let dy = -4; dy <= 4; dy += 1) {
    for (let dx = -4; dx <= 4; dx += 1) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      setFunctionModule(matrix, functionModules, centerX + dx, centerY + dy, distance !== 2 && distance <= 3);
    }
  }
}

function drawAlignment(matrix: Matrix, functionModules: Matrix, centerX: number, centerY: number): void {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      setFunctionModule(matrix, functionModules, centerX + dx, centerY + dy, distance !== 1);
    }
  }
}

function getBchRemainder(value: number, polynomial: number): number {
  let remainder = value;
  const polynomialDegree = 31 - Math.clz32(polynomial);
  while (remainder !== 0 && 31 - Math.clz32(remainder) >= polynomialDegree) {
    remainder ^= polynomial << (31 - Math.clz32(remainder) - polynomialDegree);
  }
  return remainder;
}

function drawFormatBits(matrix: Matrix, functionModules: Matrix, mask: number): void {
  const size = matrix.length;
  const data = (1 << 3) | mask;
  const bits = ((data << 10) | getBchRemainder(data << 10, 0x537)) ^ 0x5412;
  const set = (x: number, y: number, index: number) => setFunctionModule(matrix, functionModules, x, y, ((bits >>> index) & 1) !== 0);

  for (let i = 0; i <= 5; i += 1) set(8, i, i);
  set(8, 7, 6);
  set(8, 8, 7);
  set(7, 8, 8);
  for (let i = 9; i < 15; i += 1) set(14 - i, 8, i);
  for (let i = 0; i < 8; i += 1) set(size - 1 - i, 8, i);
  for (let i = 8; i < 15; i += 1) set(8, size - 15 + i, i);
  setFunctionModule(matrix, functionModules, 8, size - 8, true);
}

function drawVersionBits(matrix: Matrix, functionModules: Matrix, version: number): void {
  if (version < 7) return;
  const size = matrix.length;
  const bits = (version << 12) | getBchRemainder(version << 12, 0x1f25);
  for (let i = 0; i < 18; i += 1) {
    const bit = ((bits >>> i) & 1) !== 0;
    const a = size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    setFunctionModule(matrix, functionModules, a, b, bit);
    setFunctionModule(matrix, functionModules, b, a, bit);
  }
}

function maskCondition(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0: return (x + y) % 2 === 0;
    case 1: return y % 2 === 0;
    case 2: return x % 3 === 0;
    case 3: return (x + y) % 3 === 0;
    case 4: return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

function applyMask(matrix: Matrix, functionModules: Matrix, mask: number): void {
  for (let y = 0; y < matrix.length; y += 1) {
    const row = matrix[y];
    const flags = functionModules[y];
    if (!row || !flags) continue;
    for (let x = 0; x < row.length; x += 1) {
      if (!flags[x] && maskCondition(mask, x, y)) row[x] = !row[x];
    }
  }
}

function getPenaltyScore(matrix: Matrix): number {
  const size = matrix.length;
  let score = 0;
  const lines: boolean[][] = [...matrix];
  for (let x = 0; x < size; x += 1) lines.push(matrix.map((row) => row[x] ?? false));

  for (const line of lines) {
    let runColor = line[0] ?? false;
    let runLength = 1;
    for (let i = 1; i < line.length; i += 1) {
      if (line[i] === runColor) {
        runLength += 1;
        if (runLength === 5) score += 3;
        else if (runLength > 5) score += 1;
      } else {
        runColor = line[i] ?? false;
        runLength = 1;
      }
    }
    for (let i = 0; i <= line.length - 11; i += 1) {
      const pattern = line.slice(i, i + 11).map((bit) => bit ? "1" : "0").join("");
      if (pattern === "10111010000" || pattern === "00001011101") score += 40;
    }
  }

  for (let y = 0; y < size - 1; y += 1) {
    const row = matrix[y];
    const nextRow = matrix[y + 1];
    if (!row || !nextRow) continue;
    for (let x = 0; x < size - 1; x += 1) {
      const value = row[x];
      if (value !== undefined && value === row[x + 1] && value === nextRow[x] && value === nextRow[x + 1]) score += 3;
    }
  }

  const darkModules = matrix.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
  score += Math.floor(Math.abs((darkModules * 100) / (size * size) - 50) / 5) * 10;
  return score;
}

function encodeCodewords(bytes: Uint8Array, version: number): number[] {
  return addErrorCorrection(makeDataCodewords(bytes, version), version);
}

function createMatrix(codewords: number[], version: number): Matrix {
  const size = version * 4 + 17;
  const matrix: Matrix = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const functionModules: Matrix = Array.from({ length: size }, () => Array<boolean>(size).fill(false));

  drawFinder(matrix, functionModules, 3, 3);
  drawFinder(matrix, functionModules, size - 4, 3);
  drawFinder(matrix, functionModules, 3, size - 4);

  for (const y of getAlignmentPositions(version)) {
    for (const x of getAlignmentPositions(version)) {
      if (functionModules[y]?.[x]) continue;
      drawAlignment(matrix, functionModules, x, y);
    }
  }

  for (let i = 0; i < size; i += 1) {
    if (!functionModules[6]?.[i]) setFunctionModule(matrix, functionModules, i, 6, i % 2 === 0);
    if (!functionModules[i]?.[6]) setFunctionModule(matrix, functionModules, 6, i, i % 2 === 0);
  }
  drawFormatBits(matrix, functionModules, 0);
  drawVersionBits(matrix, functionModules, version);

  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < size; vertical += 1) {
      const upward = ((right + 1) & 2) === 0;
      const y = upward ? size - 1 - vertical : vertical;
      for (let offset = 0; offset < 2; offset += 1) {
        const x = right - offset;
        if (functionModules[y]?.[x]) continue;
        const byte = codewords[Math.floor(bitIndex / 8)];
        const bit = byte === undefined ? false : ((byte >>> (7 - (bitIndex % 8))) & 1) !== 0;
        matrix[y]![x] = bit;
        bitIndex += 1;
      }
    }
  }

  let bestMatrix: Matrix | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  for (let mask = 0; mask < 8; mask += 1) {
    const candidate = matrix.map((row) => [...row]);
    applyMask(candidate, functionModules, mask);
    drawFormatBits(candidate, functionModules, mask);
    const score = getPenaltyScore(candidate);
    if (score < bestScore) {
      bestScore = score;
      bestMatrix = candidate;
    }
  }
  return bestMatrix ?? matrix;
}

export function generateQrMatrix(value: string): Matrix {
  const bytes = new TextEncoder().encode(value);
  let version = 1;
  while (version <= 40) {
    const lengthBits = version <= 9 ? 8 : 16;
    const requiredBits = 4 + lengthBits + bytes.length * 8;
    if (bytes.length < 2 ** lengthBits && requiredBits <= getDataCodewordCount(version) * 8) break;
    version += 1;
  }
  if (version > 40) throw new RangeError("Текст превышает максимальную ёмкость QR-кода.");
  return createMatrix(encodeCodewords(bytes, version), version);
}
