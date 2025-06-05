import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import Account from "../components/Account";
import Notifications from "../components/Notifications";
import Greeting from "../components/Greeting";

function Dashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
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

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="dashboard-container d-flex">
      {isSidebarVisible && <Sidebar />}

      {/* Main content */}
      <main
        className="dashboard-main flex-grow-1 p-4"
        style={{ marginLeft: isSidebarVisible ? undefined : 0 }}
      >
        {/* Header */}
        <div className="d-flex flex-column mb-4">
          <button
            className="btn btn-outline-primary mb-2 align-self-start"
            onClick={toggleSidebar}
            aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="d-flex justify-content-between align-items-center">
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
          </div>
        </div>

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
      </main>
    </div>
  );
}

export default Dashboard;
