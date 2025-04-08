import { createContext, useEffect, useState } from "react";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLogin = localStorage.getItem("isLoggedIn");

    if (storedUser && storedLogin === "true") {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }

    setIsLoading(false);
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
