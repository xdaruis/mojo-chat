export default function OnlineUsersList({
  showUsers,
  setShowUsers,
  getUserColor,
}) {
  return (
    <aside
      className={`lg:w-[200px] lg:static lg:block ${
        showUsers ? 'fixed inset-2 z-10' : 'hidden'
      } bg-gray-800 rounded border border-green-500 overflow-y-auto`}
    >
      <div
        className="flex items-center justify-between p-3 border-b
          border-green-500"
      >
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
  );
}
