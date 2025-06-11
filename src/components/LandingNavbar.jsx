import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Components.css";
import { getUserId } from "../utils/auth";
import logo from "../assets/logo2.png";
import { useNavigate } from 'react-router-dom';
import { removeToken, removeEmail, removeUserId, removeUsername } from '../utils/auth';




function LandingNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skipVisible, setSkipVisible] = useState(true);
  const session = getUserId()
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

    const handleLogout = () => {
      removeEmail();
      removeUserId();
      removeUsername();
      removeToken();
      navigate('/login');
    };

  return (
    <>
      {/* Skip to Content link for accessibility */}
      <a
        href="#main-content"
        className={`skip-to-content-link${skipVisible ? "" : " skip-hidden"}`}
        tabIndex="0"
        onClick={(e) => {
          e.preventDefault();
          const mainContent = document.getElementById("main-content");
          if (mainContent) {
            mainContent.tabIndex = -1;
            mainContent.focus();
          }
          setSkipVisible(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const mainContent = document.getElementById("main-content");
            if (mainContent) {
              mainContent.tabIndex = -1;
              mainContent.focus();
            }
            setSkipVisible(false);
          }
        }}
      >
        Skip to Content
      </a>

      <nav
        className="navbar navbar-expand-lg sticky-top py-3"
        style={{
          backgroundColor: "#f4f7ff",
          borderBottom: "1px solid #dce3f2",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo Kiri */}
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logo}
              alt="Tenangin Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
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
                    "nav-link " +
                    (isActive ? "active text-primary" : "text-dark")
                  }
                >
                  About us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/features"
                  className={({ isActive }) =>
                    "nav-link " +
                    (isActive ? "active text-primary" : "text-dark")
                  }
                >
                  Features
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/benefits"
                  className={({ isActive }) =>
                    "nav-link " +
                    (isActive ? "active text-primary" : "text-dark")
                  }
                >
                  Benefit
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Tombol Kanan - hidden on small screens */}
          <div className="d-none d-lg-flex gap-2">
            {session ? (
              // JIKA SUDAH ADA SESI (SUDAH LOGIN)
              <>
                <NavLink
                  to="/dashboard"
                  className="btn btn-outline-primary rounded-pill px-4 py-2"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary rounded-pill px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              // JIKA BELUM ADA SESI (BELUM LOGIN)
              <>
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
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Drawer for small screens */}
      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-content">
          <button
            className="drawer-close-btn"
            onClick={closeDrawer}
            aria-label="Close menu"
          >
            &times;
          </button>
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
