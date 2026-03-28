import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("TOKEN FROM URL:", token);

    if (token && token !== "undefined") {
      localStorage.setItem("token", token);
      console.log("TOKEN SAVED");

      //  ADD DELAY (IMPORTANT)
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}

export default AuthSuccess;