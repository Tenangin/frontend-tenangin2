import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications';
import Account from '../components/Account';
// Sesuaikan path jika diperlukan
import { 
    getChatbotSessions, 
    deleteChatbotSession, 
    createChatbotSession, 
    getChatbotSessionMessages, 
    createChatbotMessage 
} from '../data/api/api';
import { getToken } from '../utils/auth';

const Chatbot = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [started, setStarted] = useState(false);
  const token = getToken();
  const queryClient = useQueryClient(); // Untuk invalidasi cache

  // --- State Lokal Utama ---
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [input, setInput] = useState('');
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // --- DATA FETCHING (SESSIONS) ---
  const {
    data: sessions, // Langsung gunakan 'sessions' sebagai data dari API
    isLoading: isLoadingSessions,
    isError: isErrorSessions,
    error: sessionsError,
  } = useQuery({
    queryKey: ['chatSessions', token], // Tambahkan token ke queryKey jika data bergantung padanya
    queryFn: () => getChatbotSessions(token),
    staleTime: 1000 * 60 * 5, // Data dianggap fresh selama 5 menit
    refetchOnWindowFocus: true,
  });

  // --- DATA FETCHING (MESSAGES FOR CURRENT SESSION) ---
  const {
    data: currentMessages,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages, // Berguna untuk indikator loading pesan saat ganti sesi
    isError: isErrorMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ['chatMessages', currentSessionId, token], // Bergantung pada currentSessionId dan token
    queryFn: () => getChatbotSessionMessages(token, currentSessionId),
    enabled: !!currentSessionId && !!token, // Hanya fetch jika ada currentSessionId dan token
    staleTime: 1000 * 60 * 1, // Pesan mungkin lebih sering berubah
  });
  
  // Efek untuk mengatur currentSessionId saat sesi pertama kali dimuat atau berubah
  useEffect(() => {
    if (sessions && sessions.length > 0) {
      if (!currentSessionId || !sessions.find(s => s.id === currentSessionId)) {
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
      queryClient.invalidateQueries(['chatSessions', token]); // Invalidate cache sesi
      // Opsional: langsung update cache untuk UX yang lebih cepat tanpa menunggu refetch
      // queryClient.setQueryData(['chatSessions', token], (oldData) => [...(oldData || []), newlyCreatedSession]);
      setCurrentSessionId(newlyCreatedSession.id); // Langsung pindah ke sesi baru
    },
    onError: (error) => {
      console.error("Gagal membuat sesi baru:", error);
      alert(`Gagal membuat sesi: ${error.message}`);
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (sessionIdToDelete) => deleteChatbotSession(token, sessionIdToDelete),
    onSuccess: (data, sessionIdToDelete) => {
      queryClient.invalidateQueries(['chatSessions', token]); // Invalidate cache sesi
      // Jika sesi yang aktif dihapus, query messages juga perlu di-handle
      if (currentSessionId === sessionIdToDelete) {
        // currentSessionId akan diupdate oleh useEffect di atas saat 'sessions' berubah
        // atau Anda bisa set query messages menjadi data kosong/null
         queryClient.removeQueries(['chatMessages', sessionIdToDelete, token]);
      }
      // Logic untuk set currentSessionId ke sesi lain sudah ditangani oleh useEffect yang memantau 'sessions'
    },
    onError: (error) => {
      console.error("Gagal menghapus sesi:", error);
      alert(`Gagal menghapus sesi: ${error.message}`);
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: (messagePayload) => createChatbotMessage(token, currentSessionId, messagePayload),
    onSuccess: () => {
      queryClient.invalidateQueries(['chatMessages', currentSessionId, token]); // Invalidate cache pesan untuk sesi aktif
      // TODO: Idealnya, AI bot response akan dipicu di sini atau dari backend setelah pesan user disimpan.
      // Untuk sekarang, respons bot lokal dihapus karena kita fokus pada penyimpanan pesan user.
      // Jika ingin respons bot dari API, perlu flow tambahan.
      queryClient.invalidateQueries(['chatSessions', token]); // Invalidate sesi juga jika ada message_count
    },
    onError: (error) => {
      console.error("Gagal mengirim pesan:", error);
      alert(`Gagal mengirim pesan: ${error.message}`);
    }
  });

  // --- Derived State ---
  const currentSessionDetails = sessions?.find(s => s.id === currentSessionId);
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
      // Jika tidak ada sesi dari API setelah loading, otomatis buat sesi baru.
      // Beri nama default atau biarkan user yang memberi nama nanti.
      createSessionMutation.mutate({summary : "", mood_detected : ""});
    } else if (sessions && sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  };

  const handleCancelWelcome = () => navigate('/dashboard');

  const createNewSession = () => { // Dipanggil dari modal
    createSessionMutation.mutate({ summary : '', mood_detected : ''});
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
    if (!trimmedInput || !currentSessionId || sendMessageMutation.isLoading) return;

    const userMessagePayload = {
      sender: 'user',
      text: trimmedInput,
    };
    sendMessageMutation.mutate(userMessagePayload);
    setInput('');
    
    // Logika rename sesi jika ini pesan pertama, perlu mutasi terpisah jika nama disimpan di DB
    // if (currentSessionDetails && displayMessages.length === 0 && (currentSessionDetails.name?.startsWith('Chat ') || currentSessionDetails.summary?.startsWith('Chat '))) {
    //   const firstWords = trimmedInput.split(' ').slice(0, 3).join(' ');
    //   // TODO: Buat mutation untuk update nama/summary sesi di database
    //   console.log("Perlu update nama sesi di DB menjadi:", firstWords);
    // }
  };

  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // --- Render Logic ---
  if (isLoadingSessions) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><p>Loading sessions...</p></div>;
  }
  if (isErrorSessions) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><p>Error loading sessions: {sessionsError?.message}</p></div>;
  }

  return (
    <div className="d-flex" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      
      {/* Sessions Sidebar */}
      <div className="bg-white border-end" style={{ width: '280px', /* Lebar disesuaikan */ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div className="p-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-2"> {/* Margin disesuaikan */}
            <h6 className="text-primary fw-bold mb-0">Chat Sessions</h6>
            <button className="btn btn-primary btn-sm py-1 px-2" /* Padding disesuaikan */ onClick={() => createNewSession()} title="New Session" disabled={createSessionMutation.isLoading}>
              {createSessionMutation.isLoading ? '...' : <i className="fas fa-plus"></i>}
            </button>
          </div>
        </div>
        <div className="p-2 flex-grow-1" style={{ overflowY: 'auto' }}>
          {sessions && sessions.length > 0 ? sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 mb-2 rounded cursor-pointer border ${currentSessionId === session.id ? 'bg-primary text-white border-primary' : 'bg-light border-light hover-bg-light'}`}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => switchSession(session.id)}
            >
              <div className="d-flex justify-content-between align-items-center"> {/* align-items-center untuk vertical align */}
                <div className="flex-grow-1" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  {/* Gunakan session.name jika ada, atau session_date/summary */}
                  <h6 className="mb-1 fw-semibold" style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.name || session.summary || new Date(session.session_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short'})}
                  </h6>
                  <small className={currentSessionId === session.id ? 'text-white-50' : 'text-muted'}>
                     {session.message_count !== undefined ? `${session.message_count} pesan` : (isFetchingMessages && currentSessionId === session.id ? 'Memuat...' : `${displayMessages.length} pesan`)}
                  </small>
                </div>
                <button
                  className={`btn btn-sm ms-2 p-1 ${currentSessionId === session.id ? 'btn-outline-light' : 'btn-outline-danger'}`}
                  onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                  title="Delete Session"
                  disabled={deleteSessionMutation.isLoading && deleteSessionMutation.variables === session.id}
                >
                  {(deleteSessionMutation.isLoading && deleteSessionMutation.variables === session.id) ? '...' : <i className="fas fa-trash" style={{ fontSize: '0.8rem' }}></i>}
                </button>
              </div>
            </div>
          )) : (
            <p className="text-muted text-center p-3">Belum ada sesi.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column">
        <div className="bg-white p-4 border-bottom"> {/* Header Aplikasi */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold text-primary mb-1">Tenobot - Tenangin Chatbot</h4>
              <small className="text-muted">
                Session: {currentSessionDetails?.name || currentSessionDetails?.summary || (currentSessionDetails ? new Date(currentSessionDetails.session_date).toLocaleDateString('id-ID') : 'Tidak ada sesi aktif')} 
                {' • '}
                {isLoadingMessages && currentSessionId ? 'Memuat pesan...' : `${displayMessages.length} pesan`}
              </small>
            </div>
            <div className="d-flex align-items-center gap-3"> <Notifications /> <Account /> </div>
          </div>
        </div>

        {/* Welcome Modal */}
        {showWelcomeModal && ( /* ... (kode modal selamat datang tidak berubah signifikan, pastikan onClick benar) ... */ 
            <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-0 bg-primary text-white"><h5 className="modal-title fw-bold"><i className="fas fa-robot me-2"></i> Selamat Datang di Teno Bot</h5></div>
                <div className="modal-body text-center py-4">
                    <div className="mb-4"><i className="fas fa-comments text-primary" style={{ fontSize: '3rem' }}></i></div>
                    <h6 className="fw-semibold mb-3">Mulai percakapan dengan AI Assistant</h6>
                    <p className="text-muted mb-0">Teno Bot siap membantu Anda dengan berbagai pertanyaan dan diskusi. Setiap percakapan akan tersimpan dalam session terpisah.</p>
                </div>
                <div className="modal-footer border-0 justify-content-center">
                    <button type="button" className="btn btn-primary px-4" onClick={handleGetStarted}><i className="fas fa-play me-2"></i> Mulai Chat</button>
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={handleCancelWelcome}><i className="fas fa-arrow-left me-2"></i> Kembali</button>
                </div>
                </div>
            </div>
            </div>
        )}



        {/* Chat Display Area */}
        {started && currentSessionId && (
          <div className="flex-grow-1 d-flex flex-column p-4">
            <div className="flex-grow-1 bg-white rounded-lg shadow-sm border d-flex flex-column" style={{ minHeight: 0 }}>
              <div className="p-3 border-bottom bg-light rounded-top"> {/* Chat Header (dalam sesi) */}
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                  <div><h6 className="mb-0 fw-semibold text-primary">Teno Bot</h6><small className="text-muted">Online - Siap membantu Anda</small></div>
                </div>
              </div>
              <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: '#fafafa' }}> {/* Messages */}
                {(isLoadingMessages || (isFetchingMessages && displayMessages.length === 0)) && <p className="text-center text-muted">Memuat pesan...</p>}
                {(!isLoadingMessages && !isFetchingMessages && isErrorMessages) && <p className="text-center text-danger">Gagal memuat pesan: {messagesError?.message}</p>}
                {(!isLoadingMessages && !isFetchingMessages && !isErrorMessages && displayMessages.length === 0) && (
                  <div className="text-center py-5"><i className="fas fa-comment-dots text-muted mb-3" style={{ fontSize: '3rem' }}></i><h6 className="text-muted">Belum ada percakapan</h6><p className="text-muted mb-0">Mulai dengan mengetik pesan di bawah</p></div>
                )}
                {displayMessages.length > 0 && (
                  <>
                    {displayMessages.map((msg) => (
                      <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'human' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`d-flex ${msg.sender === 'human' ? 'flex-row-reverse' : 'flex-row'} align-items-start`} style={{ maxWidth: '70%' }}>
                          <div className={`rounded-circle d-flex align-items-center justify-content-center ${msg.sender === 'human' ? 'ms-2' : 'me-2'}`} style={{ width: '32px', height: '32px', backgroundColor: msg.sender === 'user' ? '#007bff' : '#28a745', flexShrink: 0 }}>
                            <i className={`fas ${msg.sender === 'human' ? 'fa-user' : 'fa-robot'} text-white`} style={{ fontSize: '0.8rem' }}></i>
                          </div>
                          <div>
                            <div className={`p-3 rounded-lg shadow-sm ${msg.sender === 'human' ? 'bg-primary text-white' : 'bg-white border'}`} style={{ borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}>
                              <p className="mb-0" style={{wordBreak: 'break-word'}}>{msg.message /* Ganti dari msg.text */}</p>
                            </div>
                            <small className={`d-block mt-1 ${msg.sender === 'human' ? 'text-end' : 'text-start'} text-muted`}>{formatTime(msg.timestamp)}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              <div className="p-3 border-top bg-white"> {/* Input */}
                <form onSubmit={handleSendMessage}>
                  <div className="input-group">
                    <input type="text" className="form-control border-0 bg-light" placeholder="Ketik pesan Anda..." value={input} onChange={(e) => setInput(e.target.value)} style={{ borderRadius: '25px 0 0 25px', paddingLeft: '20px' }} disabled={!currentSessionId || sendMessageMutation.isLoading || isLoadingMessages} />
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 25px 25px 0', paddingLeft: '20px', paddingRight: '20px' }} disabled={!input.trim() || !currentSessionId || sendMessageMutation.isLoading || isLoadingMessages}>
                      {sendMessageMutation.isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fas fa-paper-plane"></i>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {!currentSessionId && started && !isLoadingSessions && ( /* UI jika tidak ada sesi aktif */
            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4">
                <i className="fas fa-comments text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                <h5 className="text-muted">Tidak ada sesi aktif</h5>
                <p className="text-muted">Buat sesi baru untuk memulai percakapan.</p>
                <button className="btn btn-primary mt-2" onClick={() => createNewSession()} disabled={createSessionMutation.isLoading}><i className="fas fa-plus me-2"></i>Buat Sesi Baru</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;