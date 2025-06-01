import React from "react";

function ProfileCard() {
  return (
    <div className="profile-top d-flex justify-content-between align-items-start gap-5 mt-4">
      <div className="d-flex align-items-center gap-3">
        <img src="/images/user.svg" alt="Avatar" className="rounded-circle profile-avatar" />
        <div>
          <h5 className="fw-bold mb-1">Najmi Hanif</h5>
          <span className="badge rounded-pill bg-primary-subtle text-primary">Gender</span>
          <p className="text-muted mt-1 mb-0">najmi@gmail.com</p>
        </div>
      </div>

      <div className="profile-right-info">
        <p className="mb-2"><strong>Place of Birth:</strong><br />Pare-pare</p>
        <p className="mb-0"><strong>Date of Birth:</strong><br />23 Januari 1856</p>
        <p className="mb-0"><strong>Age:</strong><br />21</p>
      </div>
    </div>
  );
}

export default ProfileCard;
