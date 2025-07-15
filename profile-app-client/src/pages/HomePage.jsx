import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth.context';

import backgroundImg from '../assets/images/oval-bg.png';

function HomePage() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
      <div
        className="flex flex-col h-[400px] w-full mx-20 justify-center items-center shadow-lg rounded-lg overflow-hidden
                   bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <h1 className="mt-10 text-4xl font-semibold text-green-700">
          Welcome!
        </h1>
        <div className="w-full p-8 space-y-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/signup"
                className="block w-full text-center bg-white text-green-700 font-semibold py-2 rounded-lg shadow hover:bg-gray-50 transition"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="block w-full text-center bg-white text-green-700 font-semibold py-2 rounded-lg shadow hover:bg-gray-50 transition"
              >
                Log in
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="block w-full text-center bg-white text-green-700 font-semibold py-2 rounded-lg shadow hover:bg-gray-50 transition"
              >
                Profile
              </Link>
              <button
                onClick={logOutUser}
                className="block w-full text-center bg-white text-red-500 font-semibold py-2 rounded-lg shadow hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
