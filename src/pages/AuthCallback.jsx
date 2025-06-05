import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, setUserId, setUsername } from "../utils/auth";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse URL hash instead of search for OAuth tokens
    const hash = window.location.hash.substring(1); // remove leading '#'
    const params = new URLSearchParams(hash);
    console.log("AuthCallback params:", params.toString());
    const token = params.get("access_token");
    const id = params.get("id");
    const username = params.get("username");

    if (token) {
      setToken(token);
      setUserId(id);
      setUsername(username);
      navigate("/dashboard");
    } 
    // else {
    // // If no token or user info, redirect to login
    // navigate("/login");
    // }
  }, [navigate]);

  return (
    <div>
      <p>Processing authentication...</p>
    </div>
  );
}

export default AuthCallback;
