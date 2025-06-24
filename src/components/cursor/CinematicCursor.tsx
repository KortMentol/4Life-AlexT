import React, { useEffect, useRef } from "react";

const IS_TOUCH_DEVICE =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);
const CURSOR_SIZE = 96;

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_position * 0.5 + 0.5;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform float u_time;
  uniform float u_velocity;
  uniform float u_scale;
  uniform int u_isHovering;
  uniform int u_isClicking;
  varying vec2 v_texCoord;
  
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
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
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 p = v_texCoord - 0.5;
    float dist = length(p);
    
    float outerRadius = 0.35 * u_scale;
    float innerRadius = 0.15 * u_scale;
    
    if (u_isHovering == 1) outerRadius *= 1.1;
    if (u_isClicking == 1) { outerRadius *= 0.9; innerRadius *= 1.2; }

    float t = u_time * 0.8;
    float nucleus = smoothstep(innerRadius + 0.02, innerRadius, dist + fbm(p * 5.0 + t) * 0.05);
    float membrane = smoothstep(outerRadius + 0.01, outerRadius, dist + fbm(p * 4.0 - t * 0.5) * 0.08);

    vec3 membraneColor = vec3(0.8, 0.9, 1.0);
    vec3 nucleusColor = vec3(1.0);
    
    vec3 color = mix(vec3(0.0), membraneColor, membrane * 0.4);
    color = mix(color, nucleusColor, nucleus);

    float alpha = max(membrane * 0.4, nucleus);

    if (u_isClicking == 1) {
      float pulse = sin(dist * 25.0 - u_time * 10.0) * 0.5 + 0.5;
      color += vec3(0.2, 0.3, 0.5) * pulse * (1.0 - dist * 2.0);
      alpha = min(1.0, alpha * 1.5);
    }
    
    gl_FragColor = vec4(color, alpha * smoothstep(0.5, 0.4, dist));
  }
`;

const CinematicCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    x: -100,
    y: -100,
    targetX: -100,
    targetY: -100,
    vx: 0,
    vy: 0,
    scale: 1,
    targetScale: 1,
    isHovering: false,
    isClicking: false,
    isVisible: false,
  });

  useEffect(() => {
    if (IS_TOUCH_DEVICE) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) return;

    const createShader = (type: number, source: string) => {
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

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const velLoc = gl.getUniformLocation(program, "u_velocity");
    const scaleLoc = gl.getUniformLocation(program, "u_scale");
    const hoverLoc = gl.getUniformLocation(program, "u_isHovering");
    const clickLoc = gl.getUniformLocation(program, "u_isClicking");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let animationFrameId: number;

    const animate = (time: number) => {
      const state = stateRef.current;

      state.x += (state.targetX - state.x) * 0.2;
      state.y += (state.targetY - state.y) * 0.2;
      state.vx = state.targetX - state.x;
      state.vy = state.targetY - state.y;
      state.scale += (state.targetScale - state.scale) * 0.15;

      canvas.style.transform = `translate(${state.x - CURSOR_SIZE / 2}px, ${state.y - CURSOR_SIZE / 2}px)`;

      gl.viewport(0, 0, CURSOR_SIZE, CURSOR_SIZE);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform1f(velLoc, Math.hypot(state.vx, state.vy));
      gl.uniform1f(scaleLoc, state.scale);
      gl.uniform1i(hoverLoc, state.isHovering ? 1 : 0);
      gl.uniform1i(clickLoc, state.isClicking ? 1 : 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.targetX = e.clientX;
      stateRef.current.targetY = e.clientY;
      if (!stateRef.current.isVisible) {
        stateRef.current.isVisible = true;
        canvas.style.opacity = "1";
        stateRef.current.x = e.clientX;
        stateRef.current.y = e.clientY;
      }
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target &&
        target.closest(
          'button, a, [role="button"], input, textarea, select, .interactive',
        );
      stateRef.current.isHovering = !!isInteractive;
      stateRef.current.targetScale = isInteractive ? 1.2 : 1.0;
    };

    const handleMouseDown = () => {
      stateRef.current.isClicking = true;
      stateRef.current.targetScale = 0.9;
    };
    const handleMouseUp = () => {
      stateRef.current.isClicking = false;
      checkHover({
        target: document.elementFromPoint(
          stateRef.current.x,
          stateRef.current.y,
        ),
      } as MouseEvent);
    };
    const handleMouseOut = () => {
      stateRef.current.isVisible = false;
      canvas.style.opacity = "0";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousemove", checkHover);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseout", handleMouseOut);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", checkHover);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (IS_TOUCH_DEVICE) return null;

  return (
    <canvas
      ref={canvasRef}
      width={CURSOR_SIZE}
      height={CURSOR_SIZE}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        opacity: 0,
        transition: "opacity 0.3s ease",
        willChange: "transform, opacity",
      }}
    />
  );
};

export default CinematicCursor;
