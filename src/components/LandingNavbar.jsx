import React from "react";
import { NavLink } from "react-router-dom";
import '../styles/Components.css';

function LandingNavbar() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top py-3" style={{ backgroundColor: "#f4f7ff", borderBottom: "1px solid #dce3f2" }}>
        <div className="container d-flex justify-content-between align-items-center">
            {/* Logo Kiri */}
            <NavLink className="navbar-brand fw-bold text-primary fs-4" to="/">
            Tenangin
            </NavLink>

            {/* Menu Tengah */}
            <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
            <ul className="navbar-nav gap-4">
                <li className="nav-item">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "active text-primary" : "text-dark")
                  }
                >
                  About us
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink
                  to="/features"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "active text-primary" : "text-dark")
                  }
                >
                  Features
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink
                  to="/benefits"
                  className={({ isActive }) =>
                    "nav-link " + (isActive ? "active text-primary" : "text-dark")
                  }
                >
                  Benefit
                </NavLink>
                </li>
            </ul>
            </div>

            {/* Tombol Kanan */}
            <div className="d-flex gap-2">
            <NavLink
              to="/register"
              className="btn btn-outline-primary rounded-pill px-4 py-2 register-btn"
            >
                Register
            </NavLink>
            <NavLink
              to="/login"
              className="btn btn-primary rounded-pill px-4 py-2 login-btn"
            >
                Login
            </NavLink>
            </div>
        </div>
    </nav>
  );
}

export default LandingNavbar;
