import { useEffect, useRef } from 'react';

export default function MessageList({ messages, getUserColor }) {
  const scrollRef = useRef(null);
  const stickToBottomRef = useRef(true);

  const handleStickyBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 8;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    stickToBottomRef.current = atBottom;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  return (
    <main
      className="flex-1 min-w-0 p-4 bg-gray-800 rounded border
      border-green-500 overflow-hidden"
    >
      <div
        ref={scrollRef}
        onScroll={handleStickyBottom}
        className="h-full overflow-y-auto overflow-x-hidden space-y-2
          text-lg"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500">Welcome to RetroChat...</p>
        ) : (
          messages.map((msg) => {
            if (msg.type === 'system') {
              if (msg.event === 'user_connected') {
                return (
                  <p key={msg.id} className="mb-2 break-words">
                    * {msg.user} has joined the channel
                  </p>
                );
              }
              if (msg.event === 'user_disconnected') {
                return (
                  <p key={msg.id} className="mb-2 break-words">
                    * {msg.user} has left the channel
                  </p>
                );
              }
              return null;
            }
            if (msg.type === 'chat') {
              return (
                <p key={msg.id} className="mb-2 break-words">
                  <span className={`${getUserColor(msg.user)}`}>
                    &lt;{msg.user}&gt;
                  </span>
                  <span className="text-green-400"> {msg.content}</span>
                </p>
              );
            }
            return null;
          })
        )}
      </div>
    </main>
  );
}
