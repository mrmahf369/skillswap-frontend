function MessageBubble({ message, isOwn, onDelete }) {
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const hours = d.getHours().toString().padStart(2, "0");
    const mins = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${mins}`;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: isOwn ? "var(--accent)" : "var(--surface-2)",
          color: "var(--text-light)",
          fontSize: "14px",
          lineHeight: "1.4",
          position: "relative",
          wordBreak: "break-word",
        }}
      >
        <div
          style={{
            fontStyle: message.deleted ? "italic" : "normal",
            opacity: message.deleted ? 0.6 : 1,
          }}
        >
          {message.text}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "4px",
            marginTop: "4px",
            fontSize: "11px",
            color: isOwn ? "rgba(255,255,255,0.7)" : "var(--muted)",
          }}
        >
          {formatTime(message.createdAt)}
          {isOwn && !message.deleted && (
            <span>{message.read ? "✓✓" : "✓"}</span>
          )}
          {isOwn && !message.deleted && onDelete && (
            <button
              onClick={() => onDelete(message._id)}
              title="Delete"
              style={{
                background: "transparent",
                color: "inherit",
                fontSize: "12px",
                padding: "0 4px",
                marginLeft: "4px",
              }}
            >
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
