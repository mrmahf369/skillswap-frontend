import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import MessageBubble from "./MessageBubble";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

function ChatWindow({ conversation, onBack, onConversationUpdate }) {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiWrapperRef = useRef(null);

  const otherUser = conversation.otherUser;
  const isOnline = onlineUsers.has(otherUser?._id);

  useEffect(() => {
    fetchMessages();
  }, [conversation._id]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      if (msg.conversationId === conversation._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = ({ conversationId, userId }) => {
      if (conversationId === conversation._id && userId !== user._id) {
        setOtherTyping(true);
      }
    };

    const handleStopTyping = ({ conversationId, userId }) => {
      if (conversationId === conversation._id && userId !== user._id) {
        setOtherTyping(false);
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
    };
  }, [socket, conversation._id, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close emoji on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmoji &&
        emojiWrapperRef.current &&
        !emojiWrapperRef.current.contains(e.target)
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/chat/conversations/${conversation._id}/messages`,
      );
      setMessages(res.data.data);
      onConversationUpdate && onConversationUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await api.post(
        `/chat/conversations/${conversation._id}/messages`,
        { text: text.trim() },
      );
      setMessages((prev) => [...prev, res.data.data]);
      setText("");
      setShowEmoji(false);

      if (socket) {
        socket.emit("stop_typing", {
          conversationId: conversation._id,
          receiverId: otherUser._id,
        });
      }
      onConversationUpdate && onConversationUpdate();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send");
    }
  };

  const handleTypingInput = (e) => {
    setText(e.target.value);

    if (socket && !isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        conversationId: conversation._id,
        receiverId: otherUser._id,
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket) {
        socket.emit("stop_typing", {
          conversationId: conversation._id,
          receiverId: otherUser._id,
        });
      }
    }, 1500);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/chat/messages/${messageId}`);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, text: "This message was deleted", deleted: true }
            : m,
        ),
      );
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleBlock = async () => {
    if (!confirm(`Block ${otherUser.name}?`)) return;
    try {
      await api.post(`/chat/conversations/${conversation._id}/block`);
      alert("User blocked");
      onConversationUpdate && onConversationUpdate();
      setShowMenu(false);
    } catch (err) {
      alert("Failed to block");
    }
  };

  const handleUnblock = async () => {
    try {
      await api.post(`/chat/conversations/${conversation._id}/unblock`);
      alert("User unblocked");
      onConversationUpdate && onConversationUpdate();
      setShowMenu(false);
    } catch (err) {
      alert("Failed to unblock");
    }
  };

  const handleDeleteChat = async () => {
    if (!confirm("Delete this chat? You can restart later.")) return;
    try {
      await api.delete(`/chat/conversations/${conversation._id}`);
      onBack();
      onConversationUpdate && onConversationUpdate();
    } catch (err) {
      alert("Failed to delete chat");
    }
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const disabled = conversation.isBlocked || conversation.otherBlockedMe;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--surface-2)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--surface-1)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            color: "var(--text-light)",
            fontSize: "20px",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "700",
            color: "var(--text-light)",
          }}
        >
          {otherUser?.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: "600",
              fontSize: "14px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {otherUser?.name || "Unknown"}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: isOnline ? "var(--success)" : "var(--muted)",
            }}
          >
            {otherTyping ? "typing..." : isOnline ? "🟢 Online" : "Offline"}
          </div>
        </div>

        {/* Menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: "transparent",
              color: "var(--text-light)",
              fontSize: "20px",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            ⋮
          </button>
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "var(--surface-2)",
                borderRadius: "8px",
                minWidth: "180px",
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                zIndex: 10,
              }}
            >
              {conversation.isBlocked ? (
                <button
                  onClick={handleUnblock}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    background: "transparent",
                    color: "var(--text-light)",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  🔓 Unblock User
                </button>
              ) : (
                <button
                  onClick={handleBlock}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    background: "transparent",
                    color: "var(--warning)",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  🚫 Block User
                </button>
              )}
              <button
                onClick={handleDeleteChat}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  textAlign: "left",
                  background: "transparent",
                  color: "var(--error)",
                  fontSize: "13px",
                  borderTop: "1px solid var(--surface-1)",
                  cursor: "pointer",
                }}
              >
                🗑 Delete Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "var(--bg-deep)",
        }}
      >
        {loading ? (
          <p style={{ color: "var(--muted)", textAlign: "center" }}>
            Loading...
          </p>
        ) : messages.length === 0 ? (
          <p
            style={{
              color: "var(--muted)",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            No messages yet. Say hi! 👋
          </p>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m._id}
              message={m}
              isOwn={m.sender._id === user._id || m.sender === user._id}
              onDelete={handleDeleteMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Blocked banner */}
      {disabled && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(251, 191, 36, 0.1)",
            color: "var(--warning)",
            fontSize: "13px",
            textAlign: "center",
            borderTop: "1px solid var(--surface-2)",
          }}
        >
          {conversation.isBlocked
            ? "You blocked this user. Unblock to send messages."
            : "You cannot send messages to this user."}
        </div>
      )}

      {/* Input */}
      {!disabled && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--surface-2)",
            background: "var(--surface-1)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Emoji Button + Picker */}
            <div ref={emojiWrapperRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-light)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "18px",
                  cursor: "pointer",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "42px",
                  height: "42px",
                }}
                title="Emoji"
              >
                😊
              </button>

              {showEmoji && (
                <div
                  style={{
                    position: "fixed",
                    bottom: "90px",
                    left: "20px",
                    zIndex: 999999,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
                    border: "1px solid var(--surface-2)",
                    background: "#11212D",
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    theme="dark"
                    height={400}
                    width={340}
                    searchPlaceHolder="Search emoji..."
                    previewConfig={{ showPreview: false }}
                    skinTonesDisabled
                    lazyLoadEmojis={false}
                  />
                </div>
              )}
            </div>

            <input
              type="text"
              value={text}
              onChange={handleTypingInput}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "var(--surface-2)",
                border: "none",
                borderRadius: "20px",
                color: "var(--text-light)",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="btn btn-primary"
              style={{
                padding: "10px 20px",
                borderRadius: "20px",
                opacity: text.trim() ? 1 : 0.5,
                cursor: text.trim() ? "pointer" : "not-allowed",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
