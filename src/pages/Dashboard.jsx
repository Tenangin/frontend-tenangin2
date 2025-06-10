import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import Account from "../components/Account";
// import Notifications from "../components/Notifications";
import Greeting from "../components/Greeting";
import Reminders from "../components/RecordTest";
import Journaling from "../components/Journaling";
// import ProfileFormPopup from "../components/ProfileFormPopup";
import ModalPopup from "../components/ProfileModalPopup";
import SearchInput from "../components/SearchInput";
import { getToken, getUserId } from "../utils/auth";
import { getProfile } from "../data/api/api";
// import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");
  // const [filteredResults, setFilteredResults] = useState([]);

  // const navigate = useNavigate();

  // const menuItems = [
  //   { name: "Dashboard", path: "/Dashboard" },
  //   { name: "Journaling", path: "/Journaling" },
  //   { name: "Teno Bot", path: "/Chatbot" },
  //   { name: "HealthCheck", path: "/HealthCheck" },
  //   { name: "Profile", path: "/Profile" },
  // ];

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function checkProfile() {
      const userId = getUserId();
      const token = getToken();
      try {
        const data = await getProfile(token, userId);
        if (data && data.profile) {
          const p = data.profile;
          if (
            !p.full_name ||
            !p.age ||
            !p.gender ||
            !p.address ||
            !p.place_of_birth ||
            !p.date_of_birth ||
            !p.about_me
          ) {
            setShowProfileForm(true);
          }
        } else {
          setShowProfileForm(true);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setShowProfileForm(true);
      }
    }
    checkProfile();
  }, []);

  // useEffect(() => {
  //   if (searchTerm === "") {
  //     setFilteredResults([]);
  //   } else {
  //     const results = menuItems.filter((item) =>
  //       item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredResults(results);
  //   }
  // }, [searchTerm]);

  // const handleSelect = (item) => {
  //   setSearchTerm("");
  //   setFilteredResults([]);
  //   navigate(item.path);
  // };

  const handleProfileUpdate = () => {
    setShowProfileForm(false);
    setSuccessMessage("Profile sudah di tambahkan");
    setTimeout(() => setSuccessMessage(""), 3000);
    window.location.reload();
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {isSidebarVisible && (
        <div className="sidebar-wrapper">
          <Sidebar
            isOverlay={isMobile}
            isVisible={isSidebarVisible}
            onClose={() => setIsSidebarVisible(false)}
          />
        </div>
      )}

      {isSidebarVisible && isMobile && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      {/* Main content */}
      <main
        className="dashboard-main flex-grow-1 p-4"
        style={{ marginLeft: isSidebarVisible && !isMobile ? '250px' : 0 }}
      >
        {/* Header */}
        <div className="d-flex flex-column mb-4 position-relative">
          <div className="toggle-button-container">
            <button
              className="btn btn-outline-primary mb-2 align-self-start mobile"
              onClick={toggleSidebar}
              aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
          <div className="d-flex justify-content-between align-items-center flex-column flex-md-row">
            {isMobile ? (
              <>
              <div className="d-flex align-items-center gap-3 mb-3 position-relative">
                <SearchInput />
                {/* <Notifications /> */}
                <Account />
              </div>
                <Greeting />
              </>
            ) : (
              <>
                <Greeting />
              <div className="d-flex align-items-center gap-3 position-relative">
                <SearchInput />
                {/* <Notifications /> */}
                <Account />
              </div>
              </>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {/* Highlight Card */}
        <div
          className="p-4 mb-4 rounded-4 d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#EFF4FF" }}
        >
          <div>
            <h6 className="fw-bold text-primary">You’re not alone. Tenangin is here</h6>
            <p className="text-muted">
              Your mental well-being matters. Let Tenangin be your safe space to
              reflect, heal, and grow.
            </p>
            <button className="btn btn-outline-primary rounded-pill px-4">
              Get Access
            </button>
          </div>
          <img
            src="/images/dashboard-ilustration.svg"
            alt="illustration"
            height="120"
          />
        </div>

        {/*Journaling */}
        <div className="row">
          <Journaling />
          <Reminders />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {showProfileForm && (
          <ModalPopup
            showModal={showProfileForm}
            handleCancel={() => setShowProfileForm(false)}
            onUpdate={handleProfileUpdate}
          />
        )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
