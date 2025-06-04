import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, setUserId, setUsername } from "../utils/auth";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const id = params.get("id");
    const username = params.get("username");

    if (token && id && username) {
      setToken(token);
      setUserId(id);
      setUsername(username);
      navigate("/dashboard");
    } else {
      // If no token or user info, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <p>Processing authentication...</p>
    </div>
  );
}

export default AuthCallback;
