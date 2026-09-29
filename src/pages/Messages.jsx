import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/chat/conversations");
      setConversations(res.data.data);
      // Update active conversation data
      if (activeConv) {
        const updated = res.data.data.find((c) => c._id === activeConv._id);
        if (updated) setActiveConv(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1
        style={{
          fontSize: "clamp(24px, 4vw, 32px)",
          marginBottom: "20px",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        Messages
      </h1>

      <div
        className="card"
        style={{
          padding: 0,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
          height: "calc(100vh - 240px)",
          minHeight: "500px",
          overflow: "hidden",
        }}
      >
        {/* Chat List */}
        {(!isMobile || !activeConv) && (
          <div
            style={{
              borderRight: isMobile ? "none" : "1px solid var(--surface-2)",
              overflowY: "auto",
              background: "var(--surface-1)",
            }}
          >
            {loading ? (
              <p style={{ padding: "20px", color: "var(--muted)" }}>
                Loading...
              </p>
            ) : (
              <ChatList
                conversations={conversations}
                activeId={activeConv?._id}
                onSelect={(c) => setActiveConv(c)}
              />
            )}
          </div>
        )}

        {/* Chat Window */}
        {(!isMobile || activeConv) && (
          <div style={{ background: "var(--bg-deep)", overflow: "hidden" }}>
            {activeConv ? (
              <ChatWindow
                conversation={activeConv}
                onBack={() => setActiveConv(null)}
                onConversationUpdate={fetchConversations}
              />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--muted)",
                  fontSize: "14px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                Select a chat to start messaging
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
