import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function StudentProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 20px" }}>
        <p style={{ color: "var(--muted)" }}>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: "80px 20px" }}>
        <p style={{ color: "var(--muted)" }}>User not found.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div
        className="card"
        style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "8px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {user.name}
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
          {user.email}
        </p>

        {user.bio && (
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                marginBottom: "8px",
              }}
            >
              Bio
            </h3>
            <p style={{ lineHeight: "1.7" }}>{user.bio}</p>
          </div>
        )}

        {user.skillsToTeach && user.skillsToTeach.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                marginBottom: "12px",
              }}
            >
              Can Teach
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {user.skillsToTeach.map((s, i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 14px",
                    background: "var(--surface-2)",
                    borderRadius: "999px",
                    fontSize: "13px",
                  }}
                >
                  {s.name || s}
                </span>
              ))}
            </div>
          </div>
        )}

        {user.skillsToLearn && user.skillsToLearn.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                marginBottom: "12px",
              }}
            >
              Wants to Learn
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {user.skillsToLearn.map((s, i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 14px",
                    background: "var(--surface-1)",
                    border: "1px solid var(--surface-2)",
                    borderRadius: "999px",
                    fontSize: "13px",
                    color: "var(--muted)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
