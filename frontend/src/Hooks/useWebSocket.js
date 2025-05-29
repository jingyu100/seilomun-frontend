import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Client } from "@stomp/stompjs";

export default function useWebSocket(currentUserId, currentUserType) {
  const { id: chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const clientRef = useRef(null);

  // 1. 기존 채팅 불러오기
  useEffect(() => {
    if (!chatRoomId) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost/api/chat/rooms/${chatRoomId}`);
        const history = response.data.data.ok;
        setMessages(history || []);
      } catch (error) {
        console.error("채팅 내역 불러오기 실패:", error);
      }
    };

    fetchChatHistory();
  }, [chatRoomId]);

  // 2. WebSocket 연결 및 구독
  useEffect(() => {
    if (!chatRoomId || !currentUserId || !currentUserType) return;

    const client = new Client({
      brokerURL: "ws://localhost/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("웹소켓 연결 성공");
        setConnected(true);

        // 채팅방 구독
        client.subscribe(`/topic/chat/room/${chatRoomId}`, (message) => {
          const received = JSON.parse(message.body);
          console.log("수신된 메시지:", received);
          setMessages((prev) => [...prev, received]);
        });

        // 입장 메시지 전송
        client.publish({
          destination: "/app/chat.enterRoom",
          body: JSON.stringify({
            chatRoomId: Number(chatRoomId),
            senderId: currentUserId,
            senderType: currentUserType,
            messageType: "ENTER",
          }),
        });
      },
      onStompError: (frame) => {
        console.error("STOMP 오류:", frame);
      },
    });

    client.activate();
    clientRef.current = client;
    setStompClient(client);

    return () => {
      client.deactivate();
      setConnected(false);
      console.log("웹소켓 연결 종료");
    };
  }, [chatRoomId, currentUserId, currentUserType]);

  // 3. 메시지 전송 함수
  const sendMessage = (messageText) => {
    if (!stompClient || !connected) return;

    const message = {
      chatRoomId: Number(chatRoomId),
      senderId: currentUserId,
      senderType: currentUserType,
      content: messageText,
      messageType: "TALK",
    };

    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    });
  };

  return {
    messages,
    sendMessage,
    connected,
  };
}
