const BASE_URL = "https://tenangin-backend.vercel.app";

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

// Authentication
export async function registerUser(username, email, password, confirmPassword) {
  
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
  });
  return response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

// Google OAuth URL (for redirect)
export const googleOAuthUrl = `${BASE_URL}/auth/login/google`;

// Profile
export async function getProfile(token, id) {
  const response = await fetch(`${BASE_URL}/api/profile/${id}`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createProfile(token, profileData) {
  const response = await fetch(`${BASE_URL}/api/profile/add`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(profileData),
  });
  return response.json();
}

export async function updateProfile(token, id, profileData) {
  const response = await fetch(`${BASE_URL}/api/profile/edit/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(profileData),
  });
  return response.json();
}

// Assessment History
export async function getAssessments(token) {
  const response = await fetch(`${BASE_URL}/api/assessment`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createAssessment(token, assessmentData) {
  const response = await fetch(`${BASE_URL}/api/assessment`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(assessmentData),
  });
  return response.json();
}

// Journal Entries
export async function getJournalEntries(token) {
  const response = await fetch(`${BASE_URL}/api/journal`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createJournalEntry(token, journalData) {
  const response = await fetch(`${BASE_URL}/api/journal/add`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(journalData),
  });
  return response.json();
}

// Clinics (no authentication required)
export async function getClinics() {
  const response = await fetch(`${BASE_URL}/api/clinics`);
  return response.json();
}

// Chatbot Sessions
export async function createChatbotSession(token, sessionData) {
  const response = await fetch(`${BASE_URL}/api/chatbot/sessions`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(sessionData),
  });
  return response.json();
}

export async function getChatbotSessions(token) {
  const response = await fetch(`${BASE_URL}/api/chatbot/sessions`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function getChatbotSessionMessages(token, sessionId) {
  const response = await fetch(`${BASE_URL}/api/chatbot/sessions/${sessionId}/messages`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function addChatbotMessage(token, sessionId, messageData) {
  const response = await fetch(`${BASE_URL}/api/chatbot/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(messageData),
  });
  return response.json();
}

// Reminders
export async function getReminders(token) {
  const response = await fetch(`${BASE_URL}/api/reminders`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createReminder(token, reminderData) {
  const response = await fetch(`${BASE_URL}/api/reminders/add`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(reminderData),
  });
  return response.json();
}
