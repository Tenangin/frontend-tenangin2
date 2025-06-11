import React, { useState, useEffect } from "react";
import { getProfile } from "../data/api/api.jsx";
import { getUserEmail, getToken, getUserId } from "../utils/auth.js";
import '../styles/Profile.css';

function ProfileCard() {
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
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  const genderClass = profile.gender && profile.gender.toLowerCase() === "female"
    ? "badge rounded-pill bg-pink-subtle text-pink"
    : "badge rounded-pill bg-primary-subtle text-primary";

  return (
  <div className="profile-top d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start gap-4 gap-md-5 mt-4">
    <div>
      <h5 className="fw-bold mb-1">{profile.full_name}</h5>
      <span className={genderClass}>{profile.gender}</span>
      <p className="text-muted mt-1 mb-0">{getUserEmail()}</p>
    </div>
    <div className="profile-right-info mt-4 mt-md-0">
      <p className="mb-2"><strong>Place of Birth:</strong><br />{profile.place_of_birth}</p>
      <p className="mb-0"><strong>Date of Birth:</strong><br />{profile.date_of_birth}</p>
      <p className="mb-0"><strong>Age:</strong><br />{profile.age}</p>
    </div>
  </div>
  // <div className="profile-top d-flex align-items-start gap-5 mt-4">
  //     <div className="d-flex align-items-center gap-3">
  //       <div>
  //         <h5 className="fw-bold mb-1">{profile.full_name}</h5>
  //         <span className={genderClass}>{profile.gender}</span>
  //         <p className="text-muted mt-1 mb-0">{getUserEmail()}</p>
  //       </div>
  //     </div>

  //     <div className="profile-right-info">
  //       <p className="mb-2"><strong>Place of Birth:</strong><br />{profile.place_of_birth}</p>
  //       <p className="mb-0"><strong>Date of Birth:</strong><br />{profile.date_of_birth}</p>
  //       <p className="mb-0"><strong>Age:</strong><br />{profile.age}</p>
  //     </div>
  //   </div>
);
}

export default ProfileCard;
