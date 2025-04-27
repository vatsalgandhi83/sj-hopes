import { useState, useEffect } from 'react';

type UserType = 'caseworker' | 'admin';

function getInitialAuth() {
  if (typeof window === 'undefined') return { isLoggedIn: false, userType: undefined };
  const authData = localStorage.getItem('auth');
  if (authData) {
    const { userType } = JSON.parse(authData);
    return { isLoggedIn: true, userType };
  }
  return { isLoggedIn: false, userType: undefined };
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(getInitialAuth().isLoggedIn);
  const [userType, setUserType] = useState<UserType | undefined>(getInitialAuth().userType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { userType: storedUserType } = JSON.parse(authData);
      setIsLoggedIn(true);
      setUserType(storedUserType);
    } else {
      setIsLoggedIn(false);
      setUserType(undefined);
    }
    setLoading(false);
  }, []);

  const login = (userType: UserType) => {
    localStorage.setItem('auth', JSON.stringify({ userType }));
    setIsLoggedIn(true);
    setUserType(userType);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setIsLoggedIn(false);
    setUserType(undefined);
  };

  return {
    isLoggedIn,
    userType,
    login,
    logout,
    loading
  };
}; 