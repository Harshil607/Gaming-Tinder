import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Gaming Tinder</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/recommendations" className="nav-link">
          Recommendations
        </Link>
      </div>
      <button className="Logout-btn" onClick={handleLogout}>
        Log Out
      </button>
    </nav>
  );
}

export default NavBar;
