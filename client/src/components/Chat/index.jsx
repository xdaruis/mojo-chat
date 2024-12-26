import { useEffect, useRef, useState } from 'react';

import './styles.css';

// TODO: Refactor this and make it look nicer
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8086/api/chat/connect');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      console.log(`Received message:`, event);
      console.log(event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          message: inputMessage,
        }),
      );
      setInputMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>{msg}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
