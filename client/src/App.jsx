import React from 'react';

export default function App() {
  const [showUsers, setShowUsers] = React.useState(false);

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
    <div className="flex flex-col h-screen min-h-screen w-screen max-w-full overflow-hidden bg-gray-900 text-green-400 p-2 gap-2 font-mono text-lg">
      <header className="w-full h-[8vh] min-h-[50px] p-3 bg-gray-800 rounded border border-green-500 flex items-center justify-between">
        <h1 className="text-2xl font-bold truncate"># RetroChat IRC</h1>
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="lg:hidden border border-green-500 rounded px-3 py-1 hover:bg-gray-700 text-lg"
        >
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-2 flex-1 min-h-0 w-full relative">
        <main className="flex-1 min-w-0 p-4 bg-gray-800 rounded border border-green-500 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-hidden space-y-2 text-lg">
            <p className="text-gray-500">Welcome to RetroChat...</p>
            <p className="mb-2 break-words">* User1 has joined the channel</p>
            <p className="mb-2 break-words">
              <span className={`${getUserColor('User1')}`}>&lt;User1&gt;</span>
              <span className="text-green-400"> Hello, world!</span>
            </p>
            <p className="mb-2 break-words">* User2 has joined the channel</p>
            <p className="mb-2 break-words">
              <span className={`${getUserColor('User2')}`}>&lt;User2&gt;</span>
              <span className="text-green-400"> Hi everyone!</span>
            </p>
          </div>
        </main>

        <aside
          className={`
          lg:w-[200px] lg:static lg:block
          ${showUsers ? 'fixed inset-2 z-10' : 'hidden'}
          bg-gray-800 rounded border border-green-500 overflow-y-auto
        `}
        >
          <div className="flex items-center justify-between p-3 border-b border-green-500">
            <h2 className="text-lg font-bold">Online Users</h2>
            <button
              onClick={() => setShowUsers(false)}
              className="lg:hidden hover:text-green-300 text-lg"
            >
              ✕
            </button>
          </div>
          <ul className="text-lg p-3">
            <li className="mb-1">
              <span className={`${getUserColor('Admin')}`}>@ Admin</span>
            </li>
            <li className="mb-1">
              <span className={`${getUserColor('User1')}`}>+ User1</span>
            </li>
            <li className="mb-1">
              <span className={`${getUserColor('User2')}`}>+ User2</span>
            </li>
            <li className="mb-1">
              <span className={`${getUserColor('User3')}`}>+ User3</span>
            </li>
          </ul>
        </aside>
      </div>

      <footer className="w-full h-[8vh] min-h-[50px] bg-gray-800 rounded border border-green-500 p-1">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full h-full bg-gray-900 text-green-400 px-3 rounded border border-green-500 focus:outline-none focus:border-green-400 text-lg"
        />
      </footer>
    </div>
  );
}
