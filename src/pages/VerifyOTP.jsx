import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyOTP , resendOTP} from "../services/api";

import "../css/VerifyOTP.css";

function VerifyOTP() {
  const location = useLocation();
  const [resendMessage, setResendMessage] = useState("");
const [loading, setLoading] = useState(false);
const [cooldown, setCooldown] = useState(0);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");

  if (!email) {
    return <h2 className="error-text">No email found. Please signup again.</h2>;
  }

  

const handleResend = async () => {
  if (cooldown > 0) return;

  try {
    setLoading(true);
    await resendOTP({ email });

    setResendMessage("New OTP sent");

    setCooldown(30); // 30 sec cooldown

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

  } catch (err) {
    alert(err.response?.data?.message || "Failed to resend OTP");
  } finally {
    setLoading(false);
  }
};
  
  const handleVerify = async () => {
  try {
    setError("");
    setSuccess("");

    const res = await verifyOTP({ email, otp });

    localStorage.setItem("token", res.data.token);

    setSuccess("Email verified successfully!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 800);

  } catch (err) {
    setError(err.response?.data?.message || "Please enter a valid OTP");
  }
};
  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Verify Your Email</h2>

        <p className="email-text">OTP sent to: <strong>{email}</strong></p>

        
      <p className="hint-text">
  Didn’t receive the OTP? Check your <strong>Spam</strong>
</p>

<p>
  <span
    onClick={handleResend}
    style={{
      color: cooldown > 0 ? "gray" : "#2563eb",
      cursor: cooldown > 0 ? "not-allowed" : "pointer",
      fontWeight: "500"
    }}
  >
    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
  </span>
</p>

{resendMessage && (
  <p className="success-message">{resendMessage}</p>
)}
{error && (
  <p className="error-message">{error}</p>
)}

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="otp-input"
        />

        <button onClick={handleVerify} className="verify-btn">
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default VerifyOTP;