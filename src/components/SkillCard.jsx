function SkillCard({ skill }) {
  if (!skill) return null;

  return (
    <div className="card card-3d" style={{ padding: "24px" }}>
      <h3
        style={{
          fontSize: "20px",
          marginBottom: "8px",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {skill.name}
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: "var(--accent)",
          marginBottom: "12px",
          fontWeight: "600",
        }}
      >
        {skill.category} · {skill.level}
      </p>
      <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6" }}>
        {skill.description}
      </p>
    </div>
  );
}

export default SkillCard;
