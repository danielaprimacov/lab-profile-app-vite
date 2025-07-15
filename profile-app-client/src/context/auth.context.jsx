import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5005';

import {
  verifyToken as verifyTokenService,
  logIn as logInService,
  signUp as signUpService,
} from '../services/auth.service';

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem('authToken', token);
  };

  const authenticateUser = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    verifyTokenService()
      .then((res) => {
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(res.data);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      });
  };

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem('authToken');
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    // Run the function after the initial render,
    // after the components in the App render for the first time.
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        setUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
