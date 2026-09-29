function ChatList({ conversations, activeId, onSelect }) {
  if (conversations.length === 0) {
    return (
      <div
        style={{
          padding: "20px",
          color: "var(--muted)",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        No chats yet. Start by sending an exchange request!
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 24 * 60 * 60 * 1000) {
      return (
        d.getHours().toString().padStart(2, "0") +
        ":" +
        d.getMinutes().toString().padStart(2, "0")
      );
    }
    return d.toLocaleDateString();
  };

  return (
    <div>
      {conversations.map((conv) => (
        <div
          key={conv._id}
          onClick={() => onSelect(conv)}
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--surface-2)",
            cursor: "pointer",
            background:
              activeId === conv._id ? "var(--surface-2)" : "transparent",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            transition: "background 0.2s",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "700",
              flexShrink: 0,
            }}
          >
            {conv.otherUser?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {conv.otherUser?.name || "Unknown"}
              </div>
              {conv.lastMessageAt && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--muted)",
                    flexShrink: 0,
                    marginLeft: "8px",
                  }}
                >
                  {formatDate(conv.lastMessageAt)}
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{conv.lastMessage || "No messages yet"}</span>
              {conv.unreadCount > 0 && (
                <span
                  style={{
                    background: "var(--accent)",
                    color: "var(--text-light)",
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: "700",
                    marginLeft: "8px",
                    flexShrink: 0,
                  }}
                >
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
