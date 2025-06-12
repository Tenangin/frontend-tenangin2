import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Edit3, Save, Check } from "lucide-react";
import { getToken, getUserId } from "../utils/auth";
import "../styles/Journaling.css";
import Sidebar from "../components/Sidebar";
// import Notifications from '../components/Notifications';
import Account from "../components/Account";
import useSidebarToggle from "../hooks/useSidebarToggle";
import { getJournalEntries } from "../data/api/api";

const JournalCalendar = () => {
  // Hook untuk mengelola state sidebar
  const { isSidebarVisible, isMobile, toggleSidebar, setIsSidebarVisible } =
    useSidebarToggle();

  // State dan logika komponen
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [journalEntries, setJournalEntries] = useState({});
  const [modalData, setModalData] = useState({
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [savingType, setSavingType] = useState("");
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const token = getToken();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = formatDate(today);

  const sentimentEmojis = {
    joy: {
      emoji: "😊",
      color: "text-warning",
      bgColor: "#fff3cd",
      borderColor: "#ffecb5",
      label: "Joy",
    },
    sad: {
      emoji: "😢",
      color: "text-primary",
      bgColor: "#cff4fc",
      borderColor: "#b6effb",
      label: "Sad",
    },
    anger: {
      emoji: "😠",
      color: "text-danger",
      bgColor: "#f8d7da",
      borderColor: "#f5c2c7",
      label: "Anger",
    },
    fear: {
      emoji: "😰",
      color: "text-secondary",
      bgColor: "#e2e3e5",
      borderColor: "#d3d3d4",
      label: "Fear",
    },
    neutral: {
      emoji: "😐",
      color: "text-muted",
      bgColor: "#f8f9fa",
      borderColor: "#dee2e6",
      label: "Neutral",
    },
    love: {
      emoji: "❤️",
      color: "text-danger",
      bgColor: "#f8d7da",
      borderColor: "#f5c2c7",
      label: "Love",
    },
  };

  const formatEntries = (data) => {
    return data.reduce((acc, currentEntry) => {
      const date = new Date(currentEntry.created_at);
      const dateKey = formatDate(date);

      const transformedEntry = {
        id: currentEntry.id,
        content: currentEntry.content,
        status: "final",
        submitted: true,
        results: currentEntry.sentiment,
        created_at: date.toISOString(),
      };

      acc[dateKey] = transformedEntry;

      return acc;
    }, {});
  };

  // Mengambil data dari localStorage saat komponen pertama kali dimuat
const fetchJournalEntries = async () => {
  try {
    setLoading(true);

    // Langkah 1: Ambil data dari server (entri yang sudah final)
    const serverEntriesArray = (await getJournalEntries(token)) || [];
    const serverEntries = formatEntries(serverEntriesArray);

    // Langkah 2: Ambil data dari localStorage (termasuk draf yang belum disubmit)
    const localEntriesText = localStorage.getItem("journalEntries");
    const localEntries = localEntriesText ? JSON.parse(localEntriesText) : {};

    // Langkah 3: Gabungkan keduanya.
    // Objek dari `localEntries` akan menimpa objek dari `serverEntries` jika key (tanggal) nya sama.
    // Ini memastikan draf Anda yang paling update yang akan ditampilkan.
    const combinedEntries = { ...serverEntries, ...localEntries };

    console.log("Combined Entries on Load:", combinedEntries);
    setJournalEntries(combinedEntries);
    
    // Simpan juga data gabungan ke localStorage agar sinkron
    localStorage.setItem("journalEntries", JSON.stringify(combinedEntries));

  } catch (error) {
    console.error("Error fetching journal entries:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstSunday = new Date(firstDay);
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());
    const days = [];
    const current = new Date(firstSunday);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const isToday = (date) => formatDate(date) === todayString;
  const isCurrentMonth = (date) => date.getMonth() === currentMonth.getMonth();

  const getEntryStatus = (date) => {
    const dateKey = formatDate(date);
    const entry = journalEntries[dateKey];
    return {
      hasEntry: !!entry,
      isSubmitted: entry?.submitted || false,
      isFinal: entry?.status === "final",
      isDraft: entry?.status === "draft",
      sentiment: entry?.status === "final" ? entry?.sentiment : null,
    };
  };

  // Fungsi untuk mendapatkan semua sentimen dengan persentase
  const getAllSentiments = (sentimentData) => {
    if (!Array.isArray(sentimentData) || sentimentData.length === 0) {
      return [];
    }

    const totalSentiments = sentimentData.length;
    const sentimentCounts = {};

    for (const sentiment of sentimentData) {
      sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
    }

    const processedData = Object.entries(sentimentCounts)
      .map(([sentiment, count]) => {
        const score = count / totalSentiments;
        return [sentiment, score];
      })
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    return processedData;
  };

  const handleDateClick = (date) => {
    const dateKey = formatDate(date);
    const entry = journalEntries[dateKey];
    const status = getEntryStatus(date);
    const isPast = date < today;

    if (
      isCurrentMonth(date) &&
      (isToday(date) || (isPast && status.hasEntry))
    ) {
      setSelectedDate(date);
      setModalData({
        content: entry?.content || "",
      });
      setShowModal(true);
    }
  };

  const handleInputChange = (value) => {
    setModalData((prev) => ({ ...prev, content: value }));
  };

  const handleSave = async (type) => {
    if (!selectedDate || !modalData.content.trim()) return;

    try {
      setLoading(true);
      setSavingType(type);
      const dateKey = formatDate(selectedDate);
      const userId = getUserId(); // Ganti dengan ID pengguna dinamis jika perlu

      let sentimentResult = null;
      let analysisResults = null;

      if (type === "final") {
        const sentimentResponse = await fetch(
          "https://nabilaalt-api-journaling.hf.space/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Header otorisasi ditambahkan di sini
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: userId,
              content: modalData.content,
            }),
          }
        );

        if (sentimentResponse.ok) {
          const apiData = await sentimentResponse.json();
          sentimentResult = apiData.sentiment;
          analysisResults = apiData.results;
        } else {
          // Melemparkan error dengan status response untuk logging yang lebih baik
          throw new Error(
            `API request failed with status ${sentimentResponse.status}`
          );
        }
      }

      const updatedEntry = {
        id: journalEntries[dateKey]?.id || Date.now(),
        content: modalData.content,
        status: type,
        submitted: type === "final",
        sentiment: sentimentResult,
        results: analysisResults,
        created_at:
          journalEntries[dateKey]?.created_at || new Date().toISOString(),
      };

      // Update state dan simpan ke localStorage
      setJournalEntries((prevEntries) => {
        const newEntries = {
          ...prevEntries,
          [dateKey]: updatedEntry,
        };
        // Simpan state baru ke localStorage
        localStorage.setItem("journalEntries", JSON.stringify(newEntries));
        return newEntries; // Return state baru untuk React
      });
    } catch (error) {
      console.error("An error occurred in handleSave:", error);
      alert(
        `Failed to save the journal entry. Please check the console (F12) for more details. Error: ${error.message}`
      );
    } finally {
      setLoading(false);
      setSavingType("");
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isViewingPastEntry =
    selectedDate && formatDate(selectedDate) < todayString;
  const isFinalizedEntry =
    selectedDate &&
    journalEntries[formatDate(selectedDate)]?.status === "final";
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {isSidebarVisible && (
        <div className="sidebar-wrapper">
          <Sidebar
            isOverlay={isMobile}
            isVisible={isSidebarVisible}
            onClose={() => setIsSidebarVisible(false)}
          />
        </div>
      )}
      {isSidebarVisible && isMobile && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}
      
      {/* Main Content */}
      <div
        className={`flex-grow-1 p-2 p-md-4 content-area ${
          isSidebarVisible && !isMobile ? "content-shifted" : ""
        }`}
      >
        <div className="toggle-button-container">
          <button
            className="btn btn-outline-primary mb-2 align-self-start mobile"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="d-flex align-items-center gap-3">
            {/* <Notifications /> */}
            <Account />
          </div>
        </div>
        {/* Responsive header */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <h2 className="fw-bold text-primary text-center mt-5">
            Journaling Calendar
          </h2>
        </div>
        <div className="bg-light min-vh-100 py-2 py-md-4">
          <div className="container-fluid px-1 px-md-3">
            <div className="mb-3 mb-md-4">
              <h1 className="display-6 fw-bold text-dark text-center text-md-start">
                Journaling
              </h1>
              <p> Write your daily thoughts and feelings freely. This journaling space is designed to help you reflect, express yourself, and track your emotional journey. You can save drafts or mark an entry as done to lock it. Each day brings a new page. </p>
            </div>
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex flex-column flex-md-row justify-content-between align-items-center py-2 py-md-3">
                <h2 className="h5 h4 mb-2 mb-md-0">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h2>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="card-body p-2 p-md-4">
                {/* Judul hari: selalu 7 kolom */}
                {/* <div className="calendar-grid-header mb-2 mb-md-4">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-muted fw-medium py-2 small calendar-header-cell"
                      style={{ background: "#f8fafc" }}
                    >
                      {day}
                    </div>
                  ))}
                </div> */}
                {/* Grid tanggal: responsif */}
                <div className="calendar-scroll-wrapper">
                  <div className="calendar-grid-responsive mt-1 mt-md-3">
                    {/* Render header hari */}
                    {dayNames.map((day) => (
                      <div
                        key={day}
                        className="text-center text-muted fw-medium py-2 small calendar-header-cell"
                        style={{ background: "#f8fafc" }}
                      >
                        {day}
                      </div>
                    ))}
                    {/* Render tanggal */}
                    {calendarDays.map((day, index) => {
                      const dayForRender = new Date(day);
                      dayForRender.setHours(0, 0, 0, 0);

                      const isTodayDay = isToday(dayForRender);
                      const isCurrentMonthDate = isCurrentMonth(dayForRender);
                      const status = getEntryStatus(dayForRender);
                      const isPast = dayForRender < today;
                      const isFuture = dayForRender > today;

                      const canClick =
                        isCurrentMonthDate &&
                        !isFuture &&
                        (isTodayDay || status.hasEntry);
                      const allSentiments = getAllSentiments(
                        journalEntries[formatDate(dayForRender)]?.results
                      );

                      return (
                        <div key={index}>
                          <div
                            className={`border rounded p-3 position-relative h-100 ${
                              isCurrentMonthDate ? "bg-white" : "bg-light"
                            } ${
                              isTodayDay
                                ? "border-primary border-2"
                                : "border-light"
                            } ${
                              canClick
                                ? "cursor-pointer hover-shadow"
                                : "cursor-not-allowed"
                            } ${
                              status.hasEntry && isCurrentMonthDate
                                ? "border-success border-2"
                                : ""
                            } ${
                              !isCurrentMonthDate || isFuture ? "opacity-50" : ""
                            }`}
                            style={{
                              minHeight: "220px",
                              cursor: canClick ? "pointer" : "not-allowed",
                              transition: "all 0.2s ease",
                            }}
                            onClick={() =>
                              canClick && handleDateClick(dayForRender)
                            }
                          >
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <span
                                className={`h4 fw-bold ${
                                  isTodayDay
                                    ? "text-primary"
                                    : isCurrentMonthDate
                                    ? "text-dark"
                                    : "text-muted"
                                }`}
                              >
                                {dayForRender.getDate()}
                              </span>
                              {isPast && isCurrentMonthDate && (
                                <div className="d-flex align-items-center gap-1">
                                  {status.isFinal ? (
                                    <CheckCircle
                                      size={20}
                                      className="text-success"
                                    />
                                  ) : status.isDraft ? (
                                    <Edit3 size={20} className="text-warning" />
                                  ) : null}
                                </div>
                              )}
                              {isTodayDay && !status.hasEntry && (
                                <XCircle size={20} className="text-danger" />
                              )}
                            </div>
                            {isCurrentMonthDate && !isFuture && (
                              <div className="d-flex flex-column h-75">
                                <div className="mb-3">
                                  {status.isFinal ? (
                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                      Completed
                                    </span>
                                  ) : status.isDraft ? (
                                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">
                                      Draft
                                    </span>
                                  ) : isToday(dayForRender) ? (
                                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                                      Not Started
                                    </span>
                                  ) : !status.hasEntry ? (
                                    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1">
                                      Missed
                                    </span>
                                  ) : null}
                                </div>
                                {allSentiments.length > 0 && status.isFinal && (
                                  <div className="mt-auto">
                                    <div className="small text-muted mb-2 fw-medium">
                                      Sentiments:
                                    </div>
                                    <div
                                      className="d-flex flex-column gap-1"
                                      style={{
                                        maxHeight: "120px",
                                        overflowY: "auto",
                                      }}
                                    >
                                      {allSentiments.map(([sentiment, score]) => {
                                        const sentimentData =
                                          sentimentEmojis[
                                            sentiment.toLowerCase()
                                          ];
                                        if (!sentimentData) return null;
                                        const percentage = Math.round(
                                          score * 100
                                        );
                                        return (
                                          <div
                                            key={sentiment}
                                            className="d-flex align-items-center justify-content-between rounded px-2 py-1"
                                            style={{
                                              backgroundColor:
                                                sentimentData.bgColor,
                                              border: `1px solid ${sentimentData.borderColor}`,
                                              minHeight: "26px",
                                            }}
                                          >
                                            <div
                                              className="d-flex align-items-center"
                                              style={{ gap: "4px" }}
                                            >
                                              <span
                                                style={{
                                                  fontSize: "12px",
                                                  lineHeight: "1",
                                                }}
                                              >
                                                {sentimentData.emoji}
                                              </span>
                                              <span
                                                className={`${sentimentData.color} fw-medium`}
                                                style={{
                                                  fontSize: "11px",
                                                  lineHeight: "1",
                                                }}
                                              >
                                                {sentimentData.label}
                                              </span>
                                            </div>
                                            <span
                                              className="fw-bold"
                                              style={{
                                                fontSize: "11px",
                                                lineHeight: "1",
                                                color: "#495057",
                                              }}
                                            >
                                              {percentage}%
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {showModal && (
              <div
                className="modal fade show d-block"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <div>
                        <h5 className="modal-title">Journal Entry</h5>
                        <small className="text-muted">
                          {selectedDate?.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                        disabled={loading}
                        aria-label="Close"
                      ></button>
                    </div>

                    <div className="modal-body">
                      {isFinalizedEntry &&
                        journalEntries[formatDate(selectedDate)]?.results && (
                          <div className="mb-4 p-3 bg-light rounded">
                            <h6 className="fw-bold mb-3">
                              Sentiment Analysis Results:
                            </h6>
                            <div
                              className="d-flex flex-wrap gap-3"
                              style={{ justifyContent: "flex-start" }}
                            >
                          
                              {getAllSentiments(
                                journalEntries[formatDate(selectedDate)]
                                  ?.results
                              ).map(([sentiment, score]) => {
                                const sentimentData =
                                  sentimentEmojis[sentiment.toLowerCase()];
                                if (!sentimentData) return null;
                                const percentage = Math.round(score * 100);
                                return (
                                  <div
                                    key={sentiment}
                                    className="d-flex align-items-start p-3 rounded"
                                    style={{
                                      flex: "1 1 200px",
                                      minWidth: "200px",
                                      maxWidth: "250px",
                                      backgroundColor: sentimentData.bgColor,
                                      border: `2px solid ${sentimentData.borderColor}`,
                                    }}
                                  >
                                    <div className="me-3">
                                      <span
                                        style={{
                                          fontSize: "24px",
                                          display: "block",
                                          lineHeight: "1",
                                        }}
                                      >
                                        {sentimentData.emoji}
                                      </span>
                                    </div>
                                    <div className="flex-grow-1">
                                      <div
                                        className={`fw-bold mb-2 ${sentimentData.color}`}
                                        style={{ fontSize: "14px" }}
                                      >
                                        {sentimentData.label}
                                      </div>
                                      <div
                                        className="progress mb-2"
                                        style={{ height: "8px" }}
                                      >
                                        <div
                                          className="progress-bar"
                                          style={{
                                            width: `${percentage}%`,
                                            backgroundColor:
                                              sentimentData.color.includes(
                                                "danger"
                                              )
                                                ? "#dc3545"
                                                : sentimentData.color.includes(
                                                    "warning"
                                                  )
                                                ? "#ffc107"
                                                : sentimentData.color.includes(
                                                    "success"
                                                  )
                                                ? "#198754"
                                                : sentimentData.color.includes(
                                                    "primary"
                                                  )
                                                ? "#0d6efd"
                                                : sentimentData.color.includes(
                                                    "info"
                                                  )
                                                ? "#0dcaf0"
                                                : "#6c757d",
                                          }}
                                        ></div>
                                      </div>
                                      <div
                                        className="fw-bold text-dark"
                                        style={{ fontSize: "16px" }}
                                      >
                                        {percentage}%
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      <div className="mb-3">
                        <label
                          htmlFor="journalContent"
                          className="form-label fw-medium"
                        ></label>
                        <textarea
                          id="journalContent"
                          className="form-control"
                          rows="8"
                          value={modalData.content}
                          onChange={(e) => handleInputChange(e.target.value)}
                          placeholder="How was your day? Share your thoughts..."
                          disabled={
                            loading || isFinalizedEntry || isViewingPastEntry
                          }
                          style={{ resize: "none" }}
                        />
                        <div className="form-text">
                          {isFinalizedEntry
                            ? "This entry is finalized and cannot be edited."
                            : isViewingPastEntry
                            ? "This past entry cannot be edited."
                            : "You can save as draft to continue later, or mark as done to finalize and get sentiment analysis."}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer bg-light">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      {!isFinalizedEntry && !isViewingPastEntry && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => handleSave("draft")}
                            disabled={loading || !modalData.content.trim()}
                          >
                            {loading && savingType === "draft" ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                ></span>
                                Saving Draft...
                              </>
                            ) : (
                              <>
                                <Save size={16} className="me-2" />
                                Save Draft
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => handleSave("final")}
                            disabled={loading || !modalData.content.trim()}
                          >
                            {loading && savingType === "final" ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                ></span>
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Check size={16} className="me-2" />
                                Done & Analyze
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="card mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="text-muted small text-center">Status</h6>
                    <div className="d-flex flex-wrap gap-3 mb-3 justify-content-center">
                      <div className="d-flex align-items-center gap-2">
                        <CheckCircle size={16} className="text-success" />
                        <small>Completed</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Edit3 size={16} className="text-warning" />
                        <small>Draft</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <XCircle size={16} className="text-danger" />
                        <small>Not Started</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h6 className="text-muted small text-center">
                      Sentiment Analysis
                    </h6>
                    <div className="d-flex flex-wrap gap-4 justify-content-center">
                      {Object.entries(sentimentEmojis).map(([key, data]) => (
                        <div
                          key={key}
                          className="d-flex align-items-center gap-1"
                        >
                          <span>{data.emoji}</span>
                          <small className={data.color}>{data.label}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-muted small mt-4">
              © 2025 Tenangin Apps
            </div>
          </div>
          <style jsx="true">{`
            .hover-shadow:hover {
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
              transform: translateY(-2px);
            }
            .cursor-pointer {
              cursor: pointer;
            }
            .cursor-not-allowed {
              cursor: not-allowed;
            }
            /* Responsive grid for calendar */
            .calendar-grid-header {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 8px;
            }
            .calendar-grid-responsive {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 8px;
            }
            @media (max-width: 767.98px) {
              /* Removed grid-template-columns change to keep 7 columns */
              .card,
              .modal-content {
                border-radius: 10px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
              }
              .card-body,
              .card-header {
                padding: 1rem !important;
              }
            }
            @media (max-width: 400px) {
              /* Removed grid-template-columns change to keep 7 columns */
            }
            /* Modal responsive */
            @media (max-width: 576px) {
              .modal-dialog {
                max-width: 98vw !important;
                margin: 0.5rem auto !important;
              }
              .modal-content {
                padding: 0.5rem !important;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default JournalCalendar;
