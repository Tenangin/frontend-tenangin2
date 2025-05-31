import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    // Sidebar
    <aside className="sidebar" style={{backgroundColor: "#EFF4FF"}}>
      <div className="p-4">
        <h4 className="fw-bold text-primary">Tenangin</h4>
        <ul className="nav flex-column mt-4">
          <li className="nav-item mb-3">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => "nav-link d-flex align-items-center" + (isActive ? " active fw-bold text-primary" : "")}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <i className="bi bi-house-door me-2" /> Dashboard
            </NavLink>
          </li>
          <li className="nav-item mb-3">
             <NavLink 
              to="/journaling" 
              className={({ isActive }) => "nav-link d-flex align-items-center" + (isActive ? " active fw-bold text-primary" : "")}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <i className="bi bi-journal-text me-2" /> Journaling
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <i className="bi bi-clock me-2" /> Reminders
          </li>
          <li className="nav-item mb-3">
            <i className="bi bi-heart-pulse me-2" /> Health Check
          </li>
          <li className="nav-item mb-3">
            <NavLink 
              to="/profile" 
              className={({ isActive }) => "nav-link d-flex align-items-center" + (isActive ? " active fw-bold text-primary" : "")}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <i className="bi bi-person-circle me-2" /> Profile
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink 
              to="/chatbot" 
              className={({ isActive }) => "nav-link d-flex align-items-center" + (isActive ? " active fw-bold text-primary" : "")}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <i className="bi bi-robot me-2" /> Teno Bot
            </NavLink>
          </li>
        </ul>

        <div className="mt-auto p-3 rounded text-white text-center" style={{backgroundColor: "#DBE6FE"}}>
          <p className="mb-1 fw-bold" style={{color: "#2563EB"}}>You are stronger than you think</p>
          <small style={{color: "656565"}}>continue your progress</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
