import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../css/Signup.css";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({ ...formData, [name]: value });

  if (name === "password") {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regex.test(value)) {
      setPasswordError(
        "Min 8 chars, include uppercase, lowercase, number & special char"
      );
    } else {
      setPasswordError("");
    }
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (passwordError) {
    setError("Please fix password requirements");
    return;
  }

  try {
    const res = await signup(formData);
    setSuccess("OTP sent to your email");
    navigate("/verify-otp", { state: { email: formData.email } });
    setError("");
  } catch (err) {
    setError(err.response?.data?.message || "Signup failed");
    setSuccess("");
  }
};

const handleGoogleSignup = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;

};
  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
           {success && <p className="success-message">{success}</p>}
{error && <p className="error-message">{error}</p>}
        

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        {passwordError && (
  <p className="error-message">{passwordError}</p>
)}

        <button type="submit">Sign Up</button>
       {/* Divider */}
<div className="divider">OR</div>

{/* Google Signup Button */}
<div className="google-login">
  <button
    type="button"
    onClick={handleGoogleSignup}
    className="google-btn"
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google"
      style={{ width: "18px", height: "18px" }}
    />
    Sign up with Google
  </button>
</div>
        {/* Link to login if user already has an account */}
        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
