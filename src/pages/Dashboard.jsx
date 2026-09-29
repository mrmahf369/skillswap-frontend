import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await api.get("/dashboard");
      setStats(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStats(true);
  }, [fetchStats]);

  // Refetch when user returns to this tab (fix for stale data)
  useEffect(() => {
    const handleFocus = () => {
      fetchStats(false);
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) fetchStats(false);
    });
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchStats]);

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "8px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              marginBottom: "8px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Here's your skill exchange summary
          </p>
        </div>

        <button
          onClick={() => fetchStats(false)}
          disabled={refreshing}
          className="btn btn-outline"
          style={{
            padding: "10px 20px",
            fontSize: "13px",
            opacity: refreshing ? 0.6 : 1,
          }}
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)", marginTop: "40px" }}>
          Loading stats...
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <StatBox
            label="Total Skills"
            value={stats?.totalSkills || 0}
            icon="📚"
          />
          <StatBox
            label="Skills to Learn"
            value={stats?.skillsToLearn || 0}
            icon="🎯"
          />
          <StatBox
            label="Pending Received"
            value={stats?.pendingReceived || 0}
            icon="📥"
          />
          <StatBox
            label="Pending Sent"
            value={stats?.pendingSent || 0}
            icon="📤"
          />
          <StatBox
            label="Accepted Exchanges"
            value={stats?.acceptedExchanges || 0}
            icon="🤝"
          />
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="card card-3d" style={{ padding: "24px" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>{icon}</div>
      <div
        style={{
          fontSize: "36px",
          fontWeight: "800",
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: "4px",
        }}
      >
        {value}
      </div>
      <div style={{ color: "var(--muted)", fontSize: "14px" }}>{label}</div>
    </div>
  );
}

export default Dashboard;
