import "../../../css/customer/SideBtnModules.css";
import useLogin from "../../../Hooks/useLogin.js";
import { useState, useEffect } from "react";
import { useWebSocket } from "../../../Context/WebSocketContext.jsx";
import axios from "axios";

export default function ChatRoomView({ chatRoom, onBack }) {
  const { user } = useLogin();
  const [messageInput, setMessageInput] = useState("");

  // WebSocket 관련 훅 및 함수
  const {
    subscribeToRoom,
    unsubscribeFromRoom,
    sendMessage,
    getRoomMessages,
    setRoomMessages,
  } = useWebSocket();

  // 현재 방의 메시지 목록을 Context 에서 가져옴
  const [messages, setMessages] = useState(() => getRoomMessages(chatRoom.id));

  // 방 입장 시 과거 메시지 불러오고, 구독, 언마운트 시 구독 해제
  useEffect(() => {
    // 1. 과거 메시지 불러오기
    axios
      .get(`http://localhost/api/chat/rooms/${chatRoom.id}`, { withCredentials: true })
      .then((res) => {
        const history = res.data.data.ok || [];
        setMessages(history);
        setRoomMessages(chatRoom.id, history); // Context에도 저장
      })
      .catch((err) => {
        console.error("채팅 기록 불러오기 실패:", err);
        setMessages([]);
        setRoomMessages(chatRoom.id, []);
      });

    // 2. 구독 시작
    subscribeToRoom(chatRoom.id);

    // 3. 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribeFromRoom(chatRoom.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoom.id]);

  // Context 의 메시지 배열이 변경될 때마다 로컬 state 갱신
  useEffect(() => {
    setMessages(getRoomMessages(chatRoom.id));
  }, [getRoomMessages, chatRoom.id]);

  // 상대방 이름 결정
  const getOtherUserName = () => {
    if (user.userType === "CUSTOMER") {
      return chatRoom.sellerStoreName || "매장";
    } else {
      return chatRoom.customerNickname || "고객";
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    // 메시지 전송 (WebSocket)
    const success = sendMessage(chatRoom.id, messageInput);

    if (success) {
      setMessageInput("");
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="sideChattModule viewModule">
      {/* 채팅방 헤더 */}
      <div className="chatModuleHead">
        <div className="chatModuleHead-inner">
          <div className="chatHeaderLeft">
            <button
              className="chatBackBtn"
              onClick={onBack}
              title="채팅방 목록으로 돌아가기"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m12 19-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="chatHeaderCenter">
            <h3>{getOtherUserName()}</h3>
          </div>
          <div className="chatHeaderRight">{/* 빈 공간으로 균형 맞추기 */}</div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="chatModuleBody">
        <div className="chatMessagesContainer">
          {messages.length === 0 ? (
            <div className="noChatMessages">
              <p>대화를 시작해보세요!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`chatMessage ${
                  message.senderType === (user.userType === "CUSTOMER" ? "C" : "S")
                    ? "myMessage"
                    : "otherMessage"
                }`}
              >
                <div className="messageContent">
                  <div className="messageText">{message.content}</div>
                  <div className="messageTime">
                    {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 메시지 입력 */}
        <div className="chatInputContainer">
          <div className="chatInputWrapper">
            <textarea
              className="chatMessageInput"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              rows="1"
            />
            <button
              className="chatSendBtn"
              onClick={handleSendMessage}
              disabled={messageInput.trim() === ""}
              title="메시지 전송"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m22 2-7 20-4-9-9-4z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m22 2-11 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
