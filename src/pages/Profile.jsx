import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Account from "../components/Account";
import Notifications from "../components/Notifications";
import ProfileCard from "../components/ProfileCard";
import ProfileTabs from "../components/ProfileTabs";
import ModalPopup from "../components/ProfileModalPopup";
import { getProfile } from "../data/api/api";
import { getToken, getUserId } from "../utils/auth";
import "../styles/Profile.css";

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const token = getToken();
  const userId = getUserId();

  const fetchProfile = React.useCallback(() => {
    getProfile(token, userId)
      .then((data) => {
        if (data && !data.error) {
          setProfileData(data.profile);
        } else {
          setProfileData(null);
        }
      })
      .catch(() => {
        setProfileData(null);
      });
  }, [token, userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleUpdate = () => {
    fetchProfile();
    setShowModal(false);
    window.location.reload();
  };

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
          <ProfileCard profileData={profileData} />
          {/* Tabs */}
          <ProfileTabs profileData={profileData} />
          <div className="edit-profile-button-container">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Modal PopUp */}
        <ModalPopup
          showModal={showModal}
          handleCancel={handleCancel}
          onUpdate={handleUpdate}
          profileData={profileData}
        />
      </div>
    </div>
  );
}

export default Profile;
