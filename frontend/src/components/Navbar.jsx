import { Link } from "react-router-dom";

function NavBar() {
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
    </nav>
  );
}

export default NavBar;
