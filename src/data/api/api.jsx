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
  const response = await fetch(`${BASE_URL}/api/assessment/add`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(assessmentData),
  });
  return response.json();
}

export async function deleteAssessment(token, assessmentId) {
  const response = await fetch(`${BASE_URL}/api/assessment/${assessmentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
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

export const createChatbotMessage = async (token, messagePayload) => {
  const endpoint = "https://PetaniHandal-tenobot-api.hf.space/chat";


  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(messagePayload), 
    });

    if (!response.ok) {
      let errorBodyText = "Tidak ada detail tambahan dari server.";
      try {
        errorBodyText = await response.text();
      } catch (e) {

        console.error("Gagal membaca body error:", e);
      }

      const errorMessage = `Gagal mengirim pesan. Status: ${response.status} (${response.statusText}). Detail: ${errorBodyText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log("Respons sukses dari API createChatbotMessage:", responseData);
    return responseData;

  } catch (error) {
    console.error("Terjadi error pada createChatbotMessage:", error.message);
    throw error;
  }
};

export async function deleteChatbotSession(token, sessionId) {
  const response = await fetch(`${BASE_URL}/api/chatbot/sessions/${sessionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function getChatbotSessions(token,id) {

  const response = await fetch(`${BASE_URL}/api/chatbot/sessions/:${id}`, {
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

// Recomendations
export async function getRecommendations(token) {
  const response = await fetch(`${BASE_URL}/api/recommendations`, {
    headers: getAuthHeaders(token),
  });
  return response.json();
}

export async function createRecommendation(token, recommendationData) {
  const response = await fetch(`${BASE_URL}/api/recommendations/add`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(recommendationData),
  });
  return response.json();
}

export async function deleteRecommendation(token, recommendationId) {
  const response = await fetch(`${BASE_URL}/api/recommendations/${recommendationId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return response.json();
}