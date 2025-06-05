import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Responsive behavior: collapse sidebar if window width is less than 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={`sidebar d-flex flex-column`}
      style={{
        backgroundColor: '#EFF4FF',
        width: isCollapsed ? '60px' : '240px',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        height: '100vh',
      }}
    >
      <div className="p-3 d-flex flex-column h-100">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4
            className="fw-bold text-primary m-0"
            style={{ display: isCollapsed ? 'none' : 'block' }}
          >
            Tenangin
          </h4>
          <button
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="btn btn-sm btn-outline-primary"
            style={{ width: '30px', height: '30px', padding: 0 }}
          >
            {isCollapsed ? (
              <i className="bi bi-arrow-right-square"></i>
            ) : (
              <i className="bi bi-arrow-left-square"></i>
            )}
          </button>
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
              {!isCollapsed && 'Dashboard'}
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
              {!isCollapsed && 'Journaling'}
            </NavLink>
          </li>
          <li className="nav-item mb-3 d-flex align-items-center" title="Reminders">
            <i className="bi bi-clock me-2" />
            {!isCollapsed && 'Reminders'}
          </li>
          <li className="nav-item mb-3 d-flex align-items-center" title="Health Check">
            <i className="bi bi-heart-pulse me-2" />
            {!isCollapsed && 'Health Check'}
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
              {!isCollapsed && 'Profile'}
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
              {!isCollapsed && 'Teno Bot'}
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
          <p
            className="mb-1 fw-bold"
            style={{ color: '#2563EB', display: isCollapsed ? 'none' : 'block' }}
          >
            You are stronger than you think
          </p>
          {!isCollapsed && <small style={{ color: '#656565' }}>continue your progress</small>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
