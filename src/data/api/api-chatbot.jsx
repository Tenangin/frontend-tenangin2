/**
 * Function to call the chatbot API POST /chat endpoint.
 * @param {string} session_id - The session ID for the chat session.
 * @param {string} message - The message to send to the chatbot.
 * @param {boolean} reset - Whether to reset the chat session.
 * @returns {Promise<string>} - The chatbot response string.
 */
export async function postChat(session_id, message, reset = false) {
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id,
        message,
        reset
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.detail ? JSON.stringify(errorData.detail) : response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling chatbot API:', error);
    throw error;
  }
}
