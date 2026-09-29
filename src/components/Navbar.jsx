import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        background:
          scrolled || menuOpen ? "rgba(17, 33, 45, 0.95)" : "transparent",
        borderBottom:
          scrolled || menuOpen
            ? "1px solid var(--surface-2)"
            : "1px solid transparent",
        padding: scrolled ? "12px 0" : "20px 0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "22px",
              fontWeight: "700",
              fontFamily: "'Space Grotesk', sans-serif",
              color: "var(--text-light)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              className="animate-spin-slow"
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 12px var(--accent)",
              }}
            />
            Skill<span style={{ color: "var(--muted)" }}>Swap</span>
          </Link>

          {!isMobile && (
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <Link
                to="/skills"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color:
                    location.pathname === "/skills"
                      ? "var(--text-light)"
                      : "var(--muted)",
                }}
              >
                Browse Skills
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    style={{
                      fontSize: "14px",
                      color:
                        location.pathname === "/dashboard"
                          ? "var(--text-light)"
                          : "var(--muted)",
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-skills"
                    style={{
                      fontSize: "14px",
                      color:
                        location.pathname === "/my-skills"
                          ? "var(--text-light)"
                          : "var(--muted)",
                    }}
                  >
                    My Skills
                  </Link>
                  <Link
                    to="/requests"
                    style={{
                      fontSize: "14px",
                      color:
                        location.pathname === "/requests"
                          ? "var(--text-light)"
                          : "var(--muted)",
                    }}
                  >
                    Requests
                  </Link>
                  <Link
                    to="/messages"
                    style={{
                      fontSize: "14px",
                      color:
                        location.pathname === "/messages"
                          ? "var(--text-light)"
                          : "var(--muted)",
                    }}
                  >
                    💬 Messages
                  </Link>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      paddingLeft: "16px",
                      borderLeft: "1px solid var(--surface-2)",
                    }}
                  >
                    <Link
                      to="/profile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                      }}
                    >
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "var(--text-light)",
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                      {user?.name?.split(" ")[0] || "Profile"}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="btn btn-outline"
                      style={{ padding: "8px 16px", fontSize: "13px" }}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline"
                    style={{ padding: "8px 20px", fontSize: "13px" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    style={{ padding: "8px 20px", fontSize: "13px" }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "transparent",
                border: "1px solid var(--surface-2)",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "2px",
                  background: "var(--text-light)",
                  transition: "all 0.3s",
                  transform: menuOpen
                    ? "rotate(45deg) translateY(6px)"
                    : "none",
                }}
              />
              <span
                style={{
                  width: "20px",
                  height: "2px",
                  background: "var(--text-light)",
                  opacity: menuOpen ? 0 : 1,
                  transition: "all 0.3s",
                }}
              />
              <span
                style={{
                  width: "20px",
                  height: "2px",
                  background: "var(--text-light)",
                  transition: "all 0.3s",
                  transform: menuOpen
                    ? "rotate(-45deg) translateY(-6px)"
                    : "none",
                }}
              />
            </button>
          )}
        </div>

        {isMobile && menuOpen && (
          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid var(--surface-2)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <MobileLink to="/skills">Browse Skills</MobileLink>

            {isLoggedIn ? (
              <>
                <MobileLink to="/dashboard">Dashboard</MobileLink>
                <MobileLink to="/my-skills">My Skills</MobileLink>
                <MobileLink to="/profile">Profile</MobileLink>
                <MobileLink to="/requests">Requests</MobileLink>
                <MobileLink to="/messages">💬 Messages</MobileLink>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background: "var(--surface-2)",
                    color: "var(--text-light)",
                    fontSize: "15px",
                    textAlign: "left",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileLink to="/login">Login</MobileLink>
                <Link
                  to="/register"
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background: "var(--accent)",
                    fontSize: "15px",
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function MobileLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        background: "var(--surface-2)",
        fontSize: "15px",
      }}
    >
      {children}
    </Link>
  );
}

export default Navbar;
