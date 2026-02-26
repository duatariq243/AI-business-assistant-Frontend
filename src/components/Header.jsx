import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // check login
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // show confirmation modal
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/"); // go to home
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); // just close modal
  };

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  return (
    <div className="header">
      <h3 onClick={() => navigate("/")}>AI Business Assistant</h3>

      <div className="nav-buttons">
        {!token && (
          <>
            <button className="login" onClick={handleLogin}>Login</button>
            <button className="signup" onClick={handleSignup}>Signup</button>
          </>
        )}

        {token && <button className="logout" onClick={handleLogoutClick}>Logout</button>}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to logout?</h3>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelLogout}>Cancel</button>
              <button className="confirm-btn" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;