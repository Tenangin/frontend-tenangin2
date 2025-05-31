import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Journaling.css';
import Notifications from '../components/Notifications';
import Account from '../components/Account';

function Journaling() {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    // Load drafts from sessionStorage
    const savedDrafts = sessionStorage.getItem('journalingDrafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  useEffect(() => {
    // Save drafts to sessionStorage
    sessionStorage.setItem('journalingDrafts', JSON.stringify(drafts));
  }, [drafts]);

  const onDateChange = (selectedDate) => {
    setDate(selectedDate);
    const dateKey = selectedDate.toDateString();
    setContent(drafts[dateKey] || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setContent('');
  };

  const saveJournaling = () => {
    const dateKey = date.toDateString();
    setDrafts((prev) => ({
      ...prev,
      [dateKey]: content,
    }));
    closeModal();
  };

  return (
    <div className="journaling-container">
      <Sidebar />
      <div className="journaling-main flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary">Tenangin</h4>
          <div className="d-flex align-items-center gap-3">
            <Notifications />
            <Account />
          </div>
        </div>
        <h2>Journaling Calendar</h2>  
        <div className="calendar-wrapper">
          <Calendar onChange={onDateChange} value={date} />
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
              <h3>Journaling for </h3>
              <h4>{date.toDateString()}</h4>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Write your journaling content here..."
                />
                <div className="modal-buttons">
                  <button onClick={closeModal}>Cancel</button>
                  <button onClick={saveJournaling}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Journaling;
