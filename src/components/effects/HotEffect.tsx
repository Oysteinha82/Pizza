"use client";

import { useEffect, useRef } from "react";

export default function HotEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Flame particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      life: number;
      maxLife: number;
      hue: number;
      wobble: number;
      wobbleSpeed: number;
    }> = [];

    // Create particles
    const createParticles = () => {
      const particleCount = 30;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          size: Math.random() * 15 + 8,
          speedY: Math.random() * 1.5 + 0.8,
          life: 0,
          maxLife: Math.random() * 80 + 40,
          hue: Math.random() * 60 + 0, // Red to Yellow
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.05,
        });
      }
    };

    createParticles();

    // Draw flame particle
    const drawFlame = (
      x: number,
      y: number,
      size: number,
      hue: number,
      life: number,
      maxLife: number
    ) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      const alpha = (1 - life / maxLife) * 0.8;

      gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, ${alpha})`);
      gradient.addColorStop(0.4, `hsla(${hue}, 100%, 40%, ${alpha * 0.5})`);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add composite operation for glow effect
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((particle, index) => {
        // Add wobble to X position
        const wobbleX = Math.sin(particle.wobble) * 2;

        drawFlame(
          particle.x + wobbleX,
          particle.y,
          particle.size,
          particle.hue,
          particle.life,
          particle.maxLife
        );

        // Update particle
        particle.y -= particle.speedY;
        particle.life += 1;
        particle.wobble += particle.wobbleSpeed;
        particle.size *= 0.995;

        // Reset particle if it's dead
        if (particle.life >= particle.maxLife || particle.y < -50) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            size: Math.random() * 15 + 8,
            speedY: Math.random() * 1.5 + 0.8,
            life: 0,
            maxLife: Math.random() * 80 + 40,
            hue: Math.random() * 60 + 0,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.05,
          };
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
