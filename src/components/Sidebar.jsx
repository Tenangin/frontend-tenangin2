import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOverlay, isVisible, onClose }) => {
  const baseStyles = {
    backgroundColor: '#EFF4FF',
    width: '240px',
    overflow: 'hidden',
    height: '100vh',
    position: isOverlay ? 'fixed' : 'static',
    top: isOverlay ? 0 : 'auto',
    left: isOverlay ? 0 : 'auto',
    zIndex: isOverlay ? 1050 : 'auto',
    boxShadow: isOverlay ? '2px 0 5px rgba(0,0,0,0.3)' : 'none',
    display: 'flex',
    flexDirection: 'column',
    transform: isOverlay && !isVisible ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'transform 0.3s ease',
  };

  return (
    <aside
      className="sidebar d-flex flex-column"
      style={baseStyles}
    >
      <div className="p-3 d-flex flex-column h-100">
        {isOverlay && (
          <button
            className="btn btn-outline-primary mb-3 align-self-start"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
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
             <NavLink
                to="/healthCheck"
                className={({ isActive }) =>
                  'nav-link d-flex align-items-center' +
                  (isActive ? ' active fw-bold text-primary' : '')
                }
                style={{ textDecoration: 'none', color: 'inherit' }}
                title="Profile"
              >
                <i className="bi bi-heart-pulse me-2" />
              Health Check
            </NavLink>
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
