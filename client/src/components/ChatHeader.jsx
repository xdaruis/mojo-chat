import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../features/user';

export default function ChatHeader({ showUsers, setShowUsers }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    axios.post('/api/user/logout').then(() => {
      navigate('/');
    });
  };

  return (
    <header
      className="w-full h-[8vh] min-h-[50px] p-3 bg-gray-800 rounded
        border border-green-500 flex items-center justify-between
          sticky top-0 z-20"
    >
      <h1
        className="min-w-0 text-xl sm:text-2xl
        font-bold truncate"
      >
        # MojoChat
      </h1>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="lg:hidden border border-green-500 rounded px-2 py-1
            sm:px-3 sm:py-2
            hover:bg-gray-700 text-sm sm:text-lg whitespace-nowrap leading-none"
        >
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
        <button
          onClick={onLogout}
          className="border border-green-500 rounded px-2 py-1 sm:px-3 sm:py-2
          hover:bg-gray-700 text-sm sm:text-lg whitespace-nowrap leading-none"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
