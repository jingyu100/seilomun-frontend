import "../../../css/customer/SideBtnModules.css";
import useLogin from "../../../Hooks/useLogin.js";
import ChatList from "./ChatList.jsx";
import { useChatRooms } from "../../../Context/ChatRoomsContext.jsx";

export default function ChatViewModule() {
  const { user } = useLogin();
  const { chatRooms } = useChatRooms();

  if (!user) {
    return (
      // <div className="sideChattModule viewModule noChat">
      //   <div>로그인 후 이용 가능합니다.</div>
      // </div>
      alert("로그인 후 이용 가능합니다.")
    );
  }

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
          <ChatList chatRooms={chatRooms} />
        ) : (
          <div className="noChat">채팅이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
