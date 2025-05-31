import React from "react";
import Sidebar from "../components/Sidebar";
import Account from "../components/Account";
import Notifications from "../components/Notifications";
import "../styles/Profile.css";

function Profile() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "1rem 2rem" }}>
        {/* Header */}
        <div className="profile-container p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold text-primary">Tenangin</h4>
            <div className="d-flex align-items-center gap-3">
              <Notifications />
              <Account />
            </div>
          </div>
        </div>
        <div className="profile-wrapper">
          {/* Top Section */}
          <div className="profile-top d-flex justify-content-between align-items-start mt-4">
            <div className="d-flex align-items-center gap-3">
              <img src="/images/user.svg" alt="Avatar" className="rounded-circle profile-avatar" />
              <div>
                <h5 className="fw-bold mb-1">Najmi Hanif</h5>
                <span className="badge rounded-pill bg-primary-subtle text-primary">Student</span>
                <p className="text-muted mt-1 mb-0">najmi@gmail.com</p>
              </div>
            </div>

            <div className="profile-right-info">
              <p className="mb-2"><strong>Involvements:</strong><br />CBO at Life partners</p>
              <p className="mb-0"><strong>Specialisation:</strong><br />Bachelor of IT</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs d-flex gap-4 mt-4">
            <button className="tab active"><i className="bi bi-person"></i> About me</button>
            <button className="tab"><i className="bi bi-bullseye"></i> My Goals</button>
            <button className="tab"><i className="bi bi-journal-check"></i> Record Test</button>
          </div>

          {/* About Card */}
          <div className="card mt-4 p-4 shadow-sm rounded-4 border-0">
            <h6 className="fw-bold text-primary mb-2">About</h6>
            <p className="text-muted mb-0">
              Dynamic And Motivated Marketing Professional With A Proven Record Of Generating And Building
              Relationships, Managing Projects From Concept To Completion...
            </p>
          </div>

          {/* Skills */}
          <div className="card mt-4 p-4 shadow-sm rounded-4 border-0">
            <h6 className="fw-bold text-primary mb-3">Skills</h6>
            <div className="d-flex flex-wrap gap-3">
              {["Figma", "Javascript", "Adobe XD", "React Js"].map((skill, idx) => (
                <span key={idx} className="badge bg-light text-primary px-3 py-2 rounded-pill border">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
