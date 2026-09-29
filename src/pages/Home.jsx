import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const glowRef = useRef(null);
  const [stats, setStats] = useState({ students: 0, skills: 0, exchanges: 0 });

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 3;
    let currentX = mouseX;
    let currentY = mouseY;
    let animationId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      if (glow) {
        glow.style.background = `radial-gradient(700px circle at ${currentX}px ${currentY}px, rgba(74, 92, 106, 0.22), rgba(37, 55, 69, 0.08) 30%, transparent 50%)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.15 },
    );
    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale",
    );
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  useEffect(() => {
    const target = { students: 2500, skills: 850, exchanges: 1200 };
    const duration = 2000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setStats({
        students: Math.floor(target.students * ease),
        skills: Math.floor(target.skills * ease),
        exchanges: Math.floor(target.exchanges * ease),
      });
      if (progress >= 1) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div
        ref={glowRef}
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

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <section
          className="text-center"
          style={{
            padding: "100px 20px 80px",
            maxWidth: "950px",
            margin: "0 auto",
          }}
        >
          <div
            className="animate-float"
            style={{
              display: "inline-block",
              padding: "8px 20px",
              background: "rgba(37, 55, 69, 0.4)",
              border: "1px solid var(--surface-2)",
              borderRadius: "999px",
              fontSize: "13px",
              color: "var(--muted)",
              marginBottom: "32px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--success)",
                marginRight: "8px",
                animation: "pulseGlow 2s ease-in-out infinite",
              }}
            />
            Built for students, by students
          </div>

          <h1
            style={{
              fontSize: "clamp(44px, 8vw, 96px)",
              fontWeight: "800",
              lineHeight: "0.95",
              letterSpacing: "-0.03em",
              marginBottom: "32px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <span style={{ display: "block" }}>
              {"Swap Skills,".split("").map((char, i) => (
                <span
                  key={i}
                  className="letter-reveal"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <span
              className="gradient-text"
              style={{ display: "block", marginTop: "8px" }}
            >
              {"Grow Together".split("").map((char, i) => (
                <span
                  key={i}
                  className="letter-reveal"
                  style={{ animationDelay: `${0.6 + i * 0.04}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="animate-fadeInUp delay-7"
            style={{
              fontSize: "clamp(16px, 1.5vw, 20px)",
              color: "var(--muted)",
              maxWidth: "620px",
              margin: "0 auto 48px",
              lineHeight: "1.7",
            }}
          >
            Teach what you know. Learn what you love. Connect with students
            around you and exchange skills —{" "}
            <span style={{ color: "var(--text-light)", fontWeight: "500" }}>
              no money, just knowledge.
            </span>
          </p>

          <div
            className="animate-fadeInUp delay-8"
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              className="btn btn-shimmer"
              style={{
                padding: "16px 36px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "12px",
              }}
            >
              Get Started Free →
            </Link>
            <Link
              to="/skills"
              className="btn btn-outline"
              style={{
                padding: "16px 36px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Browse Skills
              <span style={{ animation: "bounce 2s infinite" }}>↓</span>
            </Link>
          </div>
        </section>

        <section
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "32px",
            padding: "40px 20px",
            maxWidth: "900px",
            margin: "40px auto 80px",
            borderTop: "1px solid var(--surface-2)",
            borderBottom: "1px solid var(--surface-2)",
          }}
        >
          <StatItem value={stats.students} label="Active Students" suffix="+" />
          <StatItem value={stats.skills} label="Skills Listed" suffix="+" />
          <StatItem value={stats.exchanges} label="Exchanges Made" suffix="+" />
        </section>

        <section style={{ padding: "60px 0" }}>
          <div className="reveal">
            <h2
              className="text-center"
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                marginBottom: "16px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              How It Works
            </h2>
            <p
              className="text-center"
              style={{
                color: "var(--muted)",
                marginBottom: "64px",
                maxWidth: "550px",
                margin: "0 auto 64px",
                fontSize: "16px",
              }}
            >
              Three simple steps to start exchanging skills
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            <FeatureCard
              icon="📝"
              number="01"
              title="List Your Skills"
              description="Add skills you can teach — React, Photoshop, Spanish, anything. Set your level: Beginner, Intermediate, or Advanced."
              delay="0s"
            />
            <FeatureCard
              icon="🔍"
              number="02"
              title="Find Partners"
              description="Browse other students' skills. Filter by category, level, or search for exactly what you want to learn."
              delay="0.15s"
            />
            <FeatureCard
              icon="🤝"
              number="03"
              title="Exchange & Grow"
              description="Send an exchange request. Once accepted, you both teach each other — no money, just learning."
              delay="0.3s"
            />
          </div>
        </section>

        <section style={{ padding: "60px 0" }}>
          <div className="marquee-wrapper" style={{ padding: "20px 0" }}>
            <div className="marquee">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", gap: "32px", paddingRight: "32px" }}
                >
                  {[
                    "Web Development",
                    "Graphic Design",
                    "Marketing",
                    "Video Editing",
                    "Office Skills",
                    "Languages",
                    "Photography",
                    "Music",
                    "Writing",
                    "Data Science",
                  ].map((cat) => (
                    <span
                      key={cat}
                      style={{
                        padding: "10px 24px",
                        background: "var(--surface-1)",
                        border: "1px solid var(--surface-2)",
                        borderRadius: "999px",
                        color: "var(--muted)",
                        fontSize: "14px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="reveal-scale card"
          style={{
            padding: "80px 32px",
            margin: "80px auto",
            maxWidth: "800px",
            background:
              "linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="animate-floatRotate"
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              fontSize: "60px",
              opacity: 0.15,
            }}
          >
            🎓
          </div>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              marginBottom: "20px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Ready to start swapping?
          </h2>
          <p
            style={{
              color: "var(--muted)",
              marginBottom: "40px",
              maxWidth: "500px",
              margin: "0 auto 40px",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            Join thousands of students who are learning new skills every day —
            without spending a rupee.
          </p>
          <Link
            to="/register"
            className="btn btn-shimmer"
            style={{
              padding: "16px 40px",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "12px",
            }}
          >
            Create Free Account
          </Link>
        </section>
      </div>
    </div>
  );
}

function StatItem({ value, label, suffix }) {
  return (
    <div className="text-center">
      <div
        style={{
          fontSize: "clamp(32px, 4vw, 44px)",
          fontWeight: "800",
          fontFamily: "'Space Grotesk', sans-serif",
          color: "var(--text-light)",
          marginBottom: "8px",
          letterSpacing: "-0.02em",
        }}
      >
        {value.toLocaleString()}
        {suffix}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon, number, title, description, delay }) {
  return (
    <div
      className="card card-3d reveal-scale"
      style={{
        transitionDelay: delay,
        padding: "32px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          fontSize: "12px",
          fontWeight: "700",
          color: "var(--surface-2)",
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: "0.1em",
        }}
      >
        {number}
      </div>

      <div
        className="animate-float"
        style={{
          fontSize: "48px",
          marginBottom: "24px",
          animationDelay: delay,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "22px",
          fontWeight: "700",
          marginBottom: "12px",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "var(--muted)",
          fontSize: "15px",
          lineHeight: "1.7",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default Home;
