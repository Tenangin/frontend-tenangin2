import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '../styles/Components.css';

function LandingNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top py-3" style={{ backgroundColor: "#f4f7ff", borderBottom: "1px solid #dce3f2" }}>
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo Kiri */}
          <NavLink className="navbar-brand fw-bold text-primary fs-4" to="/">
            Tenangin
          </NavLink>

          {/* Hamburger Menu Button for small screens */}
          <button
            className="btn d-lg-none"
            type="button"
            aria-label="Toggle menu"
            onClick={toggleDrawer}
          >
            <span className="hamburger-icon">&#9776;</span>
          </button>

          {/* Menu Tengah - hidden on small screens */}
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

          {/* Tombol Kanan - hidden on small screens */}
          <div className="d-none d-lg-flex gap-2">
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

      {/* Drawer for small screens */}
      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-content">
          <button className="drawer-close-btn" onClick={closeDrawer} aria-label="Close menu">&times;</button>
          <ul className="navbar-nav flex-column gap-3">
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  "nav-link " + (isActive ? "active text-primary" : "text-dark")
                }
                onClick={closeDrawer}
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
                onClick={closeDrawer}
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
                onClick={closeDrawer}
              >
                Benefit
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className="btn btn-outline-primary rounded-pill px-4 py-2 register-btn w-100"
                onClick={closeDrawer}
              >
                Register
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className="btn btn-primary rounded-pill px-4 py-2 login-btn w-100"
                onClick={closeDrawer}
              >
                Login
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="drawer-overlay" onClick={closeDrawer}></div>
      </div>
    </>
  );
}

export default LandingNavbar;
