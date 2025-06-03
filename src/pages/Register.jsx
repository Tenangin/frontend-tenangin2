import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../data/api/api";
import "../styles/Register.css";

function Register() {
  const [fadeIn, setFadeIn] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  // New state variables for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State variables for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New state variables for loading, error and success message
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setFadeIn(true);
  }, []);
  const handleSignInClick = (e) => {
    e.preventDefault();
    setAnimate(true);
  };

  // New form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(username, email, password, confirmPassword);
      console.log("API response:", response);
      if (response && response.success) {
        // Registration successful, show success message
        setSuccessMessage("Registration successful! Redirecting to login...");
        setError("");
        // Optionally delay navigation to show message
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        // Show error message from response or generic error
        setError(response.message || "Registration failed");
        setSuccessMessage("");
      }
    } catch (err) {
       console.error("Registration error:", err);
       setError("An error occurred. Please try again.");
       setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };


  const handleAnimationEnd = () => {
    if (animate) {
      navigate("/login");
    }
  };

  return (
    <div
      className={`register-container d-flex ${fadeIn ? "fade-in" : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Kiri: Ilustrasi */}
      <div className={`register-left d-flex flex-column align-items-center justify-content-between ${animate ? "slide-right" : ""}`}>
        <img src="/images/flowers-top.svg" alt="Flowers Top-right" className="flowers-top-right" />
        <img src="/images/flowers-top.svg" alt="Flowers Top" className="flowers-top" />
        <img src="/images/logo-brain.svg" alt="Logo Brain" className="logo-brain" />
        <img src="/images/flowers-bottom.svg" alt="Flowers Bottom-right" className="flowers-bottom-right" />
        <img src="/images/flowers-bottom.svg" alt="Flowers Bottom" className="flowers-bottom" />
      </div>

      {/* Kanan: Formulir */}
      <div className={`register-right ${animate ? "slide-left" : ""}`}>
        <div className="register-form-container">
          <h1 className="fw-bold mb-5 text-center">Sign Up</h1>

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
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-shield-lock"></i></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Re-Enter Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-key"></i></span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  placeholder="password123"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={showConfirmPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-pill fw-bold"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-decoration-none fw-semibold"
              onClick={handleSignInClick}
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
