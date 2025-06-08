import React, { useState, useEffect } from "react";
import { getJournalEntries } from "../data/api/api.jsx";
import { getToken } from "../utils/auth.js";

const Journaling = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [filter, setFilter] = useState("All");
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const response = await getJournalEntries(token);
        if (response && Array.isArray(response)) {
          setJournalEntries(response);
        } else {
          setJournalEntries([]);
        }
      } catch (error) {
        console.error("Failed to fetch journal entries:", error);
        setJournalEntries([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchJournalEntries();
    }
  }, [token]);

  // Update current time every minute for dynamic filtering
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filterEntries = (entries) => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      if (filter === "This Month") {
        return (
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFulYear() === now.getFullYear()
        );
      } else if (filter === "This Week") {
        // Adjust startOfWeek to Sunday 00:00:00
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        // Adjust endOfWeek to Saturday 23:59:59.999
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return entryDate >= startOfWeek && entryDate <= endOfWeek;
      } else if (filter === "This Year") {
        return entryDate.getFullYear() === now.getFullYear();
      } else if (filter === "Today") {
        return (
          entryDate.getDate() === now.getDate() &&
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear()
        );
      }
      return true; // "All"
    });
  };

  const filteredEntries = filterEntries(journalEntries);

  if (loading) {
    return (
      <div className="col-md-6 d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
        <div className="spinner-border text-primary" role="status" aria-label="Loading">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-6">
      <h6 className="text-primary mb-3">Journaling</h6>
      <div className="mb-3">
        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter journal entries"
        >
          <option value="All">All</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="This Year">This Year</option>
        </select>
      </div>
      {filteredEntries.length === 0 ? (
        <p className="text-muted">No journal entries found.</p>
      ) : (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredEntries.slice(0, 7).map((entry, idx) => (
            <div
              key={idx}
              className="p-4 rounded-4 mb-3 d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#EFF4FF", width: '100%' }}
            >
              <div>
                <h6 className="mb-1 fw-semibold">My Day</h6>
                <p className="text-muted small mb-0">{entry.content}</p>
                <p className="text-muted small mb-0">
                  <span className="fw-semibold">Sentiment:</span> {entry.sentiment}</p>
              </div>
              <span className="badge bg-primary rounded-pill">
                {formatDateTime(entry.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journaling;
