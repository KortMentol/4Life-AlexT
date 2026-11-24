/**
 * @module src/utils/qrCodeSvg.ts
 * @description Self-contained QR Code generator (Byte Mode, Error Correction Level L, Versions 1–14)
 * with full GF(256) Reed-Solomon error correction and ISO/IEC 18004 mask scoring.
 * Zero external dependencies. Produces crisp boolean[][] matrices scannable by any smartphone camera.
 */

export interface QrCodeMatrix {
  version: number;
  size: number;
  modules: boolean[][];
}

// Capacity (total data codewords) and block structure for Error Correction Level L (Versions 1..14)
interface VersionSpec {
  version: number;
  totalCodewords: number;
  ecCodewordsPerBlock: number;
  groups: ReadonlyArray<{ blocks: number; dataCodewords: number }>;
  alignmentCenters: readonly number[];
}

const VERSION_SPECS: readonly VersionSpec[] = [
  { version: 1, totalCodewords: 26, ecCodewordsPerBlock: 7, groups: [{ blocks: 1, dataCodewords: 19 }], alignmentCenters: [] },
  { version: 2, totalCodewords: 44, ecCodewordsPerBlock: 10, groups: [{ blocks: 1, dataCodewords: 34 }], alignmentCenters: [6, 18] },
  { version: 3, totalCodewords: 70, ecCodewordsPerBlock: 15, groups: [{ blocks: 1, dataCodewords: 55 }], alignmentCenters: [6, 22] },
  { version: 4, totalCodewords: 100, ecCodewordsPerBlock: 20, groups: [{ blocks: 1, dataCodewords: 80 }], alignmentCenters: [6, 26] },
  { version: 5, totalCodewords: 134, ecCodewordsPerBlock: 26, groups: [{ blocks: 1, dataCodewords: 108 }], alignmentCenters: [6, 30] },
  { version: 6, totalCodewords: 172, ecCodewordsPerBlock: 18, groups: [{ blocks: 2, dataCodewords: 68 }], alignmentCenters: [6, 34] },
  { version: 7, totalCodewords: 196, ecCodewordsPerBlock: 20, groups: [{ blocks: 2, dataCodewords: 78 }], alignmentCenters: [6, 22, 38] },
  { version: 8, totalCodewords: 242, ecCodewordsPerBlock: 24, groups: [{ blocks: 2, dataCodewords: 97 }], alignmentCenters: [6, 24, 42] },
  { version: 9, totalCodewords: 292, ecCodewordsPerBlock: 30, groups: [{ blocks: 2, dataCodewords: 116 }], alignmentCenters: [6, 26, 46] },
  {
    version: 10,
    totalCodewords: 346,
    ecCodewordsPerBlock: 18,
    groups: [
      { blocks: 2, dataCodewords: 68 },
      { blocks: 2, dataCodewords: 69 },
    ],
    alignmentCenters: [6, 28, 50],
  },
  {
    version: 11,
    totalCodewords: 404,
    ecCodewordsPerBlock: 20,
    groups: [{ blocks: 4, dataCodewords: 81 }],
    alignmentCenters: [6, 30, 54],
  },
  {
    version: 12,
    totalCodewords: 466,
    ecCodewordsPerBlock: 24,
    groups: [
      { blocks: 2, dataCodewords: 92 },
      { blocks: 2, dataCodewords: 93 },
    ],
    alignmentCenters: [6, 32, 58],
  },
  {
    version: 13,
    totalCodewords: 532,
    ecCodewordsPerBlock: 26,
    groups: [{ blocks: 4, dataCodewords: 107 }],
    alignmentCenters: [6, 34, 62],
  },
  {
    version: 14,
    totalCodewords: 581,
    ecCodewordsPerBlock: 30,
    groups: [
      { blocks: 3, dataCodewords: 115 },
      { blocks: 1, dataCodewords: 116 },
    ],
    alignmentCenters: [6, 26, 46, 66],
  },
];

// Format information strings for EC Level L (01) and masks 0..7 (15-bit BCH(15,5) XOR 0x5412)
const FORMAT_BITS_L: readonly number[] = [
  0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
];

// Version information strings for Versions 7..14 (18-bit BCH(18,6))
const VERSION_BITS: Record<number, number> = {
  7: 0x07c94,
  8: 0x085bc,
  9: 0x09a99,
  10: 0x0a4d3,
  11: 0x0bbf6,
  12: 0x0c762,
  13: 0x0d847,
  14: 0x0e60d,
};

// GF(256) lookup tables with primitive polynomial x^8 + x^4 + x^3 + x^2 + 1 (0x11d)
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255] ?? 0;
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] ?? 0) + (GF_LOG[b] ?? 0)] ?? 0;
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = GF_EXP[i] ?? 1;
    for (let j = 0; j < poly.length; j++) {
      const coeff = poly[j] ?? 0;
      next[j] = (next[j] ?? 0) ^ coeff;
      next[j + 1] = (next[j + 1] ?? 0) ^ gfMul(coeff, factor);
    }
    poly = next;
  }
  return poly;
}

function rsComputeRemainder(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = rsGeneratorPoly(ecCount);
  const rem = new Uint8Array(ecCount);
  for (let i = 0; i < data.length; i++) {
    const factor = (data[i] ?? 0) ^ (rem[0] ?? 0);
    for (let j = 0; j < ecCount - 1; j++) {
      rem[j] = rem[j + 1] ?? 0;
    }
    rem[ecCount - 1] = 0;
    for (let j = 0; j < ecCount; j++) {
      rem[j] = (rem[j] ?? 0) ^ gfMul(gen[j + 1] ?? 0, factor);
    }
  }
  return rem;
}

function encodeUtf8(text: string): Uint8Array {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(text);
  }
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    let code = text.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const next = text.charCodeAt(++i);
      code = 0x10000 + (((code & 0x3ff) << 10) | (next & 0x3ff));
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

function getDataCapacity(spec: VersionSpec): number {
  return spec.groups.reduce((sum, g) => sum + g.blocks * g.dataCodewords, 0);
}

function selectVersion(byteLength: number): VersionSpec {
  for (const spec of VERSION_SPECS) {
    const countBits = spec.version < 10 ? 8 : 16;
    const neededBits = 4 + countBits + byteLength * 8;
    const capacityBits = getDataCapacity(spec) * 8;
    if (neededBits <= capacityBits) {
      return spec;
    }
  }
  return VERSION_SPECS[VERSION_SPECS.length - 1]!;
}

function buildCodewords(bytes: Uint8Array, spec: VersionSpec): Uint8Array {
  const dataCap = getDataCapacity(spec);
  const countBits = spec.version < 10 ? 8 : 16;
  const maxBytes = Math.floor((dataCap * 8 - 4 - countBits) / 8);
  const payload = bytes.length > maxBytes ? bytes.subarray(0, maxBytes) : bytes;

  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >>> i) & 1);
    }
  };

  // Mode indicator: Byte mode = 0100
  pushBits(0b0100, 4);
  pushBits(payload.length, countBits);
  for (let i = 0; i < payload.length; i++) {
    pushBits(payload[i] ?? 0, 8);
  }

  // Terminator (up to 4 zero bits)
  const capBits = dataCap * 8;
  const termLen = Math.min(4, capBits - bits.length);
  for (let i = 0; i < termLen; i++) bits.push(0);

  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes = new Uint8Array(dataCap);
  let byteIdx = 0;
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let k = 0; k < 8; k++) {
      b = (b << 1) | (bits[i + k] ?? 0);
    }
    dataBytes[byteIdx++] = b;
  }

  // Pad bytes alternating 0xEC, 0x11
  let toggle = true;
  while (byteIdx < dataCap) {
    dataBytes[byteIdx++] = toggle ? 0xec : 0x11;
    toggle = !toggle;
  }

  // Split into RS blocks and compute EC codewords
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;
  for (const g of spec.groups) {
    for (let b = 0; b < g.blocks; b++) {
      const block = dataBytes.slice(offset, offset + g.dataCodewords);
      offset += g.dataCodewords;
      dataBlocks.push(block);
      ecBlocks.push(rsComputeRemainder(block, spec.ecCodewordsPerBlock));
    }
  }

  // Interleave data codewords, then EC codewords
  const result = new Uint8Array(spec.totalCodewords);
  let outIdx = 0;
  const maxDataLen = Math.max(...dataBlocks.map((b) => b.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) {
        result[outIdx++] = block[i] ?? 0;
      }
    }
  }
  for (let i = 0; i < spec.ecCodewordsPerBlock; i++) {
    for (const ec of ecBlocks) {
      if (i < ec.length) {
        result[outIdx++] = ec[i] ?? 0;
      }
    }
  }

  return result;
}

function createEmptyGrid(size: number): boolean[][] {
  return Array.from({ length: size }, () => Array<boolean>(size).fill(false));
}

function setFunc(
  modules: boolean[][],
  isFunction: boolean[][],
  r: number,
  c: number,
  val: boolean,
): void {
  const row = modules[r];
  const fnRow = isFunction[r];
  if (row && fnRow && c >= 0 && c < row.length) {
    row[c] = val;
    fnRow[c] = true;
  }
}

function drawFinderPattern(
  modules: boolean[][],
  isFunction: boolean[][],
  top: number,
  left: number,
  size: number,
): void {
  for (let dy = -1; dy <= 7; dy++) {
    for (let dx = -1; dx <= 7; dx++) {
      const r = top + dy;
      const c = left + dx;
      if (r < 0 || r >= size || c < 0 || c >= size) continue;
      const inOuter = dy >= 0 && dy <= 6 && dx >= 0 && dx <= 6;
      const isBorder = dy === 0 || dy === 6 || dx === 0 || dx === 6;
      const isCenter = dy >= 2 && dy <= 4 && dx >= 2 && dx <= 4;
      setFunc(modules, isFunction, r, c, inOuter && (isBorder || isCenter));
    }
  }
}

function drawAlignmentPattern(
  modules: boolean[][],
  isFunction: boolean[][],
  centerR: number,
  centerC: number,
): void {
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      setFunc(modules, isFunction, centerR + dy, centerC + dx, dist !== 1);
    }
  }
}

function drawFormatBits(
  modules: boolean[][],
  isFunction: boolean[][],
  size: number,
  mask: number,
): void {
  const bits = FORMAT_BITS_L[mask] ?? FORMAT_BITS_L[0]!;

  // Copy 1: around top-left finder (ISO/IEC 18004 Fig. 25, i = 0 is LSB .. i = 14 is MSB)
  for (let i = 0; i <= 5; i++) {
    setFunc(modules, isFunction, i, 8, ((bits >>> i) & 1) === 1);
  }
  setFunc(modules, isFunction, 7, 8, ((bits >>> 6) & 1) === 1);
  setFunc(modules, isFunction, 8, 8, ((bits >>> 7) & 1) === 1);
  setFunc(modules, isFunction, 8, 7, ((bits >>> 8) & 1) === 1);
  for (let i = 9; i < 15; i++) {
    setFunc(modules, isFunction, 8, 14 - i, ((bits >>> i) & 1) === 1);
  }

  // Copy 2: top-right (bits 0..7) and bottom-left (bits 8..14)
  for (let i = 0; i < 8; i++) {
    setFunc(modules, isFunction, 8, size - 1 - i, ((bits >>> i) & 1) === 1);
  }
  for (let i = 8; i < 15; i++) {
    setFunc(modules, isFunction, size - 15 + i, 8, ((bits >>> i) & 1) === 1);
  }

  // Always-dark module at (4 * version + 9, 8) === (size - 8, 8)
  setFunc(modules, isFunction, size - 8, 8, true);
}

function drawVersionBits(
  modules: boolean[][],
  isFunction: boolean[][],
  size: number,
  version: number,
): void {
  const bits = VERSION_BITS[version];
  if (bits === undefined) return;
  for (let i = 0; i < 18; i++) {
    const bit = ((bits >>> i) & 1) === 1;
    const a = size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    setFunc(modules, isFunction, a, b, bit);
    setFunc(modules, isFunction, b, a, bit);
  }
}

function maskBit(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0:
      return (r + c) % 2 === 0;
    case 1:
      return r % 2 === 0;
    case 2:
      return c % 3 === 0;
    case 3:
      return (r + c) % 3 === 0;
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    case 7:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    default:
      return false;
  }
}

function evaluatePenalty(modules: boolean[][]): number {
  const size = modules.length;
  let penalty = 0;

  // Rule 1: 5+ consecutive same-color modules in row/col
  for (let r = 0; r < size; r++) {
    const row = modules[r];
    if (!row) continue;
    let runColor = row[0] ?? false;
    let runLen = 1;
    for (let c = 1; c < size; c++) {
      const val = row[c] ?? false;
      if (val === runColor) {
        runLen++;
      } else {
        if (runLen >= 5) penalty += 3 + (runLen - 5);
        runColor = val;
        runLen = 1;
      }
    }
    if (runLen >= 5) penalty += 3 + (runLen - 5);
  }

  for (let c = 0; c < size; c++) {
    let runColor = modules[0]?.[c] ?? false;
    let runLen = 1;
    for (let r = 1; r < size; r++) {
      const val = modules[r]?.[c] ?? false;
      if (val === runColor) {
        runLen++;
      } else {
        if (runLen >= 5) penalty += 3 + (runLen - 5);
        runColor = val;
        runLen = 1;
      }
    }
    if (runLen >= 5) penalty += 3 + (runLen - 5);
  }

  // Rule 2: 2x2 blocks of same color
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = modules[r]?.[c] ?? false;
      if (
        (modules[r]?.[c + 1] ?? false) === v &&
        (modules[r + 1]?.[c] ?? false) === v &&
        (modules[r + 1]?.[c + 1] ?? false) === v
      ) {
        penalty += 3;
      }
    }
  }

  // Rule 4: dark/light balance
  let dark = 0;
  for (let r = 0; r < size; r++) {
    const row = modules[r];
    if (!row) continue;
    for (let c = 0; c < size; c++) {
      if (row[c]) dark++;
    }
  }
  const percent = (dark * 100) / (size * size);
  const k = Math.floor(Math.abs(percent - 50) / 5);
  penalty += k * 10;

  return penalty;
}

export function generateQrMatrix(text: string): QrCodeMatrix {
  const bytes = encodeUtf8(text);
  const spec = selectVersion(bytes.length);
  const size = spec.version * 4 + 17;
  const codewords = buildCodewords(bytes, spec);

  const baseModules = createEmptyGrid(size);
  const isFunction = createEmptyGrid(size);

  // Finder patterns (TL, TR, BL)
  drawFinderPattern(baseModules, isFunction, 0, 0, size);
  drawFinderPattern(baseModules, isFunction, 0, size - 7, size);
  drawFinderPattern(baseModules, isFunction, size - 7, 0, size);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    const dark = i % 2 === 0;
    setFunc(baseModules, isFunction, 6, i, dark);
    setFunc(baseModules, isFunction, i, 6, dark);
  }

  // Alignment patterns
  const centers = spec.alignmentCenters;
  for (const r of centers) {
    for (const c of centers) {
      const isTopLeft = r < 9 && c < 9;
      const isTopRight = r < 9 && c > size - 9;
      const isBottomLeft = r > size - 9 && c < 9;
      if (isTopLeft || isTopRight || isBottomLeft) continue;
      drawAlignmentPattern(baseModules, isFunction, r, c);
    }
  }

  // Reserve format & version areas
  drawFormatBits(baseModules, isFunction, size, 0);
  if (spec.version >= 7) {
    drawVersionBits(baseModules, isFunction, size, spec.version);
  }

  // Place data bits in zig-zag order
  let bitIndex = 0;
  const totalBits = codewords.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        const upward = ((right + 1) & 2) === 0;
        const r = upward ? size - 1 - vert : vert;
        if (!(isFunction[r]?.[c] ?? true)) {
          let dark = false;
          if (bitIndex < totalBits) {
            const cw = codewords[bitIndex >>> 3] ?? 0;
            dark = ((cw >>> (7 - (bitIndex & 7))) & 1) === 1;
            bitIndex++;
          }
          const row = baseModules[r];
          if (row) row[c] = dark;
        }
      }
    }
  }

  // Evaluate all 8 masks and pick lowest penalty
  let bestMask = 0;
  let bestPenalty = Number.POSITIVE_INFINITY;
  let bestGrid: boolean[][] = baseModules;

  for (let mask = 0; mask < 8; mask++) {
    const candidate = baseModules.map((row) => [...row]);
    const fnCopy = isFunction.map((row) => [...row]);
    for (let r = 0; r < size; r++) {
      const cRow = candidate[r];
      const fRow = fnCopy[r];
      if (!cRow || !fRow) continue;
      for (let c = 0; c < size; c++) {
        if (!fRow[c] && maskBit(mask, r, c)) {
          cRow[c] = !cRow[c];
        }
      }
    }
    drawFormatBits(candidate, fnCopy, size, mask);
    const penalty = evaluatePenalty(candidate);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestMask = mask;
      bestGrid = candidate;
    }
  }

  void bestMask;

  return {
    version: spec.version,
    size,
    modules: bestGrid,
  };
}

/**
 * Builds an optimized single-path SVG `d` attribute for all dark QR modules.
 */
export function qrMatrixToSvgPath(modules: boolean[][]): string {
  const parts: string[] = [];
  for (let r = 0; r < modules.length; r++) {
    const row = modules[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      if (row[c]) {
        parts.push(`M${c},${r}h1v1h-1z`);
      }
    }
  }
  return parts.join("");
}
