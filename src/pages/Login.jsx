import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../styles/Register.css";
import "../styles/Login.css";

function Register() {
  const [animate, setAnimate] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setAnimate(true);
  };

  const handleAnimationEnd = () => {
    if (animate) {
      navigate("/register");
    }
  };

  return (
    <div
      className={`register-container d-flex ${fadeIn ? "fade-in" : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Kiri: Formulir */}
      <div className={`register-right ${animate ? "slide-right" : ""}`}>
        <div className="register-form-container">
          <h1 className="fw-bold mb-5 text-center">Welcome</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input type="email" className="form-control" id="email" placeholder="johndoe@example.com" />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-shield-lock"></i></span>
                <input type="password" className="form-control" id="password" placeholder="********" />
                <span className="input-group-text"><i className="bi bi-eye-slash"></i></span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold mb-3 p-2">
              Sign in
            </button>
            <button className="btn btn-dark w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mb-3">
              <img
                src="/images/google-logo.svg"
                alt="Google"
                style={{ width: "20px", height: "20px" }}
              />
              <span className="fw-semibold">Sign In with Google</span>
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-decoration-none fw-semibold"
              onClick={handleSignUpClick}
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
      {/* Kanan: Ilustrasi */}
      <div className={`register-left d-flex flex-column align-items-center justify-content-between ${animate ? "slide-left" : ""}`}>
        <img src="/images/flowers-top.svg" alt="Flowers Top-right" className="flowers-top-right" />
        <img src="/images/flowers-top.svg" alt="Flowers Top" className="flowers-top" />
        <img src="/images/logo-brain.svg" alt="Logo Brain" className="logo-brain"/>
        <img src="/images/flowers-bottom.svg" alt="Flowers Bottom-right" className="flowers-bottom-right" />
        <img src="/images/flowers-bottom.svg" alt="Flowers Bottom" className="flowers-bottom" />
      </div>
    </div>
  );
}

export default Register;
