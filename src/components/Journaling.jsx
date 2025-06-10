import React, { useState, useEffect } from "react";
import { getJournalEntries } from "../data/api/api.jsx";
import { getToken } from "../utils/auth.js";
import SentimentProgressBar from "./SentimentProgressBar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Journaling = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [filter, setFilter] = useState("All");
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [expandedEntries, setExpandedEntries] = useState({});
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

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

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
          entryDate.getFullYear() === now.getFullYear()
        );
      } else if (filter === "This Week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

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
      return true;
    });
  };

  const filteredEntries = filterEntries(journalEntries);

  if (loading) {
    return (
      <div
        className="col-md-6 d-flex justify-content-center align-items-center"
        style={{ height: "100px" }}
      >
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
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {filteredEntries.slice(0, 7).map((entry, idx) => {
            const key = entry.id || entry.created_at || idx;
            const isExpanded = expandedEntries[key];

            return (
              <div
                key={key}
                className="p-4 rounded-4 mb-3"
                style={{ backgroundColor: "#EFF4FF", width: "100%" }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => {
                    setExpandedEntries(prev => ({ ...prev, [key]: !prev[key] }));
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dbe9ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EFF4FF'; }}
                >
                  <h6
                    className="mb-1 fw-semibold"
                    style={{ userSelect: 'none', cursor: 'pointer', margin: 0 }}
                  >
                    My Day
                  </h6>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      className="badge bg-primary rounded-pill me-2"
                      style={{ userSelect: 'none' }}
                    >
                      {formatDateTime(entry.created_at)}
                    </span>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                <div
                  style={{
                    maxHeight: isExpanded ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.5s ease',
                  }}
                >
                  {isExpanded && (
                    <div style={{ marginTop: '1rem' }}>
                      <p
                        className="text-muted small mb-2"
                        style={{
                          whiteSpace: 'normal',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {entry.content}
                      </p>
                      <SentimentProgressBar sentimentResults={entry.results || entry.sentiment} small={true} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Journaling;
