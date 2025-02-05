import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';

import Login from './components/Login';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <ChatPage />
  ) : (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Login />;
    </GoogleOAuthProvider>
  );
}
