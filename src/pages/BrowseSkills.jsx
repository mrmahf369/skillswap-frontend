import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function BrowseSkills() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  // Request modal
  const [requestSkill, setRequestSkill] = useState(null);
  const [mySkills, setMySkills] = useState([]);
  const [selectedOffered, setSelectedOffered] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ type: "", text: "" });

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
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (level) params.append("level", level);

      const res = await api.get(`/skills?${params.toString()}`);
      setSkills(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySkills = async () => {
    if (!user?._id) return;
    try {
      const res = await api.get(`/skills?owner=${user._id}`);
      setMySkills(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchMySkills();
  }, [search, category, level]);

  // Toast auto-hide
  useEffect(() => {
    if (toast.text) {
      const timer = setTimeout(() => setToast({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const openRequestModal = (skill) => {
    setRequestSkill(skill);
    setSelectedOffered("");
    setRequestMessage("");
  };

  const closeRequestModal = () => {
    setRequestSkill(null);
    setSelectedOffered("");
    setRequestMessage("");
  };

  const sendRequest = async () => {
    if (!selectedOffered) {
      setToast({
        type: "error",
        text: "Please select a skill you want to offer",
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/requests", {
        receiverId: requestSkill.owner._id,
        offeredSkillId: selectedOffered,
        requestedSkillId: requestSkill._id,
        message: requestMessage || "",
      });
      setToast({
        type: "success",
        text: `Request sent to ${requestSkill.owner.name}! 🎉`,
      });
      closeRequestModal();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send request";
      setToast({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const startChat = async (ownerId) => {
    try {
      await api.post("/chat/conversations", { receiverId: ownerId });
      navigate("/messages");
    } catch (err) {
      setToast({ type: "error", text: "Failed to start chat" });
    }
  };

  const isOwnSkill = (skill) =>
    skill.owner?._id === user?._id || skill.owner === user?._id;

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      {/* Toast */}
      {toast.text && (
        <div
          style={{
            position: "fixed",
            top: "90px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 24px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            zIndex: 9999,
            background:
              toast.type === "success"
                ? "rgba(74, 222, 128, 0.95)"
                : "rgba(248, 113, 113, 0.95)",
            color: "#fff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            animation: "fadeInUp 0.3s ease",
          }}
        >
          {toast.text}
        </div>
      )}

      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 36px)",
          marginBottom: "8px",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        Browse Skills
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "32px" }}>
        Find students who can teach what you want to learn
      </p>

      {/* Filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : skills.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No skills found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {skills.map((s) => (
            <div
              key={s._id}
              className="card card-3d"
              style={{ display: "flex", flexDirection: "column" }}
            >
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
                  marginBottom: "12px",
                }}
              >
                {s.category} · {s.level}
              </p>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "14px",
                  marginBottom: "16px",
                  flex: 1,
                }}
              >
                {s.description}
              </p>

              {s.owner && (
                <div
                  style={{
                    borderTop: "1px solid var(--surface-2)",
                    paddingTop: "16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      marginBottom: "12px",
                    }}
                  >
                    By{" "}
                    <span
                      style={{ color: "var(--text-light)", fontWeight: "600" }}
                    >
                      {s.owner.name}
                    </span>
                  </p>

                  {isOwnSkill(s) ? (
                    <Link
                      to="/my-skills"
                      className="btn btn-outline"
                      style={{
                        padding: "8px 14px",
                        fontSize: "12px",
                        display: "block",
                        textAlign: "center",
                      }}
                    >
                      ✏️ Your Skill
                    </Link>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() => openRequestModal(s)}
                        className="btn btn-primary"
                        style={{
                          padding: "8px 12px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        📨 Request
                      </button>
                      <button
                        onClick={() => startChat(s.owner._id)}
                        className="btn btn-outline"
                        style={{
                          padding: "8px 12px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        💬 Chat
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {requestSkill && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={closeRequestModal}
        >
          <div
            className="card"
            style={{
              maxWidth: "480px",
              width: "100%",
              padding: "32px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: "22px",
                marginBottom: "8px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Send Request
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              You want:{" "}
              <span style={{ color: "var(--text-light)", fontWeight: "600" }}>
                {requestSkill.name}
              </span>{" "}
              from{" "}
              <span style={{ color: "var(--text-light)", fontWeight: "600" }}>
                {requestSkill.owner.name}
              </span>
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "var(--muted)",
                }}
              >
                What will you offer in return?
              </label>
              {mySkills.length === 0 ? (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(251, 191, 36, 0.1)",
                    border: "1px solid var(--warning)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "var(--warning)",
                  }}
                >
                  You don't have any skills yet.{" "}
                  <Link
                    to="/my-skills"
                    style={{
                      color: "var(--text-light)",
                      textDecoration: "underline",
                    }}
                  >
                    Add a skill
                  </Link>{" "}
                  first.
                </div>
              ) : (
                <select
                  value={selectedOffered}
                  onChange={(e) => setSelectedOffered(e.target.value)}
                >
                  <option value="">Select your skill</option>
                  {mySkills.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              )}
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
                Message (optional)
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Hi! I'd love to learn from you..."
                rows="3"
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={sendRequest}
                className="btn btn-primary"
                disabled={submitting || mySkills.length === 0}
                style={{
                  flex: 1,
                  padding: "12px",
                  opacity: submitting || mySkills.length === 0 ? 0.6 : 1,
                }}
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
              <button
                onClick={closeRequestModal}
                className="btn btn-outline"
                style={{ padding: "12px 24px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseSkills;
