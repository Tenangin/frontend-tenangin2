import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside
      className="sidebar d-flex flex-column"
      style={{
        backgroundColor: '#EFF4FF',
        width: '240px',
        overflow: 'hidden',
        height: '100vh',
      }}
    >
      <div className="p-3 d-flex flex-column h-100">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 className="fw-bold text-primary m-0">Tenangin</h4>
        </div>

        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' +
                (isActive ? ' active fw-bold text-primary' : '')
              }
              style={{ textDecoration: 'none', color: 'inherit' }}
              title="Dashboard"
            >
              <i className="bi bi-house-door me-2" />
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink
              to="/journaling"
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' +
                (isActive ? ' active fw-bold text-primary' : '')
              }
              style={{ textDecoration: 'none', color: 'inherit' }}
              title="Journaling"
            >
              <i className="bi bi-journal-text me-2" />
              Journaling
            </NavLink>
          </li>
          <li className="nav-item mb-3 d-flex align-items-center" title="Reminders">
            <i className="bi bi-clock me-2" />
            Reminders
          </li>
          <li className="nav-item mb-3 d-flex align-items-center" title="Health Check">
            <i className="bi bi-heart-pulse me-2" />
            Health Check
          </li>
          <li className="nav-item mb-3">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' +
                (isActive ? ' active fw-bold text-primary' : '')
              }
              style={{ textDecoration: 'none', color: 'inherit' }}
              title="Profile"
            >
              <i className="bi bi-person-circle me-2" />
              Profile
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink
              to="/chatbot"
              className={({ isActive }) =>
                'nav-link d-flex align-items-center' +
                (isActive ? ' active fw-bold text-primary' : '')
              }
              style={{ textDecoration: 'none', color: 'inherit' }}
              title="Teno Bot"
            >
              <i className="bi bi-robot me-2" />
              Teno Bot
            </NavLink>
          </li>
        </ul>

        <div
          className="mt-auto p-2 rounded text-white text-center"
          style={{
            backgroundColor: '#DBE6FE',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title="You are stronger than you think"
        >
          <p className="mb-1 fw-bold" style={{ color: '#2563EB' }}>
            You are stronger than you think
          </p>
          <small style={{ color: '#656565' }}>continue your progress</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
