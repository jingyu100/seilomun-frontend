import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import useLogin from "../Hooks/useLogin.js";

const ChatRoomsContext = createContext();

export function ChatRoomsProvider({ children }) {
  const { user } = useLogin();
  const [chatRooms, setChatRooms] = useState([]);

  // 중복 제거 함수
  const removeDuplicateRooms = (rooms) => {
    const uniqueRooms = rooms.filter(
      (room, index, self) => index === self.findIndex((r) => r.id === room.id)
    );
    console.log("중복 제거 전:", rooms.length, "개");
    console.log("중복 제거 후:", uniqueRooms.length, "개");
    return uniqueRooms;
  };

  useEffect(() => {
    // 로그인하지 않았으면 목록 초기화
    if (!user) {
      setChatRooms([]);
      return;
    }

    const fetchChatRooms = async () => {
      try {
        const res = await axios.get("http://localhost/api/chat/rooms", {
          withCredentials: true,
        });

        const rooms = res.data.data.chatRooms || [];
        const uniqueRooms = removeDuplicateRooms(rooms);
        setChatRooms(uniqueRooms);
      } catch (error) {
        console.error("채팅방 목록 불러오기 실패:", error);
      }
    };

    fetchChatRooms();
  }, [user]);

  // 새 채팅방 추가 함수
  const addChatRoom = (newRoom) => {
    console.log("addChatRoom 호출됨:", newRoom);
    console.log("기존 chatRooms:", chatRooms);

    setChatRooms((prev) => {
      const isDuplicate = prev.some((room) => room.id === newRoom.id);
      console.log("중복 체크 결과:", isDuplicate);

      if (isDuplicate) {
        console.log("중복된 채팅방이므로 추가하지 않음");
        return prev;
      }

      console.log("새 채팅방 추가");
      return [...prev, newRoom];
    });
  };

  return (
    <ChatRoomsContext.Provider value={{ chatRooms, addChatRoom, setChatRooms }}>
      {children}
    </ChatRoomsContext.Provider>
  );
}

export function useChatRooms() {
  return useContext(ChatRoomsContext);
}
