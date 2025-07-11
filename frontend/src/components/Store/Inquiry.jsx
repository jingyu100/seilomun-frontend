import React from "react";
import useLogin from "../../Hooks/useLogin.js";
import { useChatRooms } from "../../Context/ChatRoomsContext.jsx";
import api, { API_BASE_URL } from "../../api/config.js";

export default function Inquiry({ sellerId, onOpenChat }) {
  const { user } = useLogin();
  const { addChatRoom } = useChatRooms();

  const handleNewChatRoom = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 1. 채팅방 생성 요청
      const response = await api.post(`/api/chat/rooms`, { sellerId });
      const roomId = response?.data?.data?.chatRoomId;

      if (!roomId) {
        throw new Error("chatRoomId 가 응답에 존재하지 않습니다.");
      }

      console.log("채팅방 생성/조회 성공, roomId:", roomId);

      // ✅ 2. 생성된 채팅방의 전체 정보 재조회 (프로필 이미지 포함)
      const fullRoomRes = await api.get(`/api/chat/rooms/${roomId}`);
      const fullRoomData = fullRoomRes?.data?.data;

      if (!fullRoomData) {
        throw new Error("채팅방 상세정보 조회 실패");
      }

      // ✅ 3. Context에 반영 (프로필 포함된 채팅방)
      addChatRoom(fullRoomData);

      // ✅ 4. 사이드 채팅 패널 열기 (ChatViewModule에서 View 전환)
      if (onOpenChat) {
        onOpenChat(fullRoomData);
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error?.response?.data || error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  return (
    <div
      className="inquiry storeRight-ui"
      onClick={handleNewChatRoom}
      style={{ cursor: user ? "pointer" : "not-allowed", opacity: user ? 1 : 0.5 }}
      title={user ? "1:1 문의" : "로그인 후 이용 가능합니다"}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <p style={{ paddingTop: "3px" }}>1:1문의</p>
        <img
          src="/image/icon/icon-chat2.png"
          alt=""
          style={{
            width: "20%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}