import { useNavigate } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // check login

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="header"
    >
      <h3 onClick={() => navigate("/")}>
        AI Business Assistant
      </h3>

      <div className="nav-buttons">
        {!token && (
          <>
            <button className="login" onClick={handleLogin}>Login</button>
            <button className="signup" onClick={handleSignup}>Signup</button>
          </>
        )}

        {token && <button className="logout" onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  );
};

export default Header;
