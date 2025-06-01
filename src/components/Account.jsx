import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken, removeEmail, removeUserId, removeUsername } from '../utils/auth';

const Account = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here, e.g., clear auth tokens, etc.
    removeEmail();
    removeUserId();
    removeUsername();
    removeToken();
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="account-dropdown" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        className="account-toggle d-flex align-items-center"
        onClick={toggleDropdown}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <img src="/images/user.svg" alt="Profile" className="rounded-circle" width={40} height={40} />
        <span className="fw-semibold ms-2">Najmi</span>
      </div>
      {dropdownOpen && (
        <div
          className="dropdown-menu show"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 0.5rem 1rem rgba(0,0,0,.15)',
            borderRadius: '0.25rem',
            marginTop: '0.5rem',
            minWidth: '10rem',
            zIndex: 1000,
          }}
        >
          <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
            Profile
          </Link>
          <button type="button" className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Account;
