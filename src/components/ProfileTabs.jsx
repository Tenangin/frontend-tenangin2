import React, { useState } from "react";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <>
      {/* Tabs */}
      <div className="profile-tabs d-flex gap-4 mt-4">
        <button
          className={`tab ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          <i className="bi bi-person"></i> About me
        </button>
        <button
          className={`tab ${activeTab === "record" ? "active" : ""}`}
          onClick={() => setActiveTab("record")}
        >
          <i className="bi bi-journal-check"></i> Record Test
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "about" && (
        <>
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
        </>
      )}

      {activeTab === "record" && (
        <div className="card mt-4 p-4 shadow-sm rounded-4 border-0">
          <p>Record Test content coming soon...</p>
        </div>
      )}
    </>
  );
};

export default ProfileTabs;
