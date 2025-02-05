export default function ChatHeader({ showUsers, setShowUsers }) {
  return (
    <header
      className="w-full h-[8vh] min-h-[50px] p-3 bg-gray-800 rounded
        border border-green-500 flex items-center justify-between"
    >
      <h1 className="text-2xl font-bold truncate"># MojoJojo</h1>
      <button
        onClick={() => setShowUsers(!showUsers)}
        className="lg:hidden border border-green-500 rounded px-3 py-1
          hover:bg-gray-700 text-lg"
      >
        {showUsers ? 'Hide Users' : 'Show Users'}
      </button>
    </header>
  );
}
