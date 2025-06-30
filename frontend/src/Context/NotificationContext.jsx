import React, { createContext, useContext } from "react";
import useNotifications from "../Hooks/useNotifications";
import api, { API_BASE_URL } from "../../api/config.js";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notification = useNotifications(API_BASE_URL, "customer"); // 한 번만 호출
  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
