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

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const { user } = useLogin();
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState({}); // {chatRoomId: [messages]}
  const [activeSubscriptions, setActiveSubscriptions] = useState(new Set());

  const clientRef = useRef(null);
  const subscriptionsRef = useRef(new Map()); // chatRoomId -> subscription

  const disconnectWebSocket = useCallback(() => {
    console.log("WebSocket 연결 해제");

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
  }, []);

  const connectWebSocket = useCallback(() => {
    if (!user || connected || clientRef.current) return;

    console.log("WebSocket 연결 시도...", user);

    try {
      const socket = new SockJS("http://localhost/ws");
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: (frame) => {
          console.log("WebSocket 연결 성공:", frame);
          setConnected(true);
          setStompClient(client);
        },
        onStompError: (frame) => {
          console.error("STOMP 오류:", frame);
          setConnected(false);
        },
        onDisconnect: () => {
          console.log("WebSocket 연결 해제됨");
          setConnected(false);
          setStompClient(null);
        },
        connectHeaders: {
          userType: user.userType === "CUSTOMER" ? "C" : "S",
          userName: user.nickname || "익명사용자",
        },
      });

      client.activate();
      clientRef.current = client;
    } catch (error) {
      console.error("WebSocket 연결 실패:", error);
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

            setMessages((prev) => ({
              ...prev,
              [chatRoomId]: [...(prev[chatRoomId] || []), chatMessage],
            }));
          },
          {
            userType: user.userType === "CUSTOMER" ? "C" : "S",
          }
        );

        subscriptionsRef.current.set(chatRoomId, subscription);
        setActiveSubscriptions((prev) => new Set([...prev, chatRoomId]));

        // 채팅방 입장
        const enterMessage = {
          type: "JOIN",
          chatRoomId: parseInt(chatRoomId),
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
    }
  }, []);

  const sendMessage = useCallback(
    (chatRoomId, content = null) => {
      if (!stompClient || !connected || !content.trim()) return false;

      const message = {
        type: "CHAT",
        chatRoomId: parseInt(chatRoomId),
        senderId: user.id,
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

  const setRoomMessages = useCallback((chatRoomId, messageList) => {
    setMessages((prev) => ({
      ...prev,
      [chatRoomId]: messageList || [],
    }));
  }, []);

  useEffect(() => {
    if (user && !connected && !clientRef.current) {
      connectWebSocket();
    } else if (!user && (connected || clientRef.current)) {
      disconnectWebSocket();
    }
  }, [user, connected, connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  const value = {
    connected,
    activeSubscriptions,
    connectWebSocket,
    disconnectWebSocket,
    subscribeToRoom,
    unsubscribeFromRoom,
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
