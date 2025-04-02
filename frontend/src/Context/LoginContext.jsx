import { createContext, useState } from "react";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setisLoginIn] = useState(false);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setisLoginIn }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
