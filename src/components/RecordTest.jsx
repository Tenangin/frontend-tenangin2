import React, { useState, useEffect } from "react";
import { getAssessments } from "../data/api/api";
import { getToken } from "../utils/auth";

const RecordTest = () => {
  const [records, setRecords] = useState([]);
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

  if (loading) {
    return <div className="col-md-6"><p>Loading records...</p></div>;
  }

  if (error) {
    return  <div
          className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
          style={{ backgroundColor: "#EFF4FF" }}
        >
          <p className="text-danger">{error}</p>
        </div>;
  }

  return (
    <div className="col-md-6">
      <h6 className="text-primary mb-3">Record Test</h6>
      {records.length === 0 ? (
        <div
          className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
          style={{ backgroundColor: "#EFF4FF" }}
        >
          <p>No assessment records found.</p>
        </div>
      ) : records.length > 4 ? (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {records.map((record, idx) => (
            <div
              key={idx}
              className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
              style={{ backgroundColor: "#EFF4FF" }}
            >
              <div>
                <h6 className="mb-1 fw-semibold">{record.condition}</h6>
                <small className="text-muted">Score: {record.score}</small>
                <p className="mb-0">{record.result_text}</p>
              </div>
              {/* <span className="badge bg-primary rounded-pill">7:00 pm</span> */}
            </div>
          ))}
        </div>
      ) : (
        records.map((record, idx) => (
          <div
            key={idx}
            className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
            style={{ backgroundColor: "#EFF4FF" }}
          >
            <div>
              <h6 className="mb-1 fw-semibold">{record.condition}</h6>
              <small className="text-muted">Score: {record.score}</small>
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
