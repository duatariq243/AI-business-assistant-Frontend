import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../css/Signup.css";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await signup(formData);
    // Instead of navigating, show a message
    setSuccess(res.data.message);
    setError("");
  } catch (err) {
    setError(err.response?.data?.message || "Signup failed");
    setSuccess("");
  }
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

        <button type="submit">Sign Up</button>

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
