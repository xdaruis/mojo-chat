export default function MessageList({ getUserColor }) {
  return (
    <main
      className="flex-1 min-w-0 p-4 bg-gray-800 rounded border
      border-green-500 overflow-hidden"
    >
      <div
        className="h-full overflow-y-auto overflow-x-hidden space-y-2
          text-lg"
      >
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
  );
}
