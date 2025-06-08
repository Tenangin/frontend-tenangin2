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
import useSidebarToggle from "../hooks/useSidebarToggle";

function Profile() {
  const { isSidebarVisible, isMobile, toggleSidebar, setIsSidebarVisible } = useSidebarToggle();
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
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {isSidebarVisible && (
        <div className="sidebar-wrapper">
          <Sidebar isOverlay={isMobile} isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
        </div>
      )}

      {isSidebarVisible && isMobile && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      <div style={{ flex: 1, padding: "1rem 2rem", marginLeft: isSidebarVisible && !isMobile ? '250px' : 0, transition: 'margin-left 0.3s ease' }}>
        {/* Header */}
        <div className="profile-container p-4 position-relative">
          <div className="toggle-button-container">
            <button
              className="btn btn-outline-primary mb-2 align-self-start mobile"
              onClick={toggleSidebar}
              aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            >
              <i className="bi bi-list"></i>
            </button>
            <div className="d-flex align-items-center gap-3">
              <Notifications />
              <Account />
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center m-4 border-bottom">
            <h2 className="fw-bold text-primary">Profile</h2>
          </div>
        </div>
        <div className="profile-wrapper">
          {/* Top Section */}
          <ProfileCard profileData={profileData} />
          {/* Tabs */}
          <ProfileTabs profileData={profileData} setShowModal={setShowModal} />
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
