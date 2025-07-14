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

    // 고객이 판매자에게 문의하는 경우만 처리
    const postData = { sellerId };

    try {
      const response = await api.post(`/api/chat/rooms`, postData);

      const roomId = response?.data?.data?.chatRoomId;
      if (!roomId) {
        throw new Error("chatRoomId 가 응답에 존재하지 않습니다.");
      }
      console.log("채팅방 생성/조회 성공, roomId:", roomId);

      // Context 업데이트: 응답 데이터를 그대로 사용해 새 채팅방 추가
      const roomData = response.data.data;
      const newChatRoom = {
        id: roomData.chatRoomId,
        customerId: roomData.customerId,
        customerNickname: roomData.customerNickname,
        sellerId: roomData.sellerId,
        sellerStoreName: roomData.sellerStoreName,
        createdAt: roomData.createdAt,
        lastMessage: roomData.lastMessage,
        lastMessageTime: roomData.lastMessageTime,
        unreadCount: 0,
        customerPhotoUrl: roomData.customerPhotoUrl || roomData.customer?.photoUrl,
        sellerPhotoUrl: roomData.sellerPhotoUrl || roomData.seller?.photoUrl,
      };

      console.log("newChatRoom", newChatRoom);

      addChatRoom(newChatRoom);

      // 채팅방 생성 후 사이드 채팅 모듈 열기
      if (onOpenChat) {
        onOpenChat(newChatRoom);
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
