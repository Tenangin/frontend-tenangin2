import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import Sidebar from "../components/Sidebar";
import Notifications from "../components/Notifications";
import Account from "../components/Account";
// Sesuaikan path jika diperlukan
import {
  getChatbotSessions,
  deleteChatbotSession,
  createChatbotSession,
  getChatbotSessionMessages,
  createChatbotMessage,
} from "../data/api/api";
import { getToken, getUserId } from "../utils/auth";

const Chatbot = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [started, setStarted] = useState(false);
  const token = getToken();
  const queryClient = useQueryClient(); // Untuk invalidasi cache

  // --- State Lokal Utama ---
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userID = getUserId();

  // --- DATA FETCHING (SESSIONS) ---
  const {
    data: sessions,
    isLoading: isLoadingSessions,
    isError: isErrorSessions,
    error: sessionsError,
  } = useQuery({
    queryKey: ["chatSessions", token],
    queryFn: () => getChatbotSessions(token, userID),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  // --- DATA FETCHING (MESSAGES FOR CURRENT SESSION) ---
  const {
    data: currentMessages,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
    isError: isErrorMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["chatMessages", currentSessionId, token],
    queryFn: () => getChatbotSessionMessages(token, currentSessionId),
    enabled: !!currentSessionId && !!token,
    staleTime: 1000 * 60 * 1,
  });

  // Efek untuk mengatur currentSessionId saat sesi pertama kali dimuat atau berubah
  useEffect(() => {
    if (sessions && sessions.length > 0) {
      if (
        !currentSessionId ||
        !sessions.find((s) => s.id === currentSessionId)
      ) {
        setCurrentSessionId(sessions[0].id); // Set ke sesi pertama jika belum ada atau tidak valid
      }
    } else if (!isLoadingSessions && sessions && sessions.length === 0) {
      setCurrentSessionId(null); // Tidak ada sesi dari API
    }
  }, [sessions, isLoadingSessions, currentSessionId]);

  // --- MUTATIONS ---
  const createSessionMutation = useMutation({
    mutationFn: (sessionData) => createChatbotSession(token, sessionData),
    onSuccess: (newlyCreatedSession) => {
      queryClient.invalidateQueries(["chatSessions", token]);
      setCurrentSessionId(newlyCreatedSession.id);
    },
    onError: (error) => {
      console.error("Gagal membuat sesi baru:", error);
      alert(`Gagal membuat sesi: ${error.message}`);
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (sessionIdToDelete) =>
      deleteChatbotSession(token, sessionIdToDelete),
    onSuccess: (data, sessionIdToDelete) => {
      queryClient.invalidateQueries(["chatSessions", token]);
      if (currentSessionId === sessionIdToDelete) {
        queryClient.removeQueries(["chatMessages", sessionIdToDelete, token]);
      }
    },
    onError: (error) => {
      console.error("Gagal menghapus sesi:", error);
      alert(`Gagal menghapus sesi: ${error.message}`);
    },
  });

  // GANTI MUTASI LAMA DENGAN YANG INI
  const sendMessageMutation = useMutation({
    mutationFn: (messagePayload) => createChatbotMessage(token, messagePayload),

    // onMutate berjalan SEBELUM mutationFn. Di sinilah keajaibannya terjadi.
    onMutate: async (newMessagePayload) => {
      // 1. Batalkan semua refetch yang sedang berjalan untuk query pesan
      //    agar tidak menimpa update optimis kita.
      await queryClient.cancelQueries([
        "chatMessages",
        currentSessionId,
        token,
      ]);

      // 2. Simpan data pesan yang ada saat ini (sebelum diubah) untuk rollback jika terjadi error.
      const previousMessages = queryClient.getQueryData([
        "chatMessages",
        currentSessionId,
        token,
      ]);

      // 3. Buat pesan user dan pesan loading bot secara manual.
      const optimisticUserMessage = {
        id: `temp-user-${Date.now()}`, // ID sementara yang unik
        message: newMessagePayload.message,
        sender: "human", // Pastikan ini sesuai dengan apa yang Anda gunakan ('human' atau 'user')
        timestamp: new Date().toISOString(),
      };

      const optimisticLoadingMessage = {
        id: `temp-loading-${Date.now()}`,
        message: "...", // Teks placeholder tidak penting, kita akan render komponen loading
        sender: "ai", // atau 'bot', sesuaikan dengan data Anda
        timestamp: new Date().toISOString(),
        isLoading: true, // Flag khusus untuk menandai ini adalah pesan loading
      };

      // 4. Update cache React Query secara langsung dengan data baru yang optimis.
      //    Ini akan langsung memicu re-render pada UI.
      queryClient.setQueryData(
        ["chatMessages", currentSessionId, token],
        (oldQueryData) => [
          ...(oldQueryData || []),
          optimisticUserMessage,
          optimisticLoadingMessage,
        ]
      );

      // 5. Kembalikan data lama agar bisa diakses di context onError dan onSettled.
      return { previousMessages };
    },

    // onError akan berjalan jika mutationFn gagal.
    onError: (err, newMessage, context) => {
      console.error("Gagal mengirim pesan (Optimistic):", err);
      alert(`Gagal mengirim pesan: ${err.message}`);
      // Kembalikan data ke kondisi sebelum update optimis
      if (context.previousMessages) {
        queryClient.setQueryData(
          ["chatMessages", currentSessionId, token],
          context.previousMessages
        );
      }
    },

    // onSettled berjalan setelah mutasi selesai (baik sukses maupun gagal).
    // Ini untuk memastikan data di client sinkron dengan server.
    onSettled: () => {
      queryClient.invalidateQueries(["chatMessages", currentSessionId, token]);
      queryClient.invalidateQueries(["chatSessions", token]);
    },
  });

  // --- Derived State ---
  const currentSessionDetails = sessions?.find(
    (s) => s.id === currentSessionId
  );
  const displayMessages = currentMessages || []; // Pesan yang akan ditampilkan

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [displayMessages]); // Scroll ketika pesan berubah

  // --- Event Handlers ---
  const handleGetStarted = () => {
    setShowWelcomeModal(false);
    setStarted(true);
    if (!isLoadingSessions && (!sessions || sessions.length === 0)) {
      createSessionMutation.mutate({ summary: "", mood_detected: "" });
    } else if (sessions && sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  };

  const handleCancelWelcome = () => navigate("/dashboard");

  const createNewSession = () => {
    // Dipanggil dari modal
    createSessionMutation.mutate({ summary: "", mood_detected: "" });
  };

  const switchSession = (sessionId) => setCurrentSessionId(sessionId);

  const deleteSession = (sessionIdToDelete) => {
    if (sessions?.length <= 1) {
      alert("Tidak bisa menghapus sesi terakhir.");
      return;
    }
    // Konfirmasi sebelum hapus
    if (window.confirm(`Anda yakin ingin menghapus sesi ini?`)) {
      deleteSessionMutation.mutate(sessionIdToDelete);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || !currentSessionId || sendMessageMutation.isLoading)
      return;

    // Cukup kirim message-nya, sisanya akan diurus di mutasi
    sendMessageMutation.mutate({
      session_id: currentSessionId,
      message: trimmedInput,
      reset: false,
    });
    setInput("");
  };


  // --- Render Logic ---
  if (isLoadingSessions) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Loading sessions...</p>
      </div>
    );
  }
  if (isErrorSessions) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Error loading sessions: {sessionsError?.message}</p>
      </div>
    );
  }

  return (
    <div
      className="d-flex"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Sidebar />

      {/* Sessions Sidebar */}
      <div
        className="bg-white border-end"
        style={{
          width: "280px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="p-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="text-primary fw-bold mb-0">Chat Sessions</h6>
            <button
              className="btn btn-primary btn-sm py-1 px-2"
              onClick={() => createNewSession()}
              title="New Session"
              disabled={createSessionMutation.isLoading}
            >
              {createSessionMutation.isLoading ? (
                "..."
              ) : (
                <i className="fas fa-plus"></i>
              )}
            </button>
          </div>
        </div>
        <div className="p-2 flex-grow-1" style={{ overflowY: "auto" }}>
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 mb-2 rounded cursor-pointer border ${
                  currentSessionId === session.id
                    ? "bg-primary text-white border-primary"
                    : "bg-light border-light hover-bg-light"
                }`}
                style={{ cursor: "pointer", transition: "all 0.2s" }}
                onClick={() => switchSession(session.id)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div
                    className="flex-grow-1"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <h6
                      className="mb-1 fw-semibold"
                      style={{
                        fontSize: "0.9rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(session.session_date).toLocaleDateString(
                        "id-ID",
                        { weekday: "long", day: "numeric", month: "short" }
                      )}
                    </h6>
                    <small
                      className={
                        currentSessionId === session.id
                          ? "text-white-50"
                          : "text-muted"
                      }
                    ></small>
                  </div>
                  <button
                    className={`btn btn-sm ms-2 p-1 ${
                      currentSessionId === session.id
                        ? "btn-outline-light"
                        : "btn-outline-danger"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    title="Delete Session"
                    disabled={
                      deleteSessionMutation.isLoading &&
                      deleteSessionMutation.variables === session.id
                    }
                  >
                    {deleteSessionMutation.isLoading &&
                    deleteSessionMutation.variables === session.id ? (
                      "..."
                    ) : (
                      <i
                        className="fas fa-trash"
                        style={{ fontSize: "0.8rem" }}
                      ></i>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted text-center p-3">Belum ada sesi.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
        <div className="bg-white p-4 border-bottom">
          {" "}
          {/* Header Aplikasi */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold text-primary mb-1">
                Tenobot - Tenangin Chatbot
              </h4>
              <small className="text-muted">
                Session:{" "}
                {currentSessionDetails
                  ? new Date(
                      currentSessionDetails.session_date
                    ).toLocaleDateString("id-ID")
                  : "Tidak ada sesi aktif"}
                {" • "}
                {isLoadingMessages && currentSessionId
                  ? "Memuat pesan..."
                  : `${displayMessages.length} pesan`}
              </small>
            </div>
            <div className="d-flex align-items-center gap-3">
              {" "}
              <Notifications /> <Account />{" "}
            </div>
          </div>
        </div>

        {/* Welcome Modal */}
        {showWelcomeModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-0 bg-primary text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="fas fa-robot me-2"></i> Selamat Datang di Teno
                    Bot
                  </h5>
                </div>
                <div className="modal-body text-center py-4">
                  <div className="mb-4">
                    <i
                      className="fas fa-comments text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h6 className="fw-semibold mb-3">
                    Mulai percakapan dengan AI Assistant
                  </h6>
                  <p className="text-muted mb-0">
                    Teno Bot siap membantu Anda dengan berbagai pertanyaan dan
                    diskusi. Setiap percakapan akan tersimpan dalam session
                    terpisah.
                  </p>
                </div>
                <div className="modal-footer border-0 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleGetStarted}
                  >
                    <i className="fas fa-play me-2"></i> Mulai Chat
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={handleCancelWelcome}
                  >
                    <i className="fas fa-arrow-left me-2"></i> Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {started && currentSessionId && (
          <div
            className="flex-grow-1 bg-white rounded-lg shadow-sm border d-flex flex-column m-4"
            style={{ minHeight: 0 }}
          >
            <div className="p-3 border-bottom bg-light rounded-top">
              {" "}
              {/* Chat Header */}
              <div className="d-flex align-items-center">
                <div
                  className="bg-success rounded-circle me-3"
                  style={{ width: "12px", height: "12px" }}
                ></div>
                <div>
                  <h6 className="mb-0 fw-semibold text-primary">Teno Bot</h6>
                  <small className="text-muted">
                    Online - Siap membantu Anda
                  </small>
                </div>
              </div>
            </div>
            <div
              className="flex-grow-1 p-3 overflow-auto"
              style={{ backgroundColor: "#fafafa" }}
            >
              {" "}
              {/* Area Pesan (Scrolling) */}
              {(isLoadingMessages ||
                (isFetchingMessages && displayMessages.length === 0)) && (
                <p className="text-center text-muted">Memuat pesan...</p>
              )}
              {!isLoadingMessages && !isFetchingMessages && isErrorMessages && (
                <p className="text-center text-danger">
                  Gagal memuat pesan: {messagesError?.message}
                </p>
              )}
              {!isLoadingMessages &&
                !isFetchingMessages &&
                !isErrorMessages &&
                displayMessages.length === 0 && (
                  <div className="text-center py-5">
                    <i
                      className="fas fa-comment-dots text-muted mb-3"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <h6 className="text-muted">Belum ada percakapan</h6>
                    <p className="text-muted mb-0">
                      Mulai dengan mengetik pesan di bawah
                    </p>
                  </div>
                )}
              {displayMessages.length > 0 && (
                <>
                  {displayMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`d-flex mb-3 ${
                        msg.sender === "human"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`d-flex ${
                          msg.sender === "human"
                            ? "flex-row-reverse"
                            : "flex-row"
                        } align-items-start`}
                        style={{ maxWidth: "70%" }}
                      >
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center ${
                            msg.sender === "human" ? "ms-2" : "me-2"
                          }`}
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor:
                              msg.sender === "user" ? "#007bff" : "#28a745",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className={`fas ${
                              msg.sender === "human" ? "fa-user" : "fa-robot"
                            } text-white`}
                            style={{ fontSize: "0.8rem" }}
                          ></i>
                        </div>
                        <div>
                          <div
                            className={`p-3 rounded-lg shadow-sm ${
                              msg.sender === "human"
                                ? "bg-primary text-white"
                                : "bg-white border"
                            }`}
                            style={{
                              borderRadius:
                                msg.sender === "user"
                                  ? "18px 18px 4px 18px"
                                  : "18px 18px 18px 4px",
                            }}
                          >
                            <p
                              className="mb-0"
                              style={{ wordBreak: "break-word" }}
                            >
                              {msg.message}
                            </p>
                          </div>
                          <small
                            className={`d-block mt-1 ${
                              msg.sender === "human" ? "text-end" : "text-start"
                            } text-muted`}
                          >
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            <div className="p-3 border-top bg-white">
              {" "}
              {/* Area Input */}
              <form onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Ketik pesan Anda..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                      borderRadius: "25px 0 0 25px",
                      paddingLeft: "20px",
                    }}
                    disabled={
                      !currentSessionId ||
                      sendMessageMutation.isLoading ||
                      isLoadingMessages
                    }
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      borderRadius: "0 25px 25px 0",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    }}
                    disabled={
                      !input.trim() ||
                      !currentSessionId ||
                      sendMessageMutation.isLoading ||
                      isLoadingMessages
                    }
                  >
                    {sendMessageMutation.isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* UI jika tidak ada sesi aktif */}
        {!currentSessionId && started && !isLoadingSessions && (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4">
            <i
              className="fas fa-comments text-muted mb-3"
              style={{ fontSize: "4rem" }}
            ></i>
            <h5 className="text-muted">Tidak ada sesi aktif</h5>
            <p className="text-muted">
              Buat sesi baru untuk memulai percakapan.
            </p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => createNewSession()}
              disabled={createSessionMutation.isLoading}
            >
              <i className="fas fa-plus me-2"></i>Buat Sesi Baru
            </button>
          </div>
        )}
        {/* =================================================================== */}
      </div>
    </div>
  );
};

export default Chatbot;
