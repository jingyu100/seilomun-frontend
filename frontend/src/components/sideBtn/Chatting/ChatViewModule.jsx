import "../../../css/customer/SideBtnModules.css";
import useLogin from "../../../Hooks/useLogin.js";
import { useChatRooms } from "../../../Context/ChatRoomsContext.jsx";

export default function ChatViewModule() {
  const { user } = useLogin();
  const { chatRooms } = useChatRooms();

  if (!user) {
    return null; // 로그인 안 되어있으면 아무것도 렌더링하지 않음
  }

  // 상대방(채팅방 타이틀)에 표시할 이름 결정 함수
  const getRoomTitle = (room) => {
    // 현재 Inquiry 컴포넌트는 고객 전용이므로 판매자 매장명만 표시
    return room.sellerStoreName || "매장";
  };

  const getLastMessageText = (room) => {
    return room.lastMessage && room.lastMessage.trim() !== ""
      ? room.lastMessage
      : "새 대화를 시작해보세요";
  };

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
          chatRooms.map((chat) => (
            <div className="chatRoomItem" key={chat.id}>
              <div className="chatRoomProfile"></div>
              <div className="chatRoomText">
                <div className="chatRoomName">{getRoomTitle(chat)}</div>
                <div className="chatRoomLastMessage">{getLastMessageText(chat)}</div>
              </div>
              {chat.unreadCount > 0 && (
                <div className="chatRoomUnread">{chat.unreadCount}</div>
              )}
            </div>
          ))
        ) : (
          <div className="noChat">채팅이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
