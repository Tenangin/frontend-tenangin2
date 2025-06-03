import React from "react";
import { Link } from "react-router-dom";

function LandingNavbar() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top py-3" style={{ backgroundColor: "#f4f7ff", borderBottom: "1px solid #dce3f2" }}>
        <div className="container d-flex justify-content-between align-items-center">
            {/* Logo Kiri */}
            <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
            Tenangin
            </Link>

            {/* Menu Tengah */}
            <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
            <ul className="navbar-nav gap-4">
                <li className="nav-item">
                <Link className="nav-link text-dark" to="/about">About us</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link text-dark" to="/features">Features</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link text-dark" to="/benefits">Benefit</Link>
                </li>
            </ul>
            </div>

            {/* Tombol Kanan */}
            <div className="d-flex gap-2">
            <Link to="/register" className="btn btn-outline-primary rounded-pill px-4 py-2 bg-white">
                Register
            </Link>
            <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2">
                Login
            </Link>
            </div>
        </div>
    </nav>
  );
}

export default LandingNavbar;
