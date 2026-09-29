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

    const particles = [];
    const MAX_PARTICLES = 120;

    const COLORS = [
      "rgba(204, 208, 207, 0.9)",
      "rgba(155, 168, 171, 0.8)",
      "rgba(74, 92, 106, 0.9)",
      "rgba(92, 114, 130, 0.85)",
    ];

    let lastSpawn = 0;

    const spawnParticles = (x, y) => {
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) break;

        const isStar = Math.random() < 0.6;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 1.2;

        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: isStar ? 3 + Math.random() * 3 : 1.5 + Math.random() * 2,
          life: 1,
          decay: 0.012 + Math.random() * 0.015,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          isStar,
        });
      }
    };

    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastSpawn > 16) {
        spawnParticles(e.clientX, e.clientY);
        lastSpawn = now;
      }
    };

    const drawStar = (p) => {
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(0, s);
      ctx.moveTo(-s, 0);
      ctx.lineTo(s, 0);
      ctx.moveTo(-s * 0.5, -s * 0.5);
      ctx.lineTo(s * 0.5, s * 0.5);
      ctx.moveTo(-s * 0.5, s * 0.5);
      ctx.lineTo(s * 0.5, -s * 0.5);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    };

    const drawDot = (p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fill();
    };

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;
        p.size *= 0.99;

        if (p.life <= 0 || p.size < 0.3) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;

        if (p.isStar) {
          drawStar(p);
        } else {
          drawDot(p);
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
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
        zIndex: 9999,
      }}
    />
  );
}

export default CursorEffect;
