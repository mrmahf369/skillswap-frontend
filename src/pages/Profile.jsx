import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", bio: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", bio: user.bio || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.put("/users/profile", form);
      setMessage("Profile updated successfully ✅");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div
        className="card"
        style={{ maxWidth: "600px", margin: "0 auto", padding: "40px" }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "24px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          My Profile
        </h1>

        {message && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(74, 222, 128, 0.1)",
              border: "1px solid var(--success)",
              borderRadius: "8px",
              color: "var(--success)",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "13px",
                color: "var(--muted)",
              }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "13px",
                color: "var(--muted)",
              }}
            >
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell others about yourself..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: "12px 28px", fontSize: "14px" }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
