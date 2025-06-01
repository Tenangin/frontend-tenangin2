import React from "react";
import "../styles/Profile.css";

function ModalPopup({ showModal, form, handleChange, handleSubmit, handleCancel }) {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "2rem",
          minWidth: "350px",
          maxWidth: "90vw",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h5 className="mb-3">Edit Profile</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Place of Birth</label>
            <input
              type="text"
              className="form-control"
              name="placeOfBirth"
              value={form.placeOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
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
            />
          </div>
          <div className="mb-3">
            <label className="form-label">About Me</label>
            <textarea
              className="form-control"
              name="aboutMe"
              value={form.aboutMe}
              onChange={handleChange}
              rows={2}
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Edit Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPopup;
