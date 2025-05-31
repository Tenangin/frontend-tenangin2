const BASE_URL = "https://tenangin-backend.vercel.app/api";

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

// Authentication
export async function registerUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
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
export const googleOAuthUrl = `${BASE_URL}/auth/google`;

// Profile
export async function getProfile(token) {
  const response = await fetch(`${BASE_URL}/profile`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createProfile(token, profileData) {
  const response = await fetch(`${BASE_URL}/profile/add`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(profileData),
  });
  return response.json();
}

export async function updateProfile(token, profileData) {
  const response = await fetch(`${BASE_URL}/profile/edit`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(profileData),
  });
  return response.json();
}

// Assessment History
export async function getAssessments(token) {
  const response = await fetch(`${BASE_URL}/assessment`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createAssessment(token, assessmentData) {
  const response = await fetch(`${BASE_URL}/assessment`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(assessmentData),
  });
  return response.json();
}

// Journal Entries
export async function getJournalEntries(token) {
  const response = await fetch(`${BASE_URL}/journal`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createJournalEntry(token, journalData) {
  const response = await fetch(`${BASE_URL}/journal/add`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(journalData),
  });
  return response.json();
}

// Clinics (no authentication required)
export async function getClinics() {
  const response = await fetch(`${BASE_URL}/clinics`);
  return response.json();
}

// Chatbot Sessions
export async function createChatbotSession(token, sessionData) {
  const response = await fetch(`${BASE_URL}/chatbot/sessions`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(sessionData),
  });
  return response.json();
}

export async function getChatbotSessions(token) {
  const response = await fetch(`${BASE_URL}/chatbot/sessions`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function getChatbotSessionMessages(token, sessionId) {
  const response = await fetch(`${BASE_URL}/chatbot/sessions/${sessionId}/messages`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function addChatbotMessage(token, sessionId, messageData) {
  const response = await fetch(`${BASE_URL}/chatbot/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(messageData),
  });
  return response.json();
}

// Reminders
export async function getReminders(token) {
  const response = await fetch(`${BASE_URL}/reminders`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createReminder(token, reminderData) {
  const response = await fetch(`${BASE_URL}/reminders/add`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(reminderData),
  });
  return response.json();
}
