import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import useLogin from "../Hooks/useLogin.js";

const ChatRoomsContext = createContext();

export function ChatRoomsProvider({ children }) {
  const { user } = useLogin();
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    if (!user?.id || !user?.type) {
      setChatRooms([]);
      return;
    }

    const fetchChatRooms = async () => {
      try {
        const res = await axios.get("http://localhost/api/chat/rooms", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setChatRooms(res.data.data.chatRooms || []);
      } catch (error) {
        console.error("채팅방 목록 불러오기 실패:", error);
      }
    };

    fetchChatRooms();
  }, [user]);

  // 새 채팅방 추가 함수
  const addChatRoom = (newRoom) => {
    setChatRooms((prev) => {
      if (prev.some((room) => room.id === newRoom.id)) return prev;
      return [...prev, newRoom];
    });
  };

  return (
    <ChatRoomsContext.Provider value={{ chatRooms, addChatRoom }}>
      {children}
    </ChatRoomsContext.Provider>
  );
}

export function useChatRooms() {
  return useContext(ChatRoomsContext);
}
