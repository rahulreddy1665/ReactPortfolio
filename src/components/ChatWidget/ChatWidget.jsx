import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { askQuestion, ERROR_MESSAGES, MAX_QUESTION_LENGTH } from './chatApi';
import './ChatWidget.css';

// Show the character counter once the user is this close to the limit.
const COUNTER_THRESHOLD = 250;

// Open any links in the answer in a new tab.
const MARKDOWN_COMPONENTS = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

const WELCOME_MESSAGE =
  "Hi! Ask me anything about Rahul's experience, skills, or projects.";

const DEFAULT_SUGGESTIONS = [
  "What are Rahul's main skills?",
  'Tell me about his projects',
  "What's his work experience?",
];

/**
 * Floating chat widget.
 *
 * Props:
 *  - suggestions: string[]  Suggested-question chips shown under the welcome message.
 *  - theme: 'auto' | 'light' | 'dark'  'auto' follows the OS (prefers-color-scheme).
 *           Pass 'light'/'dark' to follow your site's own dark-mode toggle instead.
 */
export default function ChatWidget({
  suggestions = DEFAULT_SUGGESTIONS,
  theme = 'auto',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: WELCOME_MESSAGE, sources: [] },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const nextId = useRef(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);
  const wasOpen = useRef(false);

  const hasUserMessage = messages.some((m) => m.role === 'user');
  const remaining = MAX_QUESTION_LENGTH - input.length;
  const showCounter = input.length >= COUNTER_THRESHOLD;

  // Auto-scroll to the newest message / typing indicator.
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus management: focus the input on open, return focus to the button on close.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  // Re-focus the input once a reply arrives (it was disabled while loading).
  useEffect(() => {
    if (!isLoading && isOpen) {
      inputRef.current?.focus();
    }
  }, [isLoading, isOpen]);

  // `sources` is kept on each message (not rendered yet) for a future "Sources" toggle.
  function addMessage(role, text, sources = [], isError = false) {
    const id = nextId.current++;
    setMessages((prev) => [...prev, { id, role, text, sources, isError }]);
  }

  async function sendMessage(text) {
    const question = text.trim();
    if (!question || isLoading) return;
    if (question.length > MAX_QUESTION_LENGTH) {
      addMessage('bot', ERROR_MESSAGES.validation, [], true);
      return;
    }

    addMessage('user', question);
    setInput('');
    setIsLoading(true);

    try {
      const { answer, sources } = await askQuestion(question);
      addMessage('bot', answer, sources);
    } catch (err) {
      // Only ever show a friendly message, never the raw error.
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ChatWidget] request failed:', err);
      }
      addMessage('bot', err?.userMessage || ERROR_MESSAGES.network, [], true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault(); // Enter in the input submits the form too.
    sendMessage(input);
  }

  function handlePanelKeyDown(e) {
    if (e.key === 'Escape') setIsOpen(false);
  }

  return (
    <div className="cw-root" data-theme={theme}>
      <div
        id="cw-panel"
        className={`cw-panel ${isOpen ? 'cw-panel--open' : ''}`}
        role="dialog"
        aria-label="Chat with Rahul's assistant"
        aria-hidden={!isOpen}
        onKeyDown={handlePanelKeyDown}
      >
        <div className="cw-header">
          <span className="cw-title">Ask about Rahul</span>
          <button
            type="button"
            className="cw-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div
          className="cw-messages"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((m, index) => (
            <React.Fragment key={m.id}>
              <div className={`cw-message cw-message--${m.role}`}>
                <div className="cw-bubble">
                  <span className="cw-sr-only">
                    {m.role === 'user' ? 'You said: ' : 'Assistant said: '}
                  </span>
                  {m.role === 'bot' && !m.isError ? (
                    <div className="cw-markdown">
                      <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    m.text
                  )}
                </div>
              </div>

              {index === 0 && !hasUserMessage && suggestions.length > 0 && (
                <div className="cw-suggestions" aria-label="Suggested questions">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="cw-chip"
                      onClick={() => sendMessage(s)}
                      disabled={isLoading}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}

          {isLoading && (
            <div className="cw-message cw-message--bot">
              <div className="cw-bubble cw-typing" aria-label="Assistant is typing">
                <span className="cw-dot" />
                <span className="cw-dot" />
                <span className="cw-dot" />
                <span className="cw-typing-text">typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="cw-input-row" onSubmit={handleSubmit}>
          <label htmlFor="cw-input" className="cw-sr-only">
            Your question
          </label>
          <input
            id="cw-input"
            ref={inputRef}
            className="cw-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? 'Waiting for reply...' : 'Type your question...'}
            disabled={isLoading}
            maxLength={MAX_QUESTION_LENGTH}
            autoComplete="off"
            aria-label="Type your question"
            aria-describedby={showCounter ? 'cw-counter' : undefined}
          />
          {showCounter && (
            <span
              id="cw-counter"
              className={`cw-counter ${remaining <= 10 ? 'cw-counter--limit' : ''}`}
              aria-live="polite"
            >
              {remaining}
              <span className="cw-sr-only"> characters left</span>
            </span>
          )}
          <button
            type="submit"
            className="cw-send"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>

      <button
        ref={toggleRef}
        type="button"
        className={`cw-toggle ${isOpen ? 'cw-toggle--open' : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
        aria-controls="cw-panel"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3.5V17H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
