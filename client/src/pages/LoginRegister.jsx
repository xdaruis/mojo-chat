import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PHASE = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  REGISTER: 'register',
});

export default function LoginRegister() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [authCredentials, setAuthCredentials] = useState(null);
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [error, setError] = useState('');

  const isUserAuthenticated = useSelector(
    (state) => state.user.isAuthenticated,
  );

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate('/chat');
    }
  }, [isUserAuthenticated, navigate]);

  const tryLogin = async (credentials) => {
    try {
      await axios.post('/api/user/login', { authCredentials: credentials });
      navigate('/chat');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        // user not found -> go to registration
        setAuthCredentials(credentials);
        setPhase(PHASE.REGISTER);
        setError('');
      } else {
        setPhase(PHASE.IDLE);
        setError('Login failed. Please try again.');
      }
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please choose a username.');
      return;
    }

    setPhase(PHASE.LOADING);
    setError('');
    try {
      await axios.post('/api/user/register', {
        username,
        authCredentials,
      });
      navigate('/chat');
    } catch (err) {
      setPhase(PHASE.REGISTER);
      setError(
        err?.response?.data?.error ||
          'Registration failed. Try a different username.',
      );
    }
  };

  const onGoogleOAuth = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const credentials = {
        provider: 'GOOGLE',
        token: codeResponse.access_token,
      };
      setError('');
      setPhase(PHASE.LOADING);
      await tryLogin(credentials);
    },
    onError: () => {
      setError('Google login failed. Please try again.');
    },
  });

  const title = phase === 'register' ? 'Set Nickname' : 'Welcome';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          {title}
        </h1>
        {error ? (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        ) : (
          <div className="mb-4" />
        )}

        {phase === PHASE.LOADING && (
          <div
            className="flex w-full items-center justify-center py-8
            text-gray-600"
          >
            Checking your account...
          </div>
        )}

        {phase === PHASE.IDLE && (
          <button
            onClick={() => onGoogleOAuth()}
            className="flex w-full items-center justify-center gap-2 rounded-lg
              border border-gray-300 px-4 py-2 text-gray-700 shadow-md
              hover:bg-gray-50 cursor-pointer"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="h-5 w-5"
            />
            Sign in with Google
          </button>
        )}

        {phase === PHASE.REGISTER && (
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
