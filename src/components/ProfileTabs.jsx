import React, { useState, useEffect } from "react";
import { getProfile } from "../data/api/api.jsx";
import { getToken, getUserId } from "../utils/auth.js";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState(null);
  const token = getToken();
  const id = getUserId();

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
          <div className="card mt-4 p-4 shadow-sm rounded-4 border-0">
            <h6 className="fw-bold text-primary mb-3">Address</h6>
            <div className="d-flex flex-wrap gap-3">
              <p className="text-muted mb-0">
                {profile.address}
              </p>
            </div>
          </div>
          
          {/* About Card */}
          <div className="card mt-4 p-4 shadow-sm rounded-4 border-0">
            <h6 className="fw-bold text-primary mb-2">About</h6>
            <p className="text-muted mb-0">
              {profile.about_me}
            </p>
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
