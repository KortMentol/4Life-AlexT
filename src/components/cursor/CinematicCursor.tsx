import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useRef, useState } from "react";

interface CursorState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocity: { x: number; y: number };
  scale: number;
  targetScale: number;
  isHovering: boolean;
  isClicking: boolean;
  trail: Array<{
    x: number;
    y: number;
    opacity: number;
    scale: number;
    time: number;
  }>;
  bgLuminance: number;
  bgColor: { r: number; g: number; b: number };
  clickStartElement: Element | null;
  isVisible: boolean;
}

const CinematicCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameRef = useRef<number>();
  const { theme } = useTheme();

  // Проверка мобильного устройства
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) ||
    "ontouchstart" in window ||
    window.innerWidth <= 768;

  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    velocity: { x: 0, y: 0 },
    scale: 1,
    targetScale: 1,
    isHovering: false,
    isClicking: false,
    trail: [],
    bgLuminance: 0.5,
    bgColor: { r: 0.5, g: 0.5, b: 0.5 },
    clickStartElement: null,
    isVisible: true,
  });

  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_scale;
    uniform float u_velocity;
    varying vec2 v_texCoord;
    varying vec2 v_position;
    
    void main() {
      vec2 position = a_position;
      
      float velocityEffect = u_velocity * 0.5;
      position.x += sin(u_time * 12.0 + position.y * 15.0) * velocityEffect * 0.15;
      position.y += cos(u_time * 10.0 + position.x * 12.0) * velocityEffect * 0.12;
      
      position *= u_scale;
      position += u_mouse;
      
      vec2 clipSpace = ((position / u_resolution) * 2.0) - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      
      v_texCoord = a_texCoord;
      v_position = position;
    }
  `;

  const fragmentShaderSource = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    uniform float u_velocity;
    uniform float u_scale;
    uniform int u_isHovering;
    uniform int u_isClicking;
    uniform int u_isDark;
    uniform float u_bgLuminance;
    uniform vec3 u_bgColor;
    varying vec2 v_texCoord;
    varying vec2 v_position;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 6; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    float sdSphere(vec2 p, float r) {
      return length(p) - r;
    }
    
    // Молекулярная структура с органическими деформациями
    float moleculeShape(vec2 p, float r, float t) {
      float d = sdSphere(p, r);
      
      // Органические деформации молекулы
      float organicNoise = fbm(p * 4.0 + t * 0.3) * 0.08;
      float membraneWave = sin(length(p) * 12.0 - t * 2.0) * 0.03;
      
      return d + organicNoise + membraneWave;
    }
    
    void main() {
      vec2 st = v_texCoord;
      vec2 center = vec2(0.5);
      vec2 p = st - center;
      
      float timeOffset = u_time * 0.8;
      float distFromCenter = length(p);
      
      // Размеры молекулы
      float outerRadius = 0.35; // Оболочка
      float innerRadius = 0.15; // Ядро
      
      if (u_isHovering == 1) {
        outerRadius *= 1.1;
        innerRadius *= 1.1;
      }
      if (u_isClicking == 1) {
        outerRadius *= 0.9;
        innerRadius *= 1.2;
      }
      
      // Молекулярная оболочка (прозрачная)
      float outerMembrane = moleculeShape(p, outerRadius, timeOffset);
      float membraneAlpha = 1.0 - smoothstep(-0.02, 0.02, outerMembrane);
      
      // Ядро молекулы (плотное)
      float nucleus = moleculeShape(p, innerRadius, timeOffset * 1.5);
      float nucleusAlpha = 1.0 - smoothstep(-0.05, 0.05, nucleus);
      
      // Цветовая схема трансфер-фактора
      vec3 membraneColor = vec3(0.8, 0.9, 1.0); // Голубоватая оболочка
      vec3 nucleusColor = vec3(1.0, 1.0, 1.0);  // Белое ядро
      vec3 glowColor = vec3(0.6, 0.8, 1.0);     // Свечение
      
      // Биологические эффекты
      float bioActivity = sin(timeOffset * 3.0 + distFromCenter * 8.0) * 0.5 + 0.5;
      float cellularMotion = fbm(p * 6.0 + timeOffset * 0.5) * 0.3 + 0.7;
      
      // Микроскопические частицы в оболочке
      float particles = 0.0;
      for(int i = 0; i < 8; i++) {
        float angle = float(i) * 0.785 + timeOffset * 0.5;
        vec2 particlePos = vec2(cos(angle), sin(angle)) * (outerRadius * 0.7);
        float particleDist = length(p - particlePos);
        particles += exp(-particleDist * 25.0) * 0.3;
      }
      
      // Финальный цвет и прозрачность
      vec3 finalColor = vec3(0.0);
      float finalAlpha = 0.0;
      
      // Оболочка (прозрачная со свечением)
      if (membraneAlpha > 0.0) {
        vec3 membraneWithParticles = mix(membraneColor, glowColor, particles);
        membraneWithParticles *= bioActivity;
        finalColor = membraneWithParticles;
        finalAlpha = membraneAlpha * 0.4; // Прозрачная оболочка
      }
      
      // Ядро (плотное)
      if (nucleusAlpha > 0.0) {
        vec3 activeNucleus = nucleusColor * cellularMotion;
        finalColor = mix(finalColor, activeNucleus, nucleusAlpha);
        finalAlpha = max(finalAlpha, nucleusAlpha * 0.9);
      }
      
      // Биолюминесценция
      float bioluminescence = exp(-distFromCenter * 2.0) * 0.3 * bioActivity;
      finalColor += glowColor * bioluminescence;
      
      // Эффекты взаимодействия
      if (u_isHovering == 1) {
        finalColor *= 1.3;
        float activationPulse = sin(timeOffset * 6.0) * 0.2 + 1.0;
        finalColor *= activationPulse;
        finalAlpha *= 1.2;
      }
      
      if (u_isClicking == 1) {
        // Эффект "обучения" молекулы
        float learningPulse = sin(timeOffset * 15.0) * 0.4 + 1.0;
        finalColor *= learningPulse;
        finalAlpha *= 1.5;
        
        // Информационные волны
        float infoWaves = sin(distFromCenter * 30.0 - timeOffset * 10.0) * 0.3;
        finalAlpha += infoWaves * 0.3;
      }
      
      finalAlpha = clamp(finalAlpha, 0.0, 1.0);
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

  const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string,
  ): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const createProgram = (gl: WebGLRenderingContext): WebGLProgram | null => {
      const vertexShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource,
      );
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource,
      );

      if (!vertexShader || !fragmentShader) return null;

      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    };

    glRef.current = gl;
    const program = createProgram(gl);
    if (!program) return;

    programRef.current = program;

    const positions = new Float32Array([
      -40, -40, 0, 0, 40, -40, 1, 0, -40, 40, 0, 1, 40, 40, 1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(texCoordLocation);

    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }, [isMobile, vertexShaderSource, fragmentShaderSource]);

  useEffect(() => {
    if (isMobile) return;

    const sampleBackgroundColor = (x: number, y: number) => {
      try {
        const element = document.elementFromPoint(x, y);
        if (!element)
          return theme === "dark"
            ? { r: 0.05, g: 0.05, b: 0.05 }
            : { r: 0.98, g: 0.98, b: 0.98 };

        let currentElement: Element | null = element;
        const colors: Array<{ r: number; g: number; b: number; a: number }> =
          [];

        // Собираем все цвета по иерархии включая прозрачные
        while (
          currentElement &&
          currentElement !== document.body.parentElement
        ) {
          const style = getComputedStyle(currentElement as HTMLElement);
          const bgColor = style.backgroundColor;
          const bgImage = style.backgroundImage;

          // Проверяем background-image для градиентов
          if (bgImage && bgImage !== "none") {
            // Для градиентов берем средний цвет или доминирующий
            if (bgImage.includes("gradient")) {
              // Упрощенная логика для градиентов - берем тему как основу
              colors.push(
                theme === "dark"
                  ? { r: 0.15, g: 0.15, b: 0.2, a: 0.8 }
                  : { r: 0.9, g: 0.9, b: 0.95, a: 0.8 },
              );
            }
          }

          // Парсим backgroundColor включая rgba
          if (bgColor && bgColor !== "transparent") {
            const rgbaMatch = bgColor.match(
              /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
            );
            if (rgbaMatch && rgbaMatch[1] && rgbaMatch[2] && rgbaMatch[3]) {
              const alpha = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
              if (alpha > 0.1) {
                // Игнорируем почти прозрачные
                colors.push({
                  r: parseInt(rgbaMatch[1]) / 255,
                  g: parseInt(rgbaMatch[2]) / 255,
                  b: parseInt(rgbaMatch[3]) / 255,
                  a: alpha,
                });
              }
            }
          }

          currentElement = currentElement.parentElement;
        }

        // Если нашли цвета, смешиваем их
        if (colors.length > 0) {
          let finalR = 0,
            finalG = 0,
            finalB = 0,
            totalAlpha = 0;

          // Смешиваем цвета с учетом прозрачности
          for (const color of colors) {
            const weight = color.a;
            finalR += color.r * weight;
            finalG += color.g * weight;
            finalB += color.b * weight;
            totalAlpha += weight;
          }

          if (totalAlpha > 0) {
            return {
              r: finalR / totalAlpha,
              g: finalG / totalAlpha,
              b: finalB / totalAlpha,
            };
          }
        }

        // Fallback на body/html
        const bodyStyle = getComputedStyle(document.body);
        const bodyBg = bodyStyle.backgroundColor;
        if (
          bodyBg &&
          bodyBg !== "rgba(0, 0, 0, 0)" &&
          bodyBg !== "transparent"
        ) {
          const match = bodyBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match && match[1] && match[2] && match[3]) {
            return {
              r: parseInt(match[1]) / 255,
              g: parseInt(match[2]) / 255,
              b: parseInt(match[3]) / 255,
            };
          }
        }

        return theme === "dark"
          ? { r: 0.05, g: 0.05, b: 0.05 }
          : { r: 0.98, g: 0.98, b: 0.98 };
      } catch {
        return theme === "dark"
          ? { r: 0.05, g: 0.05, b: 0.05 }
          : { r: 0.98, g: 0.98, b: 0.98 };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const bgColor = sampleBackgroundColor(e.clientX, e.clientY);
      const luminance =
        0.299 * bgColor.r + 0.587 * bgColor.g + 0.114 * bgColor.b;

      // Отступ от краев для полного скрытия
      const margin = 4;
      const isInBounds =
        e.clientX >= margin &&
        e.clientX <= window.innerWidth - margin &&
        e.clientY >= margin &&
        e.clientY <= window.innerHeight - margin;

      setCursorState((prev) => ({
        ...prev,
        targetX: e.clientX,
        targetY: e.clientY,
        bgLuminance: luminance,
        bgColor,
        isVisible: isInBounds,
      }));
      checkHoverState(e);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      setCursorState((prev) => ({
        ...prev,
        isClicking: true,
        targetScale: 1.08,
        clickStartElement: target,
      }));
    };

    const handleMouseUp = () => {
      setCursorState((prev) => ({
        ...prev,
        isClicking: false,
        targetScale: prev.isHovering ? 1.05 : 1,
        clickStartElement: null,
      }));
    };

    const checkHoverState = (e: MouseEvent) => {
      const target = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement;
      if (
        target &&
        target.closest(
          'button, a, [role="button"], input, textarea, select, .interactive',
        )
      ) {
        setCursorState((prev) => ({
          ...prev,
          isHovering: true,
          targetScale: 1.05,
        }));
      } else {
        setCursorState((prev) => ({
          ...prev,
          isHovering: false,
          targetScale: 1,
        }));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile, theme]);

  useEffect(() => {
    if (isMobile) return;

    const animate = (time: number) => {
      setCursorState((prev) => {
        const newX = prev.targetX;
        const newY = prev.targetY;

        const velocity = {
          x: newX - prev.x,
          y: newY - prev.y,
        };

        const newScale = prev.scale + (prev.targetScale - prev.scale) * 0.08;

        return {
          ...prev,
          x: newX,
          y: newY,
          velocity,
          scale: newScale,
          trail: [],
        };
      });

      const canvas = canvasRef.current;
      const gl = glRef.current;
      const program = programRef.current;

      if (canvas && gl && program && cursorState.isVisible) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        const timeLocation = gl.getUniformLocation(program, "u_time");
        const mouseLocation = gl.getUniformLocation(program, "u_mouse");
        const resolutionLocation = gl.getUniformLocation(
          program,
          "u_resolution",
        );
        const velocityLocation = gl.getUniformLocation(program, "u_velocity");
        const scaleLocation = gl.getUniformLocation(program, "u_scale");
        const isHoveringLocation = gl.getUniformLocation(
          program,
          "u_isHovering",
        );
        const isClickingLocation = gl.getUniformLocation(
          program,
          "u_isClicking",
        );
        const isDarkLocation = gl.getUniformLocation(program, "u_isDark");
        const bgLuminanceLocation = gl.getUniformLocation(
          program,
          "u_bgLuminance",
        );
        const bgColorLocation = gl.getUniformLocation(program, "u_bgColor");

        gl.uniform1f(timeLocation, time * 0.001);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(
          velocityLocation,
          Math.sqrt(cursorState.velocity.x ** 2 + cursorState.velocity.y ** 2),
        );
        gl.uniform1i(isHoveringLocation, cursorState.isHovering ? 1 : 0);
        gl.uniform1i(isClickingLocation, cursorState.isClicking ? 1 : 0);
        gl.uniform1i(isDarkLocation, theme === "dark" ? 1 : 0);
        gl.uniform1f(bgLuminanceLocation, cursorState.bgLuminance);
        gl.uniform3f(
          bgColorLocation,
          cursorState.bgColor.r,
          cursorState.bgColor.g,
          cursorState.bgColor.b,
        );

        gl.uniform2f(mouseLocation, cursorState.x, cursorState.y);
        gl.uniform1f(scaleLocation, cursorState.scale);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      } else if (canvas && gl) {
        // Очищаем canvas когда курсор не видим
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cursorState, theme, isMobile]);

  // Отключаем курсор на мобильных устройствах
  if (isMobile) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
      style={{
        mixBlendMode: "normal",
        willChange: "transform",
        opacity: cursorState.isVisible ? 1 : 0,
        transition: "opacity 0.1s ease-out",
      }}
    />
  );
};

export default CinematicCursor;
