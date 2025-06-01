import React from "react";
import Sidebar from "../components/Sidebar";
import Account from "../components/Account";
import Notifications from "../components/Notifications";
import ProfileCard from "../components/ProfileCard";
import ProfileTabs from "../components/ProfileTabs";
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
            <ProfileCard />
          {/* Tabs */}
          <ProfileTabs />
        </div>
      </div>
    </div>
  );
}

export default Profile;
