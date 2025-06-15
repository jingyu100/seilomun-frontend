import "../../../css/customer/SideBtnModules.css";
import useLogin from "../../../Hooks/useLogin.js";
import { useChatRooms } from "../../../Context/ChatRoomsContext.jsx";
import { useState } from "react";
import ChatRoomView from "./ChatRoomView.jsx";

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
        {chatRooms.length > 0 &&
          chatRooms.map((chat) => (
            <div
              className="chatRoomItem"
              key={chat.id}
              onClick={() => handleChatRoomClick(chat)}
              style={{ cursor: "pointer" }}
            >
              <div className="chatRoomProfile"></div>
              <div className="chatRoomText">
                <div className="chatRoomName">{getRoomTitle(chat)}</div>
                <div className="chatRoomLastMessage">{getLastMessageText(chat)}</div>
              </div>
              {chat.unreadCount > 0 && (
                <div className="chatRoomUnread">{chat.unreadCount}</div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
