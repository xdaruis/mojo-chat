import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { login, logout } from './features/user';
import ChatPage from './pages/Chat';
import LoginRegisterPage from './pages/LoginRegister';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <LoginRegisterPage />
      </GoogleOAuthProvider>
    ),
  },
  {
    path: '/chat',
    element: <ChatPage />,
  },
]);

export default function App() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const getSession = useCallback(async () => {
    try {
      const { data } = await axios.post('/api/user/session');
      if (data.session.username) {
        dispatch(login({ username: data.session.username }));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      dispatch(logout());
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getSession();
  }, [getSession]);

  // TODO: Add a proper loading spinner
  if (loading) return <div>Loading...</div>;

  return <RouterProvider router={router} />;
}
