"use client";

import { useEffect, useRef } from "react";

export default function CheeseEffect() {
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

    // Cheese particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      wobbleOffset: number;
      wobbleSpeed: number;
      opacity: number;
      fadeDirection: 1 | -1;
      rotation: number;
      rotationSpeed: number;
      meltDrops: Array<{
        x: number;
        y: number;
        size: number;
        speed: number;
        opacity: number;
      }>;
      sparkles: Array<{
        x: number;
        y: number;
        size: number;
        angle: number;
        opacity: number;
      }>;
    }> = [];

    // Create particles
    const createParticles = () => {
      const particleCount = 15;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 20 + 15,
          speed: Math.random() * 0.8 + 0.3,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
          opacity: Math.random() * 0.5 + 0.3,
          fadeDirection: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          meltDrops: [],
          sparkles: [],
        });
      }
    };

    createParticles();

    // Draw cheese slice
    const drawCheeseSlice = (
      x: number,
      y: number,
      size: number,
      opacity: number,
      rotation: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Add glow effect
      ctx.shadowColor = `rgba(255, 215, 0, ${opacity * 0.5})`;
      ctx.shadowBlur = 15;

      // Draw triangular cheese slice
      ctx.beginPath();
      ctx.moveTo(-size, -size);
      ctx.lineTo(size, -size);
      ctx.lineTo(0, size);
      ctx.closePath();

      // Create gradient
      const gradient = ctx.createLinearGradient(0, -size, 0, size);
      gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`);
      gradient.addColorStop(1, `rgba(255, 180, 0, ${opacity})`);

      ctx.fillStyle = gradient;
      ctx.fill();

      // Add holes
      const holeCount = 3;
      for (let i = 0; i < holeCount; i++) {
        const holeX = (Math.random() - 0.5) * size;
        const holeY = (Math.random() - 0.5) * size;
        ctx.beginPath();
        ctx.arc(holeX, holeY, size * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 180, 0, ${opacity * 1.2})`;
        ctx.fill();
      }

      ctx.restore();
    };

    // Draw sparkle
    const drawSparkle = (
      x: number,
      y: number,
      size: number,
      angle: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rotation = (Math.PI * 2 * i) / 8;
        const radius = i % 2 === 0 ? size : size * 0.4;
        const pointX = Math.cos(rotation) * radius;
        const pointY = Math.sin(rotation) * radius;

        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      ctx.closePath();

      ctx.fillStyle = `rgba(255, 255, 200, ${opacity})`;
      ctx.fill();

      ctx.restore();
    };

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        const wobbleX = Math.sin(particle.wobbleOffset) * 30;

        // Draw main cheese slice
        drawCheeseSlice(
          particle.x + wobbleX,
          particle.y,
          particle.size,
          particle.opacity,
          particle.rotation
        );

        // Update and draw melting drops
        if (Math.random() < 0.1) {
          particle.meltDrops.push({
            x: particle.x + wobbleX + (Math.random() - 0.5) * particle.size,
            y: particle.y + particle.size * 0.8,
            size: particle.size * 0.15,
            speed: Math.random() * 2 + 1,
            opacity: particle.opacity,
          });
        }

        particle.meltDrops.forEach((drop, index) => {
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 215, 0, ${drop.opacity})`;
          ctx.fill();

          drop.y += drop.speed;
          drop.opacity *= 0.97;
          drop.size *= 0.97;

          if (drop.opacity < 0.1) {
            particle.meltDrops.splice(index, 1);
          }
        });

        // Add sparkles
        if (Math.random() < 0.1) {
          particle.sparkles.push({
            x: particle.x + wobbleX + (Math.random() - 0.5) * particle.size,
            y: particle.y + (Math.random() - 0.5) * particle.size,
            size: Math.random() * 4 + 2,
            angle: Math.random() * Math.PI * 2,
            opacity: 1,
          });
        }

        // Update and draw sparkles
        particle.sparkles.forEach((sparkle, index) => {
          drawSparkle(
            sparkle.x,
            sparkle.y,
            sparkle.size,
            sparkle.angle,
            sparkle.opacity
          );
          sparkle.opacity *= 0.95;
          sparkle.size *= 0.97;
          sparkle.angle += 0.1;

          if (sparkle.opacity < 0.1) {
            particle.sparkles.splice(index, 1);
          }
        });

        // Update particle
        particle.y -= particle.speed;
        particle.wobbleOffset += particle.wobbleSpeed;
        particle.rotation += particle.rotationSpeed;
        particle.opacity += 0.01 * particle.fadeDirection;

        if (particle.opacity >= 0.8) particle.fadeDirection = -1;
        if (particle.opacity <= 0.3) particle.fadeDirection = 1;

        // Reset position
        if (particle.y < -50) {
          particle.y = canvas.height + 50;
          particle.x = Math.random() * canvas.width;
          particle.meltDrops = [];
          particle.sparkles = [];
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
