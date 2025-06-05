import React from 'react';

const SessionsSidebar = ({
  sessions,
  currentSessionId,
  switchSession,
  deleteSession,
  createNewSession,
  createSessionMutation,
  deleteSessionMutation,
  isOverlay,
  isVisible,
  // onClose,
}) => {
  const baseStyles = {
    backgroundColor: '#fff',
    width: '250px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: isOverlay ? 'fixed' : 'static',
    top: isOverlay ? 0 : 'auto',
    left: isOverlay ? '180px' : 'auto',
    height: '100vh',
    zIndex: isOverlay ? 1050 : 'auto',
    boxShadow: isOverlay ? '2px 0 5px rgba(0,0,0,0.3)' : 'none',
    transform: isOverlay && !isVisible ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'transform 0.3s ease',
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="sessions-sidebar" style={baseStyles}>
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h6 className="text-primary fw-bold mb-0">Chat Sessions</h6>
        {/* {isOverlay && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={onClose}
            aria-label="Close Chat Sessions Sidebar"
          >
            <i className="bi bi-x"></i>
          </button>
        )} */}
        <button
          className="btn btn-primary btn-sm py-1 px-2"
          onClick={() => createNewSession()}
          title="New Session"
          disabled={createSessionMutation.isLoading}
        >
          {createSessionMutation.isLoading ? '...' : <i className="fas fa-plus"></i>}
        </button>
      </div>
      <div className="p-2 flex-grow-1" style={{ overflowY: 'auto' }}>
        {sessions && sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 mb-2 rounded cursor-pointer border ${
                currentSessionId === session.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-light border-light hover-bg-light'
              }`}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => switchSession(session.id)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="flex-grow-1"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <h6
                    className="mb-1 fw-semibold"
                    style={{
                      fontSize: '0.9rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {new Date(session.session_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </h6>
                  <small
                    className={currentSessionId === session.id ? 'text-white-50' : 'text-muted'}
                    style={{
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {session.summary
                      ? session.summary.length > 30
                        ? session.summary.substring(0, 30) + '...'
                        : session.summary
                      : 'Mulai percakapan...'}
                  </small>
                </div>
                <button
                  className={`btn btn-sm ms-2 p-1 ${
                    currentSessionId === session.id ? 'btn-outline-light' : 'btn-outline-danger'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  title="Delete Session"
                  disabled={deleteSessionMutation.isLoading && deleteSessionMutation.variables === session.id}
                >
                  {deleteSessionMutation.isLoading && deleteSessionMutation.variables === session.id ? (
                    '...'
                  ) : (
                    <i className="fas fa-trash" style={{ fontSize: '0.8rem' }}></i>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center p-3">Belum ada sesi.</p>
        )}
      </div>
    </aside>
  );
};

export default SessionsSidebar;
