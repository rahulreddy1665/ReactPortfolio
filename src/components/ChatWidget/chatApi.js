// Chat API for the ChatWidget — all network code lives here.
//
// Contract:
//   askQuestion(question: string) => Promise<{ answer: string, sources: string[] }>
//
// On failure it rejects with a ChatApiError whose `userMessage` is safe to show
// in the chat. Config: only the base URL (REACT_APP_RAG_API_URL). Never put API
// keys here — anything in a CRA bundle is public.

const BASE_URL = (process.env.REACT_APP_RAG_API_URL || '').replace(/\/+$/, '');
const TIMEOUT_MS = 60000; // free host can take a while to wake up
export const MAX_QUESTION_LENGTH = 300;

export const ERROR_MESSAGES = {
  timeout: 'The assistant is waking up — please try again in a moment.',
  network: "Sorry, I couldn't reach the assistant. Please try again.",
  validation: 'Please ask a question between 1 and 300 characters.',
};

export class ChatApiError extends Error {
  constructor(kind, detail) {
    super(detail || kind);
    this.name = 'ChatApiError';
    this.kind = kind;
    this.userMessage = ERROR_MESSAGES[kind] || ERROR_MESSAGES.network;
  }
}

export async function askQuestion(question) {
  const trimmed = (question || '').trim();
  if (!trimmed || trimmed.length > MAX_QUESTION_LENGTH) {
    throw new ChatApiError('validation');
  }

  if (!BASE_URL) {
    throw new ChatApiError('network', 'REACT_APP_RAG_API_URL is not set');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let data;
  try {
    const response = await fetch(`${BASE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: trimmed }),
      signal: controller.signal,
    });

    if (response.status === 422) throw new ChatApiError('validation');
    if (!response.ok) {
      throw new ChatApiError('network', `HTTP ${response.status}`);
    }

    data = await response.json();
  } catch (err) {
    if (err instanceof ChatApiError) throw err;
    if (err.name === 'AbortError') throw new ChatApiError('timeout');
    // fetch network failure (TypeError) or invalid JSON body
    throw new ChatApiError('network', err.message);
  } finally {
    clearTimeout(timeoutId);
  }

  return {
    answer: typeof data.answer === 'string' ? data.answer : '',
    sources: Array.isArray(data.sources) ? data.sources : [],
  };
}
