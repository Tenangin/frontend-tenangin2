import React, { useState, useEffect } from "react";
import { getProfile, getAssessments } from "../data/api/api.jsx";
import { getToken, getUserId } from "../utils/auth.js";
import { useNavigate } from "react-router-dom";
import '../styles/ProfileTabs.css';

const ProfileTabs = ({ setShowModal }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const token = getToken();
  const id = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      if (token && id) {
        try {
          const response = await getProfile(token, id);
          if (response && response.profile) {
            setProfile(response.profile);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    }
    fetchProfile();
  }, [token, id]);

  useEffect(() => {
    async function fetchAssessments() {
      if (token) {
        try {
          const response = await getAssessments(token);
          if (response && Array.isArray(response)) {
            setAssessments(response);
          }
        } catch (error) {
          console.error("Failed to fetch assessments:", error);
        }
      }
    }
    fetchAssessments();
  }, [token]);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

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
          {/* Address */}
          <div className="profile-info-card">
            <h6>Address</h6>
            <div className="d-flex flex-wrap gap-3">
              <p>
                {profile.address}
              </p>
            </div>
          </div>
          
          {/* About Card */}
          <div className="profile-info-card">
            <h6>About</h6>
            <p>
              {profile.about_me}
            </p>
          </div>
          <div className="edit-profile-button-container">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Edit Profile
            </button>
          </div>
        </>
      )}

      {/* Record Tabs */}
      {activeTab === "record" && (
        <>
          {assessments.length === 0 ? (
            <div className="card mt-4 p-4 shadow-sm rounded-4 border-0">
              <p>No assessment records found.</p>
            </div>
          ) : (
            <div className="assessment-cards-container mt-4 d-flex flex-column gap-4">
            {assessments.map((assessment, index) => (
              <div
                key={index}
                className="p-4 rounded-4 shadow-sm border-0 assessment-card"
                style={{
                  backgroundColor: "#e7f1ff", // biru soft (mirip Bootstrap primary light)
                  borderLeft: "6px solid #0d6efd",
                  transition: "transform 0.2s ease",
                }}
              >
                <div className="mb-3">
                  <h6 className="fw-semibold text-primary mb-1">Condition</h6>
                  <p className="mb-0 text-dark">{assessment.condition}</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-semibold text-primary mb-1">Score</h6>
                  <p className="mb-0 text-dark">{assessment.score}</p>
                </div>

                <div>
                  <h6 className="fw-semibold text-primary mb-1">Result Text</h6>
                  <p className="mb-0 text-dark">{assessment.result_text}</p>
                </div>
              </div>
            ))}
          </div>
          )}
          <div className="mt-4 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/HealthCheck')}
            >
              Test Again
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileTabs;
