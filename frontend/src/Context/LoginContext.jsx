import { createContext, useEffect, useState } from "react";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLogin = localStorage.getItem("isLoggedIn");

    if (storedUser && storedLogin === "true") {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const isLoggedInFromStorage = localStorage.getItem("isLoggedIn");

      if (isLoggedInFromStorage !== "true") {
        setIsLoggedIn(false);
        setUser(null);
      }
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        setIsLoading,
        isLoggingIn,
        setIsLoggingIn,
        getIsLoggingIn: () => isLoggingIn,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
