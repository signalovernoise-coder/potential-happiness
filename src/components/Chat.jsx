import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useLocalStorage('trek-chat', []);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useLocalStorage('trek-username', '');
  const [showNamePrompt, setShowNamePrompt] = useState(!userName);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !userName) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: newMessage,
        author: userName,
        timestamp: new Date().toISOString(),
      },
    ]);

    setNewMessage('');
  };

  const deleteMessage = (messageId) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
  };

  const setName = (name) => {
    if (name.trim()) {
      setUserName(name.trim());
      setShowNamePrompt(false);
    }
  };

  if (showNamePrompt) {
    return (
      <div className="chat">
        <div className="card name-prompt">
          <h2 className="card-title">Welcome to the Trek Chat!</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Please enter your name to start chatting with your trek mates.
          </p>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setName(e.target.value);
                }
              }}
              autoFocus
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              const input = e.target.parentElement.querySelector('input');
              setName(input.value);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <div>
          <h2 className="section-title">Trek Chat</h2>
          <p className="chat-subtitle">Chatting as: {userName}</p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowNamePrompt(true)}
        >
          Change Name
        </button>
      </div>

      <div className="card chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-state-icon">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  isOwn={message.author === userName}
                  onDelete={deleteMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="message-input">
          <input
            className="form-input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function Message({ message, isOwn, onDelete }) {
  const timestamp = new Date(message.timestamp);
  const timeString = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateString = timestamp.toLocaleDateString();

  return (
    <div className={`message ${isOwn ? 'message-own' : ''}`}>
      <div className="message-content">
        <div className="message-header">
          <span className="message-author">{message.author}</span>
          <span className="message-time">
            {dateString} {timeString}
          </span>
        </div>
        <div className="message-text">{message.text}</div>
      </div>
      {isOwn && (
        <button
          className="message-delete"
          onClick={() => onDelete(message.id)}
          title="Delete message"
        >
          ×
        </button>
      )}
    </div>
  );
}
