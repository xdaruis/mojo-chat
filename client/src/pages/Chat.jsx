import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import ChatHeader from '../components/ChatHeader';
import ChatInput from '../components/ChatInput';
import MessageList from '../components/MessageList';
import OnlineUsersList from '../components/OnlineUsersList';

export default function ChatPage() {
  const isUserAuthenticated = useSelector(
    (state) => state.user.isAuthenticated,
  );
  const [showUsers, setShowUsers] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/chat/connect`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'system') {
          if (data.event === 'user_list' && Array.isArray(data.users)) {
            setOnlineUsers(data.users);
          } else if (data.event === 'user_connected' && data.user) {
            setMessages((prev) => [
              ...prev,
              {
                id: messageIdRef.current++,
                type: 'system',
                event: 'user_connected',
                user: data.user,
              },
            ]);
            setOnlineUsers((prev) =>
              prev.includes(data.user) ? prev : [...prev, data.user],
            );
          } else if (data.event === 'user_disconnected' && data.user) {
            setMessages((prev) => [
              ...prev,
              {
                id: messageIdRef.current++,
                type: 'system',
                event: 'user_disconnected',
                user: data.user,
              },
            ]);
            setOnlineUsers((prev) => prev.filter((u) => u !== data.user));
          }
        } else if (data.type === 'chat' && data.content && data.user) {
          setMessages((prev) => [
            ...prev,
            {
              id: messageIdRef.current++,
              type: 'chat',
              user: data.user,
              content: data.content,
            },
          ]);
        }
      } catch {
        // Non-JSON or unexpected payload; ignore but keep debug info during dev
        // console.debug('Non-JSON WS message:', event.data);
      }
    };
    ws.onopen = () => {
      setIsConnected(true);
    };
    ws.onclose = () => {
      setIsConnected(false);
    };
    ws.onerror = (event) => {
      console.log('onerror: WebSocket error', event);
    };

    return () => {
      const socket = wsRef.current;
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        socket.close(4000);
      }
      wsRef.current = null;
    };
  }, [isUserAuthenticated]);

  // TODO: Add random color for each user
  const getUserColor = () => {
    // const colors = ['red', 'blue', 'purple', 'yellow'];
    return `text-red-400`;
    // return `text-${colors[Math.floor(Math.random() * colors.length)]}-400`;
  };

  const sendMessage = (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(trimmed);
    }
  };

  return (
    <div
      className="flex flex-col h-screen min-h-screen w-screen max-w-full
        overflow-hidden bg-gray-900 text-green-400 p-2 gap-2
        font-mono text-lg"
    >
      <ChatHeader showUsers={showUsers} setShowUsers={setShowUsers} />
      <div
        className="flex flex-col lg:flex-row gap-2 flex-1
        min-h-0 w-full relative"
      >
        <MessageList messages={messages} getUserColor={getUserColor} />
        <OnlineUsersList
          users={onlineUsers}
          showUsers={showUsers}
          setShowUsers={setShowUsers}
          getUserColor={getUserColor}
        />
      </div>
      <ChatInput onSend={sendMessage} disabled={!isConnected} />
    </div>
  );
}
