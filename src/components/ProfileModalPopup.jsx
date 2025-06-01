import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import { getProfile, updateProfile } from "../data/api/api";
import { getToken, getUserId } from "../utils/auth";

function ModalPopup({ showModal, handleCancel }) {
  const [form, setForm] = useState({
    full_name: "",
    place_of_birth: "",
    date_of_birth: "",
    age: "",
    gender: "",
    address: "",
    about_me: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = getToken();
  const userId = getUserId();

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      getProfile(token, userId)
        .then((data) => {
          console.log(data.profile);
          if (data && !data.error) {
            setForm({
              full_name: data.profile.full_name || "",
              place_of_birth: data.profile.place_of_birth || "",
              date_of_birth: data.profile.date_of_birth || "",
              age: data.profile.age || "",
              gender: data.profile.gender || "",
              address: data.profile.address || "",
              about_me: data.profile.about_me || "",
            });
            setError(null);
          } else {
            setError(data.error || "Failed to load profile data");
          }
        })
        .catch(() => {
          setError("Failed to load profile data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showModal, token, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting profile data:", form);
    setLoading(true);
    setError(null);
    try {
      const response = await updateProfile(token, userId, form);
      console.log(response);
      if (response && !response.error) {
        handleCancel(); // Close modal on success
      } else {
        setError(response.error || "Failed to update profile");
      }
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h5 className="mb-3">Edit Profile</h5>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Place of Birth</label>
            <input
              type="text"
              className="form-control"
              name="place_of_birth"
              value={form.place_of_birth}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              name="age"
              value={form.age}
              onChange={handleChange}
              min="0"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">About Me</label>
            <textarea
              className="form-control"
              name="about_me"
              value={form.about_me}
              onChange={handleChange}
              rows={2}
              disabled={loading}
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Edit Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPopup;
