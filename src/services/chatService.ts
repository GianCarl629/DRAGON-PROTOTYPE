/**
 * CHATBOT SERVICE
 * 
 * Communicates with the Dragon Treasure server-side Gemini API endpoint (POST /api/chat).
 * Ensures that API keys and Google Gemini credentials remain strictly on the backend.
 */

export interface ChatResponse {
  reply?: string;
  error?: string;
}

/**
 * Sends a message to the Dragon Treasure Assistant backend.
 * @param userMessage - The text message sent by the user
 * @returns The assistant reply string
 */
export async function sendMessage(userMessage: string): Promise<string> {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    throw new Error('Message cannot be empty.');
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: trimmed }),
  });

  const data: ChatResponse = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'The chatbot is temporarily unavailable. Please try again.');
  }

  if (!data.reply) {
    throw new Error('Empty response received from assistant.');
  }

  return data.reply;
}
