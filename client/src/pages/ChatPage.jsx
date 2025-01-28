import { useState } from 'react';

import ChatHeader from '../components/ChatHeader';
import ChatInput from '../components/ChatInput';
import MessageList from '../components/MessageList';
import OnlineUsersList from '../components/OnlineUsersList';

export default function ChatPage() {
  const [showUsers, setShowUsers] = useState(false);

  const getUserColor = (username) => {
    const colors = {
      Admin: 'text-red-400',
      User1: 'text-blue-400',
      User2: 'text-purple-400',
      User3: 'text-yellow-400',
    };
    return colors[username] || 'text-green-400';
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
        <MessageList getUserColor={getUserColor} />
        <OnlineUsersList
          showUsers={showUsers}
          setShowUsers={setShowUsers}
          getUserColor={getUserColor}
        />
      </div>
      <ChatInput />
    </div>
  );
}
