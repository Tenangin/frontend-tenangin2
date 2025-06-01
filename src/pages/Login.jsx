import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { loginUser } from "../data/api/api";
import { setToken, setUserId, setUserEmail, setUsername } from "../utils/auth";

function Login() {
  const [fadeIn, setFadeIn] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  


  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);
  const handleSignInClick = (e) => {
    e.preventDefault();
    setAnimate(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccessMessage("");
    try {
      const response = await loginUser(email, password);
      console.log(response);
      if (response.access_token) {

        setToken(response.access_token);
        setUserId(response.user.id);
        setUserEmail(response.user.email);
        setUsername(response.user.username);
        
        setSuccessMessage("Login Successfull! Redirecting to Dashboard...")
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(response.message || "Login failed");
        setSuccessMessage("")
      }
    } catch {
      setError("An error occurred during login");
      setSuccessMessage("")
    }
  };
  const handleAnimationEnd = () => {
    if (animate) {
      navigate("/register");
    }
  };
  return (
    <div className={`login-container d-flex ${fadeIn ? "fade-in" : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Kiri: Formulir */}
      <div className={`login-left ${animate ? "slide-right" : "" }`}>
        <div className="login-form-container">
          <h1 className="fw-bold mb-5 text-center">Welcome</h1>

          <form onSubmit={handleSubmit}>
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
           {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address :</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className="form-control rounded-pill"
                  id="email"
                  placeholder="johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password :</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-shield-lock"></i></span>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <span className="input-group-text"><i className="bi bi-eye-slash"></i></span>
              </div>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold mb-3 p-2" disabled={loading}>
              {loading ? "Login Account..." : "Sign In"}
            </button>
            <button type="button" className="btn btn-dark w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mb-3" disabled={loading}>
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
            <a href="/register" className="text-decoration-none fw-semibold" onClick={handleSignInClick}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
      <div className={`login-right d-flex flex-column align-items-center justify-content-center ${animate ? "slide-left" : ""}`}>
         <img src="/images/flowers-top.svg" alt="Flowers Top-right" className="flowers-top-right" />
        <img src="/images/flowers-top.svg" alt="Flowers Top" className="flowers-top" />
        <img src="/images/logo-brain.svg" alt="Logo Brain" className="logo-brain" />
        <img src="/images/flowers-bottom.svg" alt="Flowers Bottom-right" className="flowers-bottom-right" />
        <img src="/images/flowers-bottom.svg" alt="Flowers Bottom" className="flowers-bottom" />
      </div>
    </div>
  );
}

export default Login;