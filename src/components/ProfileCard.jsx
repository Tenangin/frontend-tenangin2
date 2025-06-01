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
    return <div>Loading profile...</div>;
  }

  const genderClass = profile.gender && profile.gender.toLowerCase() === "female"
    ? "badge rounded-pill bg-pink-subtle text-pink"
    : "badge rounded-pill bg-primary-subtle text-primary";

  return (
    <div className="profile-top d-flex justify-content-between align-items-start gap-5 mt-4">
      <div className="d-flex align-items-center gap-3">
        <img src="/images/user.svg" alt="Avatar" className="rounded-circle profile-avatar" />
        <div>
          <h5 className="fw-bold mb-1">{profile.full_name}</h5>
          <span className={genderClass}>{profile.gender}</span>
          <p className="text-muted mt-1 mb-0">{getUserEmail()}</p>
        </div>
      </div>

      <div className="profile-right-info">
        <p className="mb-2"><strong>Place of Birth:</strong><br />{profile.place_of_birth}</p>
        <p className="mb-0"><strong>Date of Birth:</strong><br />{profile.date_of_birth}</p>
        <p className="mb-0"><strong>Age:</strong><br />{profile.age}</p>
      </div>
    </div>
  );
}

export default ProfileCard;
