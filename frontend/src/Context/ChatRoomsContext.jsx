import React, { createContext, useContext, useState, useEffect } from "react";
import useLogin from "../Hooks/useLogin.js";
import api, { API_BASE_URL } from "../api/config.js";

const ChatRoomsContext = createContext();

export function ChatRoomsProvider({ children }) {
  const { user } = useLogin();
  const [chatRooms, setChatRooms] = useState([]);

  /* ---------- 유틸 ---------- */
  const removeDuplicateRooms = (rooms) =>
    rooms.filter(
      (room, idx, self) => idx === self.findIndex((r) => r.id === room.id)
    );

  /* ---------- ① 목록 가져오기 함수 ---------- */
  const fetchChatRooms = async () => {
    if (!user) return;
    try {
      const res = await api.get("/api/chat/rooms");
      const rooms = res.data.data.chatRooms || [];
      const uniqueRooms = removeDuplicateRooms(rooms);
      setChatRooms(uniqueRooms);
    } catch (err) {
      console.error("채팅방 목록 불러오기 실패:", err);
    }
  };

  /* ---------- ② 로그인 상태가 바뀔 때마다 목록 새로고침 ---------- */
  useEffect(() => {
    if (!user) {
      setChatRooms([]);
      return;
    }
    fetchChatRooms();
  }, [user]);

  /* ---------- ✅ ③ 새 채팅방 추가(또는 갱신) ---------- */
  const addChatRoom = (newRoomRaw) => {
    // 👉 프로필 이미지 URL 자동 추출해서 newRoom 보강

    console.log("👀 newRoomRaw:", newRoomRaw);
    
    const newRoom = {
      ...newRoomRaw,
      customerPhotoUrl: newRoomRaw.customerPhotoUrl || newRoomRaw.customer?.photoUrl || "",
      sellerPhotoUrl: newRoomRaw.sellerPhotoUrl || newRoomRaw.seller?.photoUrl || "",
    };

    setChatRooms((prev) => {
      const exists = prev.find((r) => r.id === newRoom.id);
      return exists
        ? prev.map((r) => (r.id === newRoom.id ? { ...r, ...newRoom } : r))
        : [...prev, newRoom];
    });
  };

  /* ---------- ④ Context value ---------- */
  const value = {
    chatRooms,
    setChatRooms,
    addChatRoom,
    fetchChatRooms,
  };

  return (
    <ChatRoomsContext.Provider value={value}>
      {children}
    </ChatRoomsContext.Provider>
  );
}

export function useChatRooms() {
  return useContext(ChatRoomsContext);
}
