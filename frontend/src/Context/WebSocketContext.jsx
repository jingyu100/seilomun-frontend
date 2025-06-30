import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import useLogin from "../Hooks/useLogin.js";
import api, { API_BASE_URL } from "../../api/config.js";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const { user } = useLogin();
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState({}); // {chatRoomId: [messages]}
  const [activeSubscriptions, setActiveSubscriptions] = useState(new Set());

  // 연결 상태 모니터링 추가
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // 'connecting', 'connected', 'disconnected', 'error'
  const [lastDisconnectReason, setLastDisconnectReason] = useState(null);

  const clientRef = useRef(null);
  const subscriptionsRef = useRef(new Map()); // chatRoomId -> subscription

  const disconnectWebSocket = useCallback((reason = "수동 해제") => {
    console.log("WebSocket 연결 해제:", reason);
    setLastDisconnectReason(reason);

    subscriptionsRef.current.forEach((subscription) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error("구독 해제 실패:", error);
      }
    });
    subscriptionsRef.current.clear();
    setActiveSubscriptions(new Set());

    if (clientRef.current) {
      try {
        clientRef.current.deactivate();
      } catch (error) {
        console.error("클라이언트 해제 실패:", error);
      }
      clientRef.current = null;
    }

    setConnected(false);
    setStompClient(null);
    setConnectionStatus("disconnected");
  }, []);

  const connectWebSocket = useCallback(() => {
    if (!user || connected || clientRef.current) return;

    console.log("WebSocket 연결 시도...", user);
    setConnectionStatus("connecting");

    try {
      const socket = new SockJS(`${API_BASE_URL}/ws`);
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: (frame) => {
          console.log("WebSocket 연결 성공:", frame);
          setConnected(true);
          setStompClient(client);
          setConnectionStatus("connected");
          setLastDisconnectReason(null);
        },
        onStompError: (frame) => {
          console.error("STOMP 오류:", frame);
          setConnected(false);
          setConnectionStatus("error");
          setLastDisconnectReason("STOMP 오류");
        },
        onDisconnect: (frame) => {
          console.log("WebSocket 연결 해제됨", frame);
          setConnected(false);
          setStompClient(null);
          setConnectionStatus("disconnected");

          // 연결 해제 이유 판단
          if (!user) {
            setLastDisconnectReason("로그아웃");
          } else if (frame && frame.reason) {
            setLastDisconnectReason(frame.reason);
          } else {
            setLastDisconnectReason("알 수 없는 이유");
          }
        },
        onWebSocketError: (error) => {
          console.error("WebSocket 오류:", error);
          setConnectionStatus("error");
          setLastDisconnectReason("네트워크 오류");
        },
        connectHeaders: {
          userId: user.id.toString(),
          userType: user.userType === "CUSTOMER" ? "C" : "S",
          userName: user.nickname || "익명사용자",
        },
      });

      client.activate();
      clientRef.current = client;
    } catch (error) {
      console.error("WebSocket 연결 실패:", error);
      setConnectionStatus("error");
      setLastDisconnectReason("연결 실패");
    }
  }, [user, connected]);

  const subscribeToRoom = useCallback(
    (chatRoomId) => {
      if (!stompClient || !connected || activeSubscriptions.has(chatRoomId)) return;

      console.log(`채팅방 ${chatRoomId} 구독 시작`);

      try {
        const subscription = stompClient.subscribe(
          `/queue/messages/${chatRoomId}`,
          (message) => {
            const chatMessage = JSON.parse(message.body);
            console.log("수신된 메시지:", chatMessage);

            // 상대방 입장 알림 처리
            if (chatMessage.type === "JOIN" && chatMessage.content === "USER_ENTER") {
              console.log("상대방이 채팅방에 입장했습니다!");

              // 내가 보낸 안읽은 메시지들을 읽음으로 변경
              const myUserType = user.userType === "CUSTOMER" ? "C" : "S";

              setMessages((prev) => {
                const currentMessages = prev[chatRoomId] || [];
                const updatedMessages = currentMessages.map((msg) => {
                  // 내가 보낸 메시지이면서 안읽음인 경우 읽음으로 변경
                  if (msg.senderType === myUserType && msg.read === "N") {
                    return { ...msg, read: "Y" };
                  }
                  return msg;
                });

                return {
                  ...prev,
                  [chatRoomId]: updatedMessages,
                };
              });

              // 입장 알림은 채팅 목록에 추가하지 않음 (알림만 처리)
              return;
            }

            //  일반 채팅 메시지 처리
            setMessages((prev) => ({
              ...prev,
              [chatRoomId]: [...(prev[chatRoomId] || []), chatMessage],
            }));
          },
          {
            userId: user.id.toString(),
            userType: user.userType === "CUSTOMER" ? "C" : "S",
          }
        );

        subscriptionsRef.current.set(chatRoomId, subscription);
        setActiveSubscriptions((prev) => new Set([...prev, chatRoomId]));

        // 채팅방 입장
        const enterMessage = {
          type: "JOIN",
          chatRoomId: parseInt(chatRoomId),
          senderId: user.id,
          senderType: user.userType === "CUSTOMER" ? "C" : "S",
        };
        stompClient.publish({
          destination: "/app/chat.enterRoom",
          body: JSON.stringify(enterMessage),
        });
      } catch (error) {
        console.error("구독 실패:", error);
      }
    },
    [stompClient, connected, user, activeSubscriptions]
  );

  const unsubscribeFromRoom = useCallback((chatRoomId) => {
    const subscription = subscriptionsRef.current.get(chatRoomId);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(chatRoomId);
      setActiveSubscriptions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(chatRoomId);
        return newSet;
      });
      console.log(`채팅방 ${chatRoomId} 구독 해제됨`);
    }
  }, []);

  const sendMessage = useCallback(
    (chatRoomId, content = null, receiverId = null) => {
      if (!stompClient || !connected || !content.trim()) return false;

      const message = {
        type: "CHAT",
        chatRoomId: parseInt(chatRoomId),
        senderId: user.id,
        receiverId: receiverId,
        senderName: user.nickname || "익명사용자",
        senderType: user.userType === "CUSTOMER" ? "C" : "S",
        content: content.trim(),
      };

      try {
        stompClient.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(message),
        });
        return true;
      } catch (error) {
        console.error("메시지 전송 실패:", error);
        return false;
      }
    },
    [stompClient, connected, user]
  );

  const getRoomMessages = useCallback(
    (chatRoomId) => {
      return messages[chatRoomId] || [];
    },
    [messages]
  );

  const leaveRoom = useCallback(
    (chatRoomId) => {
      if (!stompClient || !connected) return;

      try {
        // 채팅방 나가기 메시지 전송
        const leaveMessage = {
          type: "LEAVE",
          chatRoomId: parseInt(chatRoomId),
          senderId: user.id,
          senderType: user.userType === "CUSTOMER" ? "C" : "S",
        };

        stompClient.publish({
          destination: "/app/chat.leaveRoom", // 새로운 엔드포인트
          body: JSON.stringify(leaveMessage),
        });

        console.log(`채팅방 ${chatRoomId} 나가기 메시지 전송됨`);
      } catch (error) {
        console.error("채팅방 나가기 메시지 전송 실패:", error);
      }
    },
    [stompClient, connected, user]
  );

  const setRoomMessages = useCallback((chatRoomId, messageList) => {
    setMessages((prev) => ({
      ...prev,
      [chatRoomId]: messageList || [],
    }));
  }, []);

  // 페이지 언로드 감지
  useEffect(() => {
    const handleBeforeUnload = () => {
      disconnectWebSocket("페이지 종료");
    };

    const handleUnload = () => {
      disconnectWebSocket("페이지 종료");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [disconnectWebSocket]);

  useEffect(() => {
    if (user && !connected && !clientRef.current) {
      connectWebSocket();
    } else if (!user && (connected || clientRef.current)) {
      disconnectWebSocket("로그아웃");
    }
  }, [user, connected, connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    return () => {
      disconnectWebSocket("컴포넌트 언마운트");
    };
  }, [disconnectWebSocket]);

  const value = {
    connected,
    connectionStatus,
    lastDisconnectReason,
    activeSubscriptions,
    connectWebSocket,
    disconnectWebSocket,
    subscribeToRoom,
    unsubscribeFromRoom,
    leaveRoom,
    sendMessage,
    getRoomMessages,
    setRoomMessages,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
