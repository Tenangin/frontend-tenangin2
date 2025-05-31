import React, { useState, useEffect, useRef } from 'react';

const Notifications = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);

  const togglePopup = () => {
    setPopupOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setPopupOpen(false);
    }
  };

  useEffect(() => {
    if (popupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupOpen]);

  // Placeholder notifications list
  const notifications = [
    { id: 1, message: 'Notification 1', time: '2 hours ago' },
    { id: 2, message: 'Notification 2', time: '1 day ago' },
    { id: 3, message: 'Notification 3', time: '3 days ago' },
  ];

  return (
    <div className="notifications" style={{ position: 'relative', display: 'inline-block' }}>
      <i
        className="bi bi-bell fs-5 me-2"
        style={{ cursor: 'pointer' }}
        onClick={togglePopup}
        aria-label="Notifications"
      />
      {popupOpen && (
        <div
          className="notifications-popup"
          ref={popupRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 0.5rem 1rem rgba(0,0,0,.15)',
            borderRadius: '0.25rem',
            marginTop: '0.5rem',
            minWidth: '250px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            padding: '0.5rem',
          }}
        >
          <h5 style={{ margin: '0 0 0.5rem 0' }}>Notifications</h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map((notif) => (
              <li key={notif.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <div>{notif.message}</div>
                <small style={{ color: '#888' }}>{notif.time}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
