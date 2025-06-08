import React, { useState, useEffect } from "react";
import { getToken, getUserId } from "../utils/auth.js";
import { useNavigate } from "react-router-dom";
import '../styles/ProfileTabs.css';
import { 
  getProfile, 
  getAssessments, 
  getRecommendations, 
  deleteAssessment, 
  deleteRecommendation 
} from "../data/api/api.jsx";


// Helper function to convert rating number to star icons
const getRatingStars = (rating) => {
  if (typeof rating !== 'number' || rating <= 0) {
    return '☆☆☆☆☆';
  }
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
};

const ProfileTabs = ({ setShowModal }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [savedClinics, setSavedClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const [errorClinics, setErrorClinics] = useState(null);
  const token = getToken();
  const id = getUserId();
  const navigate = useNavigate();

  const fetchSavedClinics = async () => {
    setLoadingClinics(true);
    setErrorClinics(null);
    try {
      const response = await getRecommendations(token);
      console.log("Saved Clinics Response:", response);
      if (response && Array.isArray(response)) {
        console.log("Saved Clinics Length:", response.length);
        setSavedClinics(response);
      } else {
        console.log("Saved Clinics is not an array or empty");
        setSavedClinics([]);
      }
    } catch (error) {
      console.error("Failed to fetch saved clinics:", error);
      setErrorClinics("Gagal memuat data klinik tersimpan.");
    } finally {
      setLoadingClinics(false);
    }
  };

  const handleDeleteRecommendation = async (recommendationId, event) => {
    event.stopPropagation();
    try {
      await deleteRecommendation(token, recommendationId);
      alert("Klinik berhasil dihapus.");
      await fetchSavedClinics();
    } catch (error) {
      console.error("Failed to delete recommendation:", error);
      alert("Gagal menghapus klinik. Silakan coba lagi.");
    }
  };

  const handleDeleteAssessment = async (assessmentId, event) => {
    event.stopPropagation();
    try {
      await deleteAssessment(token, assessmentId);
      alert("Assessment berhasil dihapus.");
      await fetchAssessments();
    } catch (error) {
      console.error("Failed to delete assessment:", error);
      alert("Gagal menghapus assessment. Silakan coba lagi.");
    }
  };

  const handleOpenGoogleMaps = (lat, lon, event) => {
    event.stopPropagation();
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, '_blank');
  };

  const fetchAssessments = async () => {
    try {
      const response = await getAssessments(token);
      if (response && Array.isArray(response)) {
        setAssessments(response);
      }
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
    }
  };

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
    fetchAssessments();
  }, [token]);

  useEffect(() => {
    if (activeTab === "clinicSaved" && token) {
      fetchSavedClinics();
    }
  }, [activeTab, token]);

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
        <button
          className={`tab ${activeTab === "clinicSaved" ? "active" : ""}`}
          onClick={() => setActiveTab("clinicSaved")}
        >
          <i className="bi bi-heart"></i> Clinic Saved
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
                      backgroundColor: "#d0e4ff", // soft blue color improved
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
                    <div className="text-end mt-3 justify-content-right">
                      <button className="btn btn-danger" onClick={(event) => handleDeleteAssessment(assessment.id, event)}>
                        Hapus
                      </button>
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

      {/* Clinic Saved Tab */}
      {activeTab === "clinicSaved" && (
        <>
          {loadingClinics ? (
            <div className="card mt-4 p-4 shadow-sm rounded-4 border-0 d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
              <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : errorClinics ? (
            <div className="card mt-4 p-4 shadow-sm rounded-4 border-0 text-danger">
              <p>{errorClinics}</p>
            </div>
          ) : savedClinics.length === 0 ? (
            <div className="card mt-4 p-4 shadow-sm rounded-4 border-0">
              <p>Tidak ada klinik tersimpan.</p>
            </div>
          ) : (
            <div className={`recommendation-list-area`}>
              <ul className="recommendation-list">
                {savedClinics.map((clinic, index) => (
                  <li key={clinic.place_id || index}>
                    <h3>{clinic.clinics.name || "Nama tidak tersedia"}</h3>
                    <p>{clinic.clinics.category || "Kategori tidak diketahui"}</p>
                    <p>{clinic.clinics.addres_full || "Alamat tidak tersedia"}{clinic.clinics.provinsi ? `, ${clinic.clinics.provinsi}` : ''}</p>
                    <p dangerouslySetInnerHTML={{ __html: `Rating: ${getRatingStars(clinic.clinics.rating)} (${clinic.clinics.review_count || 0} ulasan)` }} />
                    {clinic.clinics.jarak_km !== undefined && <p className="italic-text">Perkiraan Jarak: {parseFloat(clinic.clinics.jarak_km).toFixed(2)} km</p>}
                    <div className="text-end mt-3 justify-content-right">
                      <button className="btn btn-primary" onClick={(event) => handleOpenGoogleMaps(clinic.clinics.latitude, clinic.clinics.longitude, event)}>
                        <span className="bi bi-geo-alt-fill me-2" style={{ fontSize: '1.2rem' }}></span>
                        Open in Google Maps
                      </button>
                      <button className="btn btn-danger ms-2" onClick={(event) => handleDeleteRecommendation(clinic.id, event)}>
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProfileTabs;
