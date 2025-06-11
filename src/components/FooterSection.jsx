import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#2563EB", color: "white" }}>
      <div className="container py-5">
        <div className="row justify-content-center text-center">
          {/* Branding & Navigation */}
          <div className="col-md-6">
            <h3 className="fw-bold mb-3">Tenangin<span className="text-white"></span></h3>
            <p className="mb-4" style={{ fontStyle: "italic", fontSize: "0.95rem" }}>
              Where your mind finds peace
            </p>
            <ul className="list-inline mb-0">
              <li className="list-inline-item mx-2">
                <a href="/about" className="text-white text-decoration-none">About us</a>
              </li>
              <li className="list-inline-item mx-2">
                <a href="/features" className="text-white text-decoration-none">Features</a>
              </li>
              <li className="list-inline-item mx-2">
                <a href="/benefits" className="text-white text-decoration-none">Benefit</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        className="border-top"
        style={{ borderColor: "#ffffff22", padding: "20px 0" }}
      >
        <div className="container d-flex flex-column flex-md-row justify-content-center align-items-center text-white-50 small text-center">
          <strong className="text-white me-md-4 mb-2 mb-md-0">Tenangin</strong>
          <div className="me-md-4 mb-2 mb-md-0">&copy; 2025 Tenangin</div>
          <div>All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
