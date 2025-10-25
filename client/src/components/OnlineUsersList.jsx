export default function OnlineUsersList({
  users,
  showUsers,
  setShowUsers,
  getUserColor,
}) {
  return (
    <aside
      className={`lg:w-[200px] lg:static lg:block ${
        showUsers ? 'absolute inset-0 m-2 z-10' : 'hidden'
      } bg-gray-800 rounded border border-green-500 overflow-y-auto shadow-lg`}
      role="dialog"
      aria-modal="true"
      aria-label="Online users"
    >
      <div
        className="flex items-center justify-between p-3 border-b
          border-green-500"
      >
        <h2 className="text-base sm:text-lg font-bold">Online Users</h2>
        <button
          onClick={() => setShowUsers(false)}
          className="lg:hidden hover:text-green-300 text-xl"
          aria-label="Close users panel"
        >
          ✕
        </button>
      </div>
      <ul className="text-base sm:text-lg p-3">
        {users?.length ? (
          users.map((u) => (
            <li key={u} className="mb-1">
              <span className={`${getUserColor(u)}`}>+ {u}</span>
            </li>
          ))
        ) : (
          <li className="mb-1 text-gray-500">No users online</li>
        )}
      </ul>
    </aside>
  );
}
