import React, { useState, useEffect } from "react";
import { getAssessments } from "../data/api/api";
import { getToken } from "../utils/auth";

const RecordTest = () => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("harian"); // default filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAssessments() {
      const token = getToken();
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }
      try {
        const data = await getAssessments(token);
        console.log("Fetched assessments:", data);
        if (data && Array.isArray(data)) {
          setRecords(data);
          setError(null);
        } else {
          setRecords([]);
          setError("No assessments found, You didnt take any assessment yet.");
        }
      } catch {
        setError("Failed to fetch assessments");
      } finally {
        setLoading(false);
      }
    }
    fetchAssessments();
  }, []);

  const filterRecords = (records) => {
    const now = new Date();
    return records.filter((record) => {
      if (filter === "all") return true;
      if (!record.created_at) return false;
      const createdDate = new Date(record.created_at);
      switch (filter) {
        case "harian": {
          return (
            createdDate.getDate() === now.getDate() &&
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }
        case "mingguan": {
          const diffTime = now - createdDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        }
        case "bulanan": {
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }
        default:
          return true;
      }
    });
  };

  if (loading) {
    return (
      <div className="col-md-6 d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
        <div className="spinner-border text-primary" role="status" aria-label="Loading">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return  <div
          className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
          style={{ backgroundColor: "#EFF4FF" }}
        >
          <p className="text-danger">{error}</p>
        </div>;
  }

  const filteredRecords = filterRecords(records);

  return (
    <div className="col-md-6">
      <h6 className="text-primary mb-3">Record Test</h6>
      <div className="mb-3">
      <select
        className="form-select"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Filter records by date"
      >
        <option value="all">All</option>
        <option value="harian">Harian</option>
        <option value="mingguan">Mingguan</option>
        <option value="bulanan">Bulanan</option>
      </select>
      </div>
      {filteredRecords.length === 0 ? (
        <div
          className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
          style={{ backgroundColor: "#EFF4FF" }}
        >
          <p>No assessment records found.</p>
        </div>
      ) : filteredRecords.length > 4 ? (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredRecords.map((record, idx) => (
            <div
              key={idx}
              className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
              style={{ backgroundColor: "#EFF4FF" }}
            >
              <div>
                <h6 className="mb-1 fw-semibold">{record.condition}</h6>
                <small className="text-muted">Confident: {record.score}</small>
                <p className="mb-0">{record.result_text}</p>
              </div>
              {/* <span className="badge bg-primary rounded-pill">7:00 pm</span> */}
            </div>
          ))}
        </div>
      ) : (
        filteredRecords.map((record, idx) => (
          <div
            key={idx}
            className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
            style={{ backgroundColor: "#EFF4FF" }}
          >
            <div>
              <h6 className="mb-1 fw-semibold">{record.condition}</h6>
              <small className="text-muted">Confident: {record.score}</small>
              <p className="mb-0">{record.result_text}</p>
            </div>
            {/* <span className="badge bg-primary rounded-pill">7:00 pm</span> */}
          </div>
        ))
      )}
    </div>
  );
};

export default RecordTest;
