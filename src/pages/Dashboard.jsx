import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import Account from "../components/Account";
import Notifications from "../components/Notifications";
import Greeting from "../components/Greeting";
import ProfileFormPopup from "../components/ProfileFormPopup";
import { getToken, getUserId } from "../utils/auth";
import { getProfile } from "../data/api/api";

function Dashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
  const userId = getUserId();
  const token = getToken();
  useEffect(() => {
    async function checkProfile() {
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

  const handleProfileUpdate = () => {
    setShowProfileForm(false);
    setSuccessMessage("Profile sudah di tambahkan");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="dashboard-container d-flex">
      {isSidebarVisible && (
        <Sidebar isOverlay={isMobile} isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
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
        style={{ marginLeft: isSidebarVisible && !isMobile ? undefined : 0 }}
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
                <div className="d-flex align-items-center gap-3 mb-3">
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Search"
                  />
                  <Notifications />
                  <Account />
                </div>
                <Greeting />
              </>
            ) : (
              <>
                <Greeting />
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Search"
                  />
                  <Notifications />
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

        {/* Reminders & Journaling */}
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-primary mb-3">Reminders</h6>
            {["Js", "Nextjs", "React", "React"].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-4  d-flex justify-content-between align-items-center mb-3"
                style={{ backgroundColor: "#EFF4FF" }}
              >
                <div>
                  <h6 className="mb-1 fw-semibold">Week 01 Assignment</h6>
                  <small className="text-muted">{item} assignment</small>
                </div>
                <span className="badge bg-primary rounded-pill">7:00 pm</span>
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <h6 className="text-primary mb-3">Journaling</h6>
            <div
              className="p-3 rounded-4  mb-3 d-flex justify-content-between"
              style={{ backgroundColor: "#EFF4FF" }}
            >
              <div>
                <h6 className="mb-1 fw-semibold">My Day</h6>
                <p className="text-muted small mb-0">
                  Today felt a bit slow, but I managed to get some important things
                  done...
                </p>
              </div>
              <span className="badge bg-primary rounded-pill">7:00 pm</span>
            </div>
            {["Nextjs", "React"].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-4  d-flex justify-content-between align-items-center mb-3"
                style={{ backgroundColor: "#EFF4FF" }}
              >
                <div>
                  <h6 className="mb-1 fw-semibold">Week 01 Assignment</h6>
                  <small className="text-muted">{item} assignment</small>
                </div>
                <span className="badge bg-primary rounded-pill">7:00 pm</span>
              </div>
            ))}
          </div>
        </div>
        {showProfileForm && (
          <ProfileFormPopup
            showModal={showProfileForm}
            handleCancel={() => setShowProfileForm(false)}
            onUpdate={handleProfileUpdate}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
