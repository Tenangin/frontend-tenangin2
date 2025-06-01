import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Account from "../components/Account";
import Notifications from "../components/Notifications";
import ProfileCard from "../components/ProfileCard";
import ProfileTabs from "../components/ProfileTabs";
import ModalPopup from "../components/ProfileModalPopup";
import "../styles/Profile.css";

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    placeOfBirth: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    address: "",
    aboutMe: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit logic here
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
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
          <ProfileCard />
          {/* Tabs */}
          <ProfileTabs />
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
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
        />

      </div>
    </div>
  );
}

export default Profile;
