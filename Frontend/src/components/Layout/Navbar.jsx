import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/terms", label: "Terms" },
  { to: "/feedback", label: "Feedback" },
];

export default function Navbar() {
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="page-shell topbar-inner">
        <NavLink to="/" className="brand" style={{ textDecoration: "none" }}>
          <div className="brand-badge">SS</div>
          <div className="brand-copy">
            <h1>StockSmart Pro</h1>
            <p>Modern inventory intelligence</p>
          </div>
        </NavLink>

        <nav className="nav-links">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <span className="muted" style={{ alignSelf: "center", fontSize: "0.85rem" }}>
                👤 {username}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/signup")}>
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
