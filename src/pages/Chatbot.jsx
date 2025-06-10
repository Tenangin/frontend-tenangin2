import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
// import Notifications from "../components/Notifications";
import Account from "../components/Account";
import useSidebarToggle from '../hooks/useSidebarToggle';
import SessionsSidebar from "../components/Chatbot/SessionsSidebar";
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
  // --- PERUBAHAN 1.1: Ubah state awal. Logika akan diatur di useEffect ---
  const { isSidebarVisible, isMobile, toggleSidebar, setIsSidebarVisible } = useSidebarToggle();
  const [isSessionsSidebarVisible, setIsSessionsSidebarVisible] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [started, setStarted] = useState(false);
  
  const token = getToken();
  const queryClient = useQueryClient();

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

  // --- PERUBAHAN 1.2: Logika untuk menampilkan modal atau memulai chat ---
  useEffect(() => {
    // Hanya jalankan logika ini setelah sesi selesai dimuat dan data sudah ada
    if (!isLoadingSessions && sessions) {
      if (sessions.length === 0) {
        // Tidak ada sesi sama sekali, ini adalah "fresh welcome"
        setShowWelcomeModal(true);
        setStarted(false); // Pastikan chat belum "dimulai"
      } else {
        // Ada sesi, jangan tampilkan modal dan langsung mulai
        setShowWelcomeModal(false);
        setStarted(true);
      }
    }
  }, [sessions, isLoadingSessions]);


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

  const sendMessageMutation = useMutation({
    mutationFn: (messagePayload) => createChatbotMessage(token, messagePayload),
    onMutate: async (newMessagePayload) => {
      await queryClient.cancelQueries([
        "chatMessages",
        currentSessionId,
        token,
      ]);
      const previousMessages = queryClient.getQueryData([
        "chatMessages",
        currentSessionId,
        token,
      ]);
      const optimisticUserMessage = {
        id: `temp-user-${Date.now()}`,
        message: newMessagePayload.message,
        sender: "human",
        timestamp: new Date().toISOString(),
      };
      const optimisticLoadingMessage = {
        id: `temp-loading-${Date.now()}`,
        message: "...",
        sender: "ai",
        timestamp: new Date().toISOString(),
        isLoading: true,
      };
      queryClient.setQueryData(
        ["chatMessages", currentSessionId, token],
        (oldQueryData) => [
          ...(oldQueryData || []),
          optimisticUserMessage,
          optimisticLoadingMessage,
        ]
      );
      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      console.error("Gagal mengirim pesan (Optimistic):", err);
      alert(`Gagal mengirim pesan: ${err.message}`);
      if (context.previousMessages) {
        queryClient.setQueryData(
          ["chatMessages", currentSessionId, token],
          context.previousMessages
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["chatMessages", currentSessionId, token]);
      queryClient.invalidateQueries(["chatSessions", token]); // Penting untuk update summary sesi
    },
  });

  // --- Derived State ---
  const currentSessionDetails = sessions?.find(
    (s) => s.id === currentSessionId
  );
  const displayMessages = currentMessages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [displayMessages]);

  // --- Event Handlers ---
  
  // --- PERUBAHAN 1.3: Sederhanakan handleGetStarted ---
  const handleGetStarted = () => {
    setShowWelcomeModal(false);
    setStarted(true);
    // Karena fungsi ini hanya dipanggil saat tidak ada sesi,
    // kita bisa langsung membuat sesi baru.
    createSessionMutation.mutate({ summary: "", mood_detected: "" });
  };

  const handleCancelWelcome = () => navigate("/dashboard");

  const createNewSession = () => {
    createSessionMutation.mutate({ summary: "", mood_detected: "" });
  };

  const switchSession = (sessionId) => setCurrentSessionId(sessionId);

  const deleteSession = (sessionIdToDelete) => {
    if (sessions?.length <= 1) {
      alert("Tidak bisa menghapus sesi terakhir.");
      return;
    }
    if (window.confirm(`Anda yakin ingin menghapus sesi ini?`)) {
      deleteSessionMutation.mutate(sessionIdToDelete);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || !currentSessionId || sendMessageMutation.isLoading)
      return;

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
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="visually-hidden">Loading sessions...</span>
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
      {isSidebarVisible && (
        <><Sidebar isOverlay={isMobile} isVisible={isSidebarVisible} onClose={() => setIsSidebarVisible(false)} />
        <SessionsSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          switchSession={switchSession}
          deleteSession={deleteSession}
          createNewSession={createNewSession}
          createSessionMutation={createSessionMutation}
          deleteSessionMutation={deleteSessionMutation}

          isOverlay={isMobile}
          isVisible={isSessionsSidebarVisible}
          onClose={() => setIsSessionsSidebarVisible(false)}
        /></>
      )}

      {/* Sessions Sidebar */}
     

       {isSidebarVisible && isMobile && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarVisible(false)} />
      )}

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0, width: '60%' }}>
        <div className="bg-white p-4 border-bottom">
          <div className="d-flex flex-column chatbot-header">
            <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-2">
              <button
                className="btn btn-outline-primary ms-0 drawer-button align-self-start"
                onClick={toggleSidebar}
                aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
              >
                <i className="bi bi-list"></i>
              </button>
              <div className="d-flex align-items-center gap-3 notifications-account">
                {/* <Notifications />  */}
                <Account />
              </div>
            </div>
            <div style={{ justifyContent: "flex-start"}}>
              <h4 className="fw-bold text-primary mb-1">
                Tenobot - Tenangin Chatbot
              </h4>
              <small className="text-muted">
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

        {/* Cek `started` dan `currentSessionId` untuk render area chat */}
        {started && currentSessionId && (
          <div
            className="flex-grow-1 bg-white rounded-lg shadow-sm border d-flex flex-column m-4"
            style={{ minHeight: 0 }}
          >
            <div className="p-3 border-bottom bg-light rounded-top">
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
                              msg.sender === "human" ? "#007bff" : "#28a745",
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
                                msg.sender === "human"
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
                          ></small>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            <div className="p-3 border-top bg-white">
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

        {/* UI jika tidak ada sesi aktif (setelah menghapus sesi terakhir) */}
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
      </div>
    </div>
  );
};

export default Chatbot;