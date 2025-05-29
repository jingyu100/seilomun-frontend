import React from "react";
import useLogin from "../../Hooks/useLogin.js";
import { useNavigate } from "react-router-dom";

export default function Inquiry({ sellerId }) {
  const { user } = useLogin();
  const navigate = useNavigate(); // 페이지 이동을 위해 필요

  const handleNewChatRoom = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const userType = user.userType;
    const userId = user.id;

    if (!userId || !userType) {
      alert("잘못된 사용자 정보입니다.");
      return;
    }

    let postData = {};
    if (userType === "CUSTOMER") {
      postData = { sellerId };
    } else if (userType === "SELLER") {
      postData = { customerId: userId };
    } else {
      alert("잘못된 사용자 유형입니다.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/api/chat/rooms",
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const roomId = response.data.data.roomId;
      console.log("채팅방 생성 성공:", roomId);
      navigate(`/chat/${roomId}`); // 생성 후 채팅방 페이지로 이동
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  return (
    <div
      className="inquiry storeRight-ui"
      onClick={handleNewChatRoom}
      style={{ cursor: user ? "pointer" : "not-allowed", opacity: user ? 1 : 0.5 }}
      title={user ? "1:1 문의" : "로그인 후 이용 가능합니다"}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <p style={{ paddingTop: "3px" }}>1:1문의</p>
        <img
          src="/image/icon/icon-chat2.png"
          alt=""
          style={{
            width: "20%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
}
