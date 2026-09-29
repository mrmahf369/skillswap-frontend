import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface-1)",
        borderTop: "1px solid var(--surface-2)",
        padding: "60px 0 32px",
        marginTop: "80px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "12px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Skill<span style={{ color: "var(--muted)" }}>Swap</span>
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "14px",
                lineHeight: "1.7",
              }}
            >
              Student Skill Exchange Platform — teach what you know, learn what
              you love.
            </p>
          </div>

          <div>
            <h4
              style={{
                fontSize: "14px",
                marginBottom: "16px",
                color: "var(--text-light)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Platform
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Link
                to="/skills"
                style={{ color: "var(--muted)", fontSize: "14px" }}
              >
                Browse Skills
              </Link>
              <Link
                to="/register"
                style={{ color: "var(--muted)", fontSize: "14px" }}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                style={{ color: "var(--muted)", fontSize: "14px" }}
              >
                Login
              </Link>
            </div>
          </div>

          <div>
            <h4
              style={{
                fontSize: "14px",
                marginBottom: "16px",
                color: "var(--text-light)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              About
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <a href="#" style={{ color: "var(--muted)", fontSize: "14px" }}>
                How it works
              </a>
              <a href="#" style={{ color: "var(--muted)", fontSize: "14px" }}>
                Contact
              </a>
              <a href="#" style={{ color: "var(--muted)", fontSize: "14px" }}>
                Privacy
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: "32px",
            borderTop: "1px solid var(--surface-2)",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            © {new Date().getFullYear()} SkillSwap — Student Skill Exchange
            Platform
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
