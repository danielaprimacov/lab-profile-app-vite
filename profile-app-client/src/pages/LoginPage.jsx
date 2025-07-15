import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

import { logIn } from '../services/auth.service';

import backgroundImg from '../assets/images/oval-bg.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the auth.service logIn function
      const response = await logIn({ username, password });

      // Extract the token, store it, authenticate context, and redirect
      const { authToken } = response.data;
      storeToken(authToken);
      await authenticateUser();
      navigate('/');
    } catch (error) {
      const description = error.response?.data?.message || 'Login failed';
      setErrorMessage(description);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleLoginSubmit}
        className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {/* Left panel (white curve) */}
        <div className="w-1/2 p-10 space-y-8 mb-30">
          <h2 className="text-3xl font-semibold text-green-700">Log in</h2>

          <div>
            <label htmlFor="username" className="block text-sm text-gray-600">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsername}
              required
              className="mt-1 w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePassword}
              required
              className="mt-1 w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none"
            />
          </div>

          <p className="text-sm text-gray-600 tracking-wider">
            If you dont't have an account yet, you can create your account
            <Link to="/signup" className="underline text-green-700 pl-1 ">
              here
            </Link>
            .
          </p>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>

        {/* Right panel (green curve) */}
        <div className="w-1/2 py-15 px-10 flex flex-col justify-between">
          <div className="pl-15 tracking-wider">
            <h3 className="text-2xl font-bold text-gray-800">Hello!!</h3>
            <p className="mt-2 text-2xl text-gray-700">
              Awesome to have you at IronProfile again!
            </p>
          </div>

          <div className="space-y-6 pl-15">
            <p className="text-gray-600 text-sm">
              If you signup, you agree with all our terms and conditions where
              we can do whatever we want with the data!
            </p>
            <button
              type="submit"
              className="w-full bg-white font-semibold py-2 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
