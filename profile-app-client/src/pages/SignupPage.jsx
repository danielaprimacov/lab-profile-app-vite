import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signUp } from '../services/auth.service';

import backgroundImg from '../assets/images/oval-bg.png';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('');
  const [course, setCourse] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleCampus = (e) => setCampus(e.target.value);
  const handleCourse = (e) => setCourse(e.target.value);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the auth.service signUp function
      await signUp({ username, password, campus, course });
      // on success, redirect to login page
      navigate('/login');
    } catch (error) {
      // Network or CORS error
      if (!error.response) {
        setErrorMessage(
          'Network or CORS error – make sure your server CORS settings allow this request.'
        );
      } else {
        setErrorMessage(error.response.data.message || 'Signup failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSignupSubmit}
        className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {/* Left panel (white section of the image) */}
        <div className="w-1/2 p-10 space-y-6">
          <h2 className="text-3xl font-semibold text-green-700">Sign up</h2>

          <div>
            <label htmlFor="username" className="block text-sm text-gray-600">
              Username
            </label>
            <input
              id="username"
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

          <div>
            <label htmlFor="campus" className="block text-sm text-gray-600">
              Campus
            </label>
            <input
              id="campus"
              value={campus}
              onChange={handleCampus}
              required
              className="mt-1 w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="course" className="block text-sm text-gray-600">
              Course
            </label>
            <input
              id="course"
              value={course}
              onChange={handleCourse}
              required
              className="mt-1 w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>

        {/* Right panel (green section of the image) */}
        <div className="w-1/2 py-15 px-20 flex flex-col justify-between">
          <div className="pl-5">
            <h3 className="text-xl font-bold text-gray-800">Hello!!</h3>
            <p className="mt-2 text-gray-700">Welcome to IronProfile!</p>
          </div>

          <div className="space-y-4 pl-5">
            <p className="text-gray-600 text-sm">
              If you signup, you agree with all our terms and conditions where
              we can do whatever we want with the data!
            </p>
            <button
              type="submit"
              className="w-full bg-white font-semibold py-2 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition"
            >
              Create the Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
