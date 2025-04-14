import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginRegister() {
  const [username, setUsername] = useState('');
  const [authCredentials, setAuthCredentials] = useState(null);

  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      await axios.post('/api/user/login', {
        authCredentials,
      });
      navigate('/chat');
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/user/register', {
        username,
        authCredentials,
      });
      navigate('/chat');
    } catch (error) {
      setAuthCredentials(null);
      console.error('Registration Failed:', error);
    }
  };

  const onGoogleOAuth = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setAuthCredentials({
        provider: 'GOOGLE',
        token: codeResponse.access_token,
      });
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });

  useEffect(() => {
    if (authCredentials) onLogin();
  }, [authCredentials]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {!authCredentials ? 'Welcome' : 'Set Nickname'}
        </h1>
        {!authCredentials ? (
          <button
            onClick={() => onGoogleOAuth()}
            className="flex w-full items-center justify-center gap-2
                rounded-lg border border-gray-300 px-4 py-2 text-gray-700
                shadow-md hover:bg-gray-50"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="h-5 w-5"
            />
            Sign in with Google
          </button>
        ) : (
          <form onSubmit={onRegister} className="flex flex-col gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 px-4 py-2
            text-white hover:bg-blue-600"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
