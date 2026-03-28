import { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await login(formData);
    console.log("Login success:", res.data);

    // save token only if exists
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
      return;
    }

  } catch (err) {
  const message = err.response?.data?.message;

  if (message === "Please verify your email first") {
    navigate("/verify-otp", {
      state: { email: formData.email }
    });
    return;
  }

  setError(message || "Login failed");
}
};

   const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/api/auth/google";
};

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
         
         {/* Divider */}
<div className="divider">OR</div>

<div className="google-login">
  <button
    className="google-btn"
    onClick={() =>
      (window.location.href = "http://localhost:5000/api/auth/google")
    }
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google"
      style={{ width: "18px", height: "18px" }}
    />
    Sign in with Google
  </button>
</div>
        {/* Signup link section */}
        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
