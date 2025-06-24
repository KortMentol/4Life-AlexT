import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface ParticleSystemProps {
  mouseX: number;
  mouseY: number;
  isActive: boolean;
  theme: "light" | "dark";
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  mouseX,
  mouseY,
  isActive,
  theme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors =
      theme === "dark"
        ? ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"]
        : ["#60a5fa", "#93c5fd", "#3b82f6", "#2563eb"];

    const createParticle = (x: number, y: number): Particle => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
      maxLife: Math.random() * 60 + 30,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)] || "#3b82f6",
    });

    const updateParticles = () => {
      // Добавляем новые частицы при активности
      if (isActive && Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 20;
        particlesRef.current.push(
          createParticle(
            mouseX + Math.cos(angle) * radius,
            mouseY + Math.sin(angle) * radius,
          ),
        );
      }

      // Обновляем существующие частицы
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.life -= 1;
        particle.size *= 0.99;

        return particle.life > 0 && particle.size > 0.1;
      });

      // Ограничиваем количество частиц
      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mouseX, mouseY, isActive, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9998]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default ParticleSystem;
