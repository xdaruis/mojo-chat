import { useEffect, useRef } from 'react';

export default function ChatInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <footer
      className="w-full h-[8vh] min-h-[50px] bg-gray-800 rounded
      border border-green-500 p-1"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Type your message..."
        className="w-full h-full bg-gray-900 text-green-400 px-3
          rounded border border-green-500 focus:outline-none
            focus:border-green-400 text-lg"
        autoFocus
      />
    </footer>
  );
}
