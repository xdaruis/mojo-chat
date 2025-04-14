import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Login from './components/Login';
import { login } from './features/user';
import ChatPage from './pages/ChatPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Login />
      </GoogleOAuthProvider>
    ),
  },
  {
    path: '/chat',
    element: <ChatPage />,
  },
]);

export default function App() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const getSession = async () => {
    try {
      const { data } = await axios.post('/api/user/session');
      if (data.session.username) {
        dispatch(login({ username: data.session.username }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSession();
  });

  if (loading) return <div>Loading...</div>;

  return <RouterProvider router={router} />;
}
