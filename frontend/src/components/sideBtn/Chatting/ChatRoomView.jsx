import "../../../css/customer/SideBtnModules.css";
import useLogin from "../../../Hooks/useLogin.js";
import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../../../Context/WebSocketContext.jsx";
import { useChatRooms } from "../../../Context/ChatRoomsContext.jsx";
import api, { API_BASE_URL } from "../../../api/config.js";

export default function ChatRoomView({ chatRoom, onBack }) {
  const { user } = useLogin();
  const { setChatRooms } = useChatRooms();
  const [messageInput, setMessageInput] = useState("");

  // 🔽 스크롤 자동으로 내리기 위한 ref 추가
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // WebSocket 관련 훅 및 함수
  const {
    subscribeToRoom,
    unsubscribeFromRoom,
    leaveRoom,
    sendMessage,
    getRoomMessages,
    setRoomMessages,
  } = useWebSocket();

  // 현재 방의 메시지 목록을 Context 에서 가져옴
  const [messages, setMessages] = useState(() => getRoomMessages(chatRoom.id));

  // 🔽 스크롤을 최하단으로 이동하는 함수 (즉시 이동)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };
  const [otherUserStatus, setOtherUserStatus] = useState({
    isAvailable: false,
    status: "OFFLINE",
  });

  // 상대방 정보 가져오기
  const getOtherUserInfo = () => {
    if (user.userType === "CUSTOMER") {
      return {
        userId: chatRoom.sellerId,
        userType: "SELLER",
      };
    } else {
      return {
        userId: chatRoom.customerId,
        userType: "CUSTOMER",
      };
    }
  };

  // 상대방 온라인 상태 확인
  const checkOtherUserStatus = async () => {
    try {
      const { userId, userType } = getOtherUserInfo();
      const response = await api.get(`/api/users/status/${userType}/${userId}`);

      if (response.data && response.data.data) {
        setOtherUserStatus({
          isAvailable: response.data.data.isAvailable,
          status: response.data.data.status,
        });
      }
    } catch (error) {
      console.error("상대방 상태 확인 실패:", error);
      setOtherUserStatus({
        isAvailable: false,
        status: "OFFLINE",
      });
    }
  };

  // 컴포넌트 마운트 시 상태 확인
  useEffect(() => {
    checkOtherUserStatus();

    // 30초마다 상태 업데이트
    const statusInterval = setInterval(checkOtherUserStatus, 5000);

    return () => clearInterval(statusInterval);
  }, [chatRoom.id]);

  // 상태 텍스트 반환
  const getStatusText = () => {
    const { userType } = getOtherUserInfo();

    if (userType === "CUSTOMER") {
      return otherUserStatus.isAvailable ? "온라인" : "오프라인";
    } else {
      // 판매자의 경우
      switch (otherUserStatus.status) {
        case "OPEN":
          return "영업중";
        case "CLOSED":
          return "영업종료";
        case "BREAK":
          return "브레이크타임";
        default:
          return "상태 확인 불가";
      }
    }
  };

  // 상태 색상 반환
  const getStatusColor = () => {
    if (otherUserStatus.isAvailable) {
      return "#28a745"; // 초록색
    } else {
      return "#6c757d"; // 회색
    }
  };

  // JSX에서 사용할 상태 표시 컴포넌트
  const StatusIndicator = () => (
    <div
      className="userStatusIndicator"
      style={{ display: "flex", alignItems: "center", gap: "5px" }}
    >
      <div
        className="statusDot"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: getStatusColor(),
        }}
      />
      <span style={{ fontSize: "12px", color: "#666" }}>{getStatusText()}</span>
    </div>
  );

  // 🔽 메시지가 변경될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 방 입장 시 과거 메시지 불러오고, 구독, 언마운트 시 구독 해제
  useEffect(() => {
    // 1. 과거 메시지 불러오기
    api
      .get(`/api/chat/rooms/${chatRoom.id}`)
      .then((res) => {
        const history = res.data.data.ok || [];
        setMessages(history);
        setRoomMessages(chatRoom.id, history); // Context에도 저장
        // 🔽 메시지 로드 후 스크롤을 최하단으로 이동
        setTimeout(() => scrollToBottom(), 100);
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

  // 읽음 상태 텍스트 반환 함수
  const getReadStatusText = (message) => {
    // 내가 보낸 메시지만 읽음 상태 표시
    const isMyMessage = message.senderType === (user.userType === "CUSTOMER" ? "C" : "S");

    if (!isMyMessage) return null; // 상대방 메시지는 읽음 상태 표시 안함

    return message.read === "Y" ? "읽음" : "안읽음";
  };

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    // receiverId 결정 (상대방 ID)
    const receiverId =
      user.userType === "CUSTOMER" ? chatRoom.sellerId : chatRoom.customerId;

    // 메시지 전송 (WebSocket)
    const success = sendMessage(chatRoom.id, messageInput, receiverId);

    if (success) {
      setMessageInput("");
      // 🔽 메시지 전송 후 스크롤을 최하단으로 이동
      setTimeout(() => scrollToBottom(), 50);
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 뒤로가기 버튼 클릭 시 마지막 메시지 갱신 후 onBack 호출
  const handleBackWithUpdate = () => {
    // 1. 마지막 메시지 추출
    const lastMsgArr = getRoomMessages(chatRoom.id);
    const lastMsg =
      lastMsgArr && lastMsgArr.length > 0
        ? lastMsgArr[lastMsgArr.length - 1].content
        : "";

    // 2. chatRooms의 해당 방 lastMessage 갱신
    if (lastMsg && setChatRooms) {
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === chatRoom.id ? { ...room, lastMessage: lastMsg } : room
        )
      );
    }

    leaveRoom(chatRoom.id);
    // 3. 해당 채팅방 구독 해제 (추가)
    unsubscribeFromRoom(chatRoom.id);
    console.log(`채팅방 ${chatRoom.id} 구독 해제됨 (뒤로가기)`);

    // 4. 뒤로가기
    onBack();
  };

  return (
    <div className="sideChattModule viewModule">
      {/* 채팅방 헤더 */}
      <div className="chatModuleHead">
        <div className="chatModuleHead-inner">
          <div className="chatHeaderLeft">
            <button
              className="chatBackBtn"
              onClick={handleBackWithUpdate}
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
            <StatusIndicator />
          </div>
          <div className="chatHeaderRight">{/* 빈 공간으로 균형 맞추기 */}</div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="chatModuleBody">
        <div className="chatMessagesContainer" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div className="noChatMessages">
              <p>대화를 시작해보세요!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id || `message-${chatRoom.id}-${index}`}
                className={`chatMessage ${
                  message.senderType === (user.userType === "CUSTOMER" ? "C" : "S")
                    ? "myMessage"
                    : "otherMessage"
                }`}
              >
                <div className="messageContent">
                  <div className="messageText">{message.content}</div>
                  <div className="messageInfo">
                    <div className="messageTime">
                      {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {/* 읽음 상태 표시 - 내가 보낸 메시지만 */}
                    {message.senderType ===
                      (user.userType === "CUSTOMER" ? "C" : "S") && (
                      <div className="messageReadStatus">
                        <span
                          className={`readStatus ${
                            message.read === "Y" ? "read" : "unread"
                          }`}
                        >
                          {getReadStatusText(message)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {/* 🔽 스크롤 타겟용 빈 div */}
          <div ref={messagesEndRef} />
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
