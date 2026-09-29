import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Requests() {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState("received");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const [r1, r2] = await Promise.all([
        api.get("/requests/received"),
        api.get("/requests/sent"),
      ]);
      setReceived(r1.data.data);
      setSent(r2.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/requests/${id}/status`, { status });
      fetchAll();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const startChat = async (userId) => {
    try {
      const res = await api.post("/chat/conversations", { receiverId: userId });
      navigate("/messages");
    } catch (err) {
      alert("Failed to start chat");
    }
  };

  const list = tab === "received" ? received : sent;

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "24px",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        Exchange Requests
      </h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setTab("received")}
          className={tab === "received" ? "btn btn-primary" : "btn btn-outline"}
          style={{ padding: "10px 24px" }}
        >
          Received ({received.length})
        </button>
        <button
          onClick={() => setTab("sent")}
          className={tab === "sent" ? "btn btn-primary" : "btn btn-outline"}
          style={{ padding: "10px 24px" }}
        >
          Sent ({sent.length})
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : list.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No requests yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {list.map((r) => {
            const otherUser = tab === "received" ? r.sender : r.receiver;
            return (
              <div key={r._id} className="card" style={{ padding: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                      {tab === "received"
                        ? `From: ${otherUser?.name}`
                        : `To: ${otherUser?.name}`}
                    </p>
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginTop: "4px",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {r.offeredSkill?.name} ↔ {r.requestedSkill?.name}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      background:
                        r.status === "accepted"
                          ? "rgba(74, 222, 128, 0.15)"
                          : r.status === "rejected"
                            ? "rgba(248, 113, 113, 0.15)"
                            : "rgba(251, 191, 36, 0.15)",
                      color:
                        r.status === "accepted"
                          ? "var(--success)"
                          : r.status === "rejected"
                            ? "var(--error)"
                            : "var(--warning)",
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                {r.message && (
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "14px",
                      padding: "12px",
                      background: "var(--surface-2)",
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    "{r.message}"
                  </p>
                )}

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {tab === "received" && r.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatus(r._id, "accepted")}
                        className="btn btn-primary"
                        style={{ padding: "10px 24px" }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatus(r._id, "rejected")}
                        className="btn btn-outline"
                        style={{ padding: "10px 24px" }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {r.status === "accepted" && otherUser && (
                    <button
                      onClick={() => startChat(otherUser._id)}
                      className="btn btn-primary"
                      style={{ padding: "10px 24px" }}
                    >
                      💬 Message {otherUser.name?.split(" ")[0]}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Requests;
