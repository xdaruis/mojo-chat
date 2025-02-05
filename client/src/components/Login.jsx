import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export default function Login() {
  const [nickname, setNickname] = useState('');
  const [showGoogle, setShowGoogle] = useState(true);

  const onLoginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setShowGoogle(false);
      console.log('Login Success:', codeResponse);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });

  const onLogin = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {showGoogle ? 'Welcome' : 'Set Nickname'}
        </h1>
        {showGoogle && (
          <>
            <button
              onClick={() => onLoginWithGoogle()}
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
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          </>
        )}
        <form onSubmit={onLogin} className="flex flex-col gap-4">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={`Enter your ${
              showGoogle ? 'temporary ' : 'permanent '
            }nickname`}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-4 py-2
            text-white hover:bg-blue-600"
          >
            Continue {showGoogle ? '' : 'with Google'}
          </button>
        </form>
      </div>
    </div>
  );
}
