import { useEffect, useRef, useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <footer
      className="w-full h-[8vh] min-h-[50px] bg-gray-800 rounded
      border border-green-500 p-1"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = value.trim();
          if (!disabled && text) {
            onSend(text);
            setValue('');
          }
        }}
        className="h-full"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={disabled ? 'Connecting…' : 'Type your message...'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          className="w-full h-full bg-gray-900 text-green-400 px-3
          rounded border border-green-500 focus:outline-none
            focus:border-green-400 text-lg disabled:opacity-60"
          autoFocus
        />
      </form>
    </footer>
  );
}
