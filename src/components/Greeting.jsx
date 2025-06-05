import React, { useState, useEffect } from "react";
import { getProfile } from "../data/api/api";
import { getToken, getUserId } from "../utils/auth";

function Greeting() {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        const userId = getUserId();
        // console.log("Fetching profile with token:", token, "and userId:", userId);
        if (token && userId) {
          const profileData = await getProfile(token, userId);
          if (profileData && profileData.profile.full_name) {
            setFullName(profileData.profile.full_name);
          } else {
            setFullName("none");
          }
          // console.log("Profile fetched successfully:", profileData);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h5 className="fw-bold text-primary">
        Hi {loading ? "..." : fullName === null ? "........" : fullName || "there"}, Good Afternoon!
      </h5>
      <p className="text-muted">What do you feel today?</p>
    </div>
  );
}

export default Greeting;
