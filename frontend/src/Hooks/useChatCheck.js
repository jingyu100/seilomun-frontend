import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function useChatCheck() {
   const {id} = useParams();
   const [chatCheck, setchatCheck] = useState(null);

  useEffect(() => {
    if (!id) return;

    const chattingCheck = async () => {
      try {
        const response = await axios.get(`http://3.36.70.70/api/chat/rooms/${chatroomid}`);
        console.log("API 응답:", response.data);

        const chatRoomDto = response.data.data.CUSTOMER;

        if (!chatRoomDto) return;

        chattingCheck({
            chatRoomDto,
            chatMessageDto: null,
        });

      } catch (error) {
        console.error("API 요청 실패:", error);
        chattingCheck(null);
      }
    };

    chattingCheck();
  }, [id]);

  return { chatCheck };
}