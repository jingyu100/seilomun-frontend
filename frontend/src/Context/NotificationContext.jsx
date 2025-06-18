import React, { createContext, useContext } from "react";
import useNotifications from "../Hooks/useNotifications";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notification = useNotifications("http://3.36.70.70", "customer"); // 한 번만 호출
  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
