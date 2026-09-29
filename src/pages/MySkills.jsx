import { useState, useEffect } from "react";
import api from "../api/axios";

function MySkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Web Development",
    level: "Beginner",
    description: "",
  });

  const categories = [
    "Web Development",
    "Graphic Design",
    "Marketing",
    "Video Editing",
    "Office Skills",
    "Languages",
    "Other",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const fetchSkills = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/skills?owner=${user._id}`);
      setSkills(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/skills", form);
      setForm({
        name: "",
        category: "Web Development",
        level: "Beginner",
        description: "",
      });
      setShowForm(false);
      fetchSkills();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          My Skills
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ padding: "12px 24px" }}
        >
          {showForm ? "Cancel" : "+ Add Skill"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: "32px", marginBottom: "32px" }}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <input
                type="text"
                placeholder="Skill name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Short description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows="3"
              style={{ marginBottom: "16px" }}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "10px 24px" }}
            >
              Save Skill
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : skills.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          No skills yet. Add your first skill!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {skills.map((s) => (
            <div key={s._id} className="card">
              <h3
                style={{
                  fontSize: "20px",
                  marginBottom: "8px",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {s.name}
              </h3>
              <p
                style={{
                  color: "var(--accent)",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {s.category} · {s.level}
              </p>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                {s.description}
              </p>
              <button
                onClick={() => handleDelete(s._id)}
                className="btn btn-outline"
                style={{ padding: "8px 16px", fontSize: "13px" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySkills;
