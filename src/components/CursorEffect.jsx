// src/components/CursorEffect.jsx
// Full-screen flow — waves + circles + dots + smoke + cursor glow

import { useEffect, useRef } from "react";

function CursorEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let mouseActive = false;
    let time = 0;

    // Floating circles
    const CIRCLES_COUNT = 5;
    const circles = [];

    for (let i = 0; i < CIRCLES_COUNT; i++) {
      circles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 60 + Math.random() * 100,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        dotsCount: 4 + Math.floor(Math.random() * 3),
        depth: 0.3 + Math.random() * 0.7,
      });
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    const drawWave = (
      offsetY,
      amplitude,
      frequency,
      speed,
      color,
      thickness,
    ) => {
      ctx.beginPath();
      const points = 100;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * canvas.width;
        const y =
          offsetY +
          Math.sin((i / points) * frequency + time * speed) * amplitude +
          Math.sin((i / points) * frequency * 0.5 + time * speed * 0.7) *
            amplitude *
            0.5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.stroke();
    };

    const drawCircle = (circle) => {
      const px = mouseActive ? currentX - canvas.width / 2 : 0;
      const py = mouseActive ? currentY - canvas.height / 2 : 0;
      const offsetX = (px / canvas.width) * 40 * circle.depth;
      const offsetY = (py / canvas.height) * 40 * circle.depth;

      const cx = circle.x + offsetX;
      const cy = circle.y + offsetY;

      ctx.beginPath();
      ctx.arc(cx, cy, circle.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120, 180, 220, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let d = 0; d < circle.dotsCount; d++) {
        const angle = circle.rotation + (d / circle.dotsCount) * Math.PI * 2;
        const dotX = cx + Math.cos(angle) * circle.radius;
        const dotY = cy + Math.sin(angle) * circle.radius;

        const dotGlow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 15);
        dotGlow.addColorStop(0, "rgba(180, 220, 255, 0.7)");
        dotGlow.addColorStop(1, "transparent");
        ctx.fillStyle = dotGlow;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220, 240, 255, 1)";
        ctx.fill();
      }
    };

    const drawSmoke = (offset, amplitude, speed, color) => {
      ctx.beginPath();
      const points = 150;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * canvas.width;
        const y =
          offset +
          Math.sin((i / points) * 2 + time * speed) * amplitude +
          Math.cos((i / points) * 1.5 + time * speed * 0.8) * amplitude * 0.7;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 40;
      ctx.lineCap = "round";
      ctx.filter = "blur(30px)";
      ctx.stroke();
      ctx.filter = "none";
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      time += 0.01;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoke layers
      drawSmoke(canvas.height * 0.3, 60, 0.5, "rgba(74, 92, 106, 0.18)");
      drawSmoke(canvas.height * 0.5, 80, 0.3, "rgba(92, 114, 130, 0.15)");
      drawSmoke(canvas.height * 0.7, 70, 0.4, "rgba(120, 180, 220, 0.12)");

      // Waves
      drawWave(canvas.height * 0.25, 30, 6, 0.8, "rgba(120, 180, 220, 0.3)", 2);
      drawWave(
        canvas.height * 0.45,
        40,
        5,
        0.6,
        "rgba(180, 220, 255, 0.25)",
        1.5,
      );
      drawWave(canvas.height * 0.65, 35, 7, 1.0, "rgba(74, 92, 106, 0.35)", 2);

      // Circles
      circles.forEach((circle) => {
        circle.x += circle.speedX;
        circle.y += circle.speedY;
        circle.rotation += circle.rotationSpeed;

        if (circle.x < -circle.radius) circle.x = canvas.width + circle.radius;
        if (circle.x > canvas.width + circle.radius) circle.x = -circle.radius;
        if (circle.y < -circle.radius) circle.y = canvas.height + circle.radius;
        if (circle.y > canvas.height + circle.radius) circle.y = -circle.radius;

        drawCircle(circle);
      });

      // Cursor glow
      if (mouseActive) {
        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          300,
        );
        gradient.addColorStop(0, "rgba(120, 180, 220, 0.18)");
        gradient.addColorStop(0.5, "rgba(74, 92, 106, 0.08)");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default CursorEffect;
