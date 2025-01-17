"use client";

import { useEffect, useRef } from "react";

export default function NumbersEffect() {
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

    // Particles system
    const particles: Array<{
      x: number;
      y: number;
      number: string;
      size: number;
      speed: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      fadeDirection: 1 | -1;
      trail: Array<{ x: number; y: number; opacity: number }>;
      sparkles: Array<{
        x: number;
        y: number;
        size: number;
        opacity: number;
        speed: { x: number; y: number };
      }>;
      hue: number;
    }> = [];

    // Create particles
    const createParticles = () => {
      const numbers = ["1", "2", "3"];
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          number: numbers[i % 3],
          size: Math.random() * 25 + 25,
          speed: Math.random() * 1 + 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.5 + 0.3,
          fadeDirection: 1,
          trail: [],
          sparkles: [],
          hue: Math.random() * 60 + 30, // Golden hues
        });
      }
    };

    createParticles();

    // Draw sparkle
    const drawSparkle = (
      x: number,
      y: number,
      size: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size, 0);
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Draw trail
        particle.trail.forEach((point, index) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${particle.hue}, 100%, 75%, ${point.opacity})`;
          ctx.fill();
          point.opacity *= 0.95;
        });

        // Update trail
        particle.trail.push({
          x: particle.x,
          y: particle.y,
          opacity: 0.5,
        });
        if (particle.trail.length > 5) {
          particle.trail.shift();
        }

        // Draw main number with glow
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        // Add glow effect
        ctx.shadowColor = `hsla(${particle.hue}, 100%, 75%, ${particle.opacity})`;
        ctx.shadowBlur = 15;

        // Draw number
        ctx.font = `bold ${particle.size}px Arial`;
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(particle.number, 0, 0);
        ctx.restore();

        // Update sparkles
        if (Math.random() < 0.1) {
          particle.sparkles.push({
            x: particle.x,
            y: particle.y,
            size: Math.random() * 4 + 2,
            opacity: 1,
            speed: {
              x: (Math.random() - 0.5) * 4,
              y: (Math.random() - 0.5) * 4,
            },
          });
        }

        // Draw and update sparkles
        particle.sparkles.forEach((sparkle, index) => {
          drawSparkle(sparkle.x, sparkle.y, sparkle.size, sparkle.opacity);
          sparkle.x += sparkle.speed.x;
          sparkle.y += sparkle.speed.y;
          sparkle.opacity *= 0.95;
          sparkle.size *= 0.97;

          if (sparkle.opacity < 0.1) {
            particle.sparkles.splice(index, 1);
          }
        });

        // Update particle
        particle.y -= particle.speed;
        particle.rotation += particle.rotationSpeed;
        particle.opacity += 0.01 * particle.fadeDirection;

        if (particle.opacity >= 0.8) particle.fadeDirection = -1;
        if (particle.opacity <= 0.3) particle.fadeDirection = 1;

        // Reset position
        if (particle.y < -50) {
          particle.y = canvas.height + 50;
          particle.x = Math.random() * canvas.width;
          particle.trail = [];
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
