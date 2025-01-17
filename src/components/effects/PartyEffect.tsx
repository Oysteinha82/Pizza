"use client";

import { useEffect, useRef } from "react";

export default function PartyEffect() {
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

    // Confetti particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      shape: "circle" | "square" | "triangle";
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      wobble: number;
      wobbleSpeed: number;
      gravity: number;
      opacity: number;
      fadeSpeed: number;
    }> = [];

    // Create particles
    const createParticles = () => {
      const colors = [
        "#FFD700", // Gold
        "#FF6B6B", // Red
        "#4ECDC4", // Turquoise
        "#45B7D1", // Blue
        "#96CEB4", // Green
        "#FFEEAD", // Light Yellow
      ];

      const shapes: Array<"circle" | "square" | "triangle"> = [
        "circle",
        "square",
        "triangle",
      ];

      const particleCount = 40;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 20,
          size: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          speedX: (Math.random() - 0.5) * 3,
          speedY: -Math.random() * 3 - 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.05,
          gravity: 0.1,
          opacity: 1,
          fadeSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    createParticles();

    // Draw shapes
    const drawShape = (
      x: number,
      y: number,
      size: number,
      color: string,
      shape: "circle" | "square" | "triangle",
      rotation: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;

      switch (shape) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "square":
          ctx.fillRect(-size, -size, size * 2, size * 2);
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(-size, size);
          ctx.lineTo(size, size);
          ctx.lineTo(0, -size);
          ctx.closePath();
          ctx.fill();
          break;
      }

      ctx.restore();
    };

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Add wobble to X position
        const wobbleX = Math.sin(particle.wobble) * 2;

        drawShape(
          particle.x + wobbleX,
          particle.y,
          particle.size,
          particle.color,
          particle.shape,
          particle.rotation,
          particle.opacity
        );

        // Update particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.speedY += particle.gravity;
        particle.rotation += particle.rotationSpeed;
        particle.wobble += particle.wobbleSpeed;
        particle.opacity -= particle.fadeSpeed;

        // Reset particle if it's dead or off screen
        if (
          particle.opacity <= 0 ||
          particle.y > canvas.height + 50 ||
          particle.x < -50 ||
          particle.x > canvas.width + 50
        ) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 20,
            size: Math.random() * 6 + 3,
            color: [
              "#FFD700",
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#96CEB4",
              "#FFEEAD",
            ][Math.floor(Math.random() * 6)],
            shape: ["circle", "square", "triangle"][
              Math.floor(Math.random() * 3)
            ] as "circle" | "square" | "triangle",
            speedX: (Math.random() - 0.5) * 3,
            speedY: -Math.random() * 3 - 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.05,
            gravity: 0.1,
            opacity: 1,
            fadeSpeed: Math.random() * 0.02 + 0.005,
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
