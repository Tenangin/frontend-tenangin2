import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications';
import Account from '../components/Account';
import useSidebarToggle from '../hooks/useSidebarToggle';

const Chatbot = () => {
  const { isSidebarVisible, isMobile, toggleSidebar, setIsSidebarVisible } = useSidebarToggle();
  const [showModal, setShowModal] = useState(true);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowModal(false);
    setStarted(true);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    // Simple bot response (echo)
    const botMessage = { sender: 'bot', text: `You said: ${input.trim()}` };
    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {isSidebarVisible && (
        <Sidebar isOverlay={isMobile} isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
      )}

      {isSidebarVisible && isMobile && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      <div className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex flex-column mb-4 position-relative">
          <div className="toggle-button-container">
            <button
              className="btn btn-outline-primary mb-2 align-self-start mobile"
              onClick={toggleSidebar}
              aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold text-primary">Tenangin</h4>
            <div className="d-flex align-items-center gap-3">
              <Notifications />
              <Account />
            </div>
          </div>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Welcome to Teno Bot</h5>
                </div>
                <div className="modal-body">
                  <p>Welcome to Teno Bot</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleGetStarted}>
                    Get Started
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chatbot content */}
        {started && (
          <div className="d-flex flex-column" style={{ height: '80vh', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
            <h2>Teno Bot Chat</h2>
            <div className="flex-grow-1 overflow-auto mb-3" style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
              {messages.length === 0 && <p className="text-muted">No messages yet. Start the conversation!</p>}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex mb-2 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`p-2 rounded ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                    style={{ maxWidth: '60%' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;

