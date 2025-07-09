import "../../../css/customer/SideBtnModules.css";
import useLogin from "../../../Hooks/useLogin.js";
import { useChatRooms } from "../../../Context/ChatRoomsContext.jsx";
import { useState } from "react";
import ChatRoomView from "./ChatRoomView.jsx";
import { S3_BASE_URL } from "../../../api/config.js";

export default function ChatViewModule() {
  const { user } = useLogin();
  const { chatRooms } = useChatRooms();
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'chat'
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  if (!user) {
    return null; // 로그인 안 되어있으면 아무것도 렌더링하지 않음
  }

  // 채팅방 클릭 핸들러
  const handleChatRoomClick = (chatRoom) => {
    setSelectedChatRoom(chatRoom);
    setCurrentView("chat");
  };

  // 뒤로가기 핸들러
  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedChatRoom(null);
  };

  // 상대방(채팅방 타이틀)에 표시할 이름 결정 함수
  const getRoomTitle = (room) => {
    if (user.userType === "SELLER") {
      return room.customerNickname || "고객";
    } else {
      return room.sellerStoreName || "매장";
    }
  };

  // 프로필 이미지 URL 처리 함수
  const getProfileImageUrl = (room) => {
    let imageUrl = null;
  
    if (user.userType === "SELLER") {
      imageUrl = room.customerPhotoUrl;
    } else {
      imageUrl = room.sellerPhotoUrl;
    }
  
    // null, 빈 문자열 등 처리
    if (!imageUrl || imageUrl.trim() === "") {
      return "/image/product1.jpg"; // ✅ 기본 이미지로 fallback
    }
  
    // 절대 URL이면 그대로 사용
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
  
    // S3 URL 조합
    return `${S3_BASE_URL}${imageUrl}`;
  };


  // 프로필 이니셜 생성 함수
  const getProfileInitial = (room) => {
    const name = getRoomTitle(room);
    if (name === "고객" || name === "매장") {
      return name[0]; // "고" 또는 "매"
    }
    return name.charAt(0).toUpperCase();
  };

  const getLastMessageText = (room) => {
    return room.lastMessage && room.lastMessage.trim() !== ""
      ? room.lastMessage
      : "새 대화를 시작해보세요";
  };

  // 채팅창 뷰
  if (currentView === "chat" && selectedChatRoom) {
    return <ChatRoomView chatRoom={selectedChatRoom} onBack={handleBackToList} />;
  }

  // 채팅방 목록 뷰
  return (
    <div className="sideChattModule viewModule">
      <div className="chatModuleHead">
        <div className="chatModuleHead-inner displayFlex moduleFrame1">
          <h3>{user.nickname}님의 채팅방</h3>
          <h3>({chatRooms.length})</h3>
        </div>
      </div>
      <div className="chatModuleBody">
        {chatRooms.length > 0 ? (
          chatRooms.map((chat) => {
            const profileImageUrl = getProfileImageUrl(chat) ;
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
                          // 이미지 로드 실패시 이니셜로 대체
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
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
