import "../../../css/customer/SideBtnModules.css";
import useLogin from "../../../Hooks/useLogin.js";
import { useChatRooms } from "../../../Context/ChatRoomsContext.jsx";
import { useState } from "react";
import ChatRoomView from "./ChatRoomView.jsx";
import api, { API_BASE_URL, S3_BASE_URL } from "../../../api/config.js";

export default function ChatViewModule() {
  const { user } = useLogin();
  const { chatRooms, fetchChatRooms } = useChatRooms();
  const [currentView, setCurrentView] = useState("list");
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  if (!user) {
    return null;
  }

  // ✅ 새 채팅방 생성 핸들러 (예시용 sellerId / customerId 대체 필요)
  const handleNewChatRoom = async () => {
    try {
      const response = await api.post(`${API_BASE_URL}/chat-rooms`, {
        sellerId: "seller-id-here",      // 필요 시 동적 값으로 대체
        customerId: "customer-id-here",  // 필요 시 동적 값으로 대체
      });

      await fetchChatRooms(); // 🔁 이미지 포함된 정보로 갱신
    } catch (err) {
      console.error("채팅방 생성 실패", err);
    }
  };

  const handleChatRoomClick = (chatRoom) => {
    setSelectedChatRoom(chatRoom);
    setCurrentView("chat");
  };

  const handleBackToList = async () => {
    await fetchChatRooms();
    setSelectedChatRoom(null);
    setCurrentView("list");
  };

  const getRoomTitle = (room) => {
    return user.userType === "SELLER"
      ? room.customerNickname || "고객"
      : room.sellerStoreName || "매장";
  };

  const getProfileImageUrl = (room) => {
    const imageUrl = user.userType === "SELLER"
      ? room.customerPhotoUrl
      : room.sellerPhotoUrl;

    if (!imageUrl || imageUrl.trim() === "") {
      return "/image/product1.jpg";
    }

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    return `${S3_BASE_URL}${imageUrl}`;
  };

  const getProfileInitial = (room) => {
    const name = getRoomTitle(room);
    return name === "고객" || name === "매장"
      ? name[0]
      : name.charAt(0).toUpperCase();
  };

  const getLastMessageText = (room) => {
    return room.lastMessage && room.lastMessage.trim() !== ""
      ? room.lastMessage
      : "새 대화를 시작해보세요";
  };

  if (currentView === "chat" && selectedChatRoom) {
    return <ChatRoomView chatRoom={selectedChatRoom} onBack={handleBackToList} />;
  }

  return (
    <div className="sideChattModule viewModule">
      <div className="chatModuleHead">
        <div className="chatModuleHead-inner displayFlex moduleFrame1">
          <h3>{user.nickname}님의 채팅방</h3>
          <h3>({chatRooms.length})</h3>
        </div>
        {/* ✅ 예시용 버튼: 필요 시 삭제/이동 */}
        <button onClick={handleNewChatRoom} style={{ marginLeft: "auto" }}>
          새 채팅 시작
        </button>
      </div>

      <div className="chatModuleBody">
        {chatRooms.length > 0 ? (
          chatRooms.map((chat) => {
            const profileImageUrl = getProfileImageUrl(chat);
            const profileInitial = getProfileInitial(chat);

            return (
              <div
                className="chatRoomItem"
                key={chat.id}
                onClick={() => handleChatRoomClick(chat)}
                style={{ cursor: "pointer" }}
              >
                <div className="chatRoomProfile">
                  {profileImageUrl ? (
                    <>
                      <img
                        src={profileImageUrl}
                        alt={`${getRoomTitle(chat)} 프로필`}
                        className="chatProfileImage"
                        onError={(e) => {
                          setTimeout(() => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }, 300);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                          display: "block",
                        }}
                      />
                      <div
                        className="chatProfileInitial"
                        style={{
                          display: "none",
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "18px",
                        }}
                      >
                        {profileInitial}
                      </div>
                    </>
                  ) : (
                    <div
                      className="chatProfileInitial"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "18px",
                      }}
                    >
                      {profileInitial}
                    </div>
                  )}
                </div>
                <div className="chatRoomText">
                  <div className="chatRoomName">{getRoomTitle(chat)}</div>
                  <div className="chatRoomLastMessage">{getLastMessageText(chat)}</div>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="chatRoomUnread">{chat.unreadCount}</div>
                )}
              </div>
            );
          })
        ) : (
          <div className="noChat">
            <div className="noChatIcon">💬</div>
            <div className="noChatTitle">아직 채팅방이 없습니다</div>
            <div className="noChatSubtext">상품 문의나 주문 관련 대화를 시작해보세요</div>
          </div>
        )}
      </div>
    </div>
  );
}
