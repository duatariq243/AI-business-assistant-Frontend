import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyOTP } from "../services/api";
import "../css/VerifyOTP.css";

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");

  if (!email) {
    return <h2 className="error-text">No email found. Please signup again.</h2>;
  }

  const handleVerify = async () => {
    try {
      const res = await verifyOTP({ email, otp });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Verify Your Email</h2>

        <p className="email-text">OTP sent to: <strong>{email}</strong></p>

        
        <p className="hint-text">
          Didn’t receive the OTP? Check your <strong>Spam</strong> folder.
        </p>

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