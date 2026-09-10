import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const linkClass = (path) =>
    `nav-link ${location.pathname === path ? "active" : ""}`;

  return (
    <header className="site-header">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-mark">✈</span>
          <span>TripNest</span>
        </Link>

        <nav className="nav-links">
          <Link className={linkClass("/")} to="/">Home</Link>
          <Link className={linkClass("/destinations")} to="/destinations">Destinations</Link>

          {isLoggedIn ? (
            <>
              <Link className={linkClass("/dashboard")} to="/dashboard">Dashboard</Link>
              <Link className={linkClass("/profile")} to="/profile">Profile</Link>
              <Link className={linkClass("/settings")} to="/settings">Settings</Link>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className={linkClass("/login")} to="/login">Login</Link>
              <Link className="nav-register" to="/register">Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
