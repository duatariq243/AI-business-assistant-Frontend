import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate("/signup"); // CTA navigates to signup/login
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Grow Your Business with AI</h1>
          <p>
            Our AI Business Assistant helps you make smarter decisions, automate tasks,
            and increase productivity. Let us guide your business to the next level.
          </p>
          <button className="cta-button" onClick={handleCTA}>
            Get Started with AI
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>How We Can Help You</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Automate Tasks</h3>
            <p>Save time by letting AI handle repetitive work and streamline processes.</p>
          </div>
          <div className="card">
            <h3>Business Insights</h3>
            <p>Make data-driven decisions with smart analytics and recommendations.</p>
          </div>
          <div className="card">
            <h3>Boost Growth</h3>
            <p>Optimize your strategies to grow revenue and reach more customers.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Transform Your Business?</h2>
        <button className="cta-button" onClick={handleCTA}>
          Start Now
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
