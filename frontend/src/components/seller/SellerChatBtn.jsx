import React, { useState, useRef, useEffect } from "react";
import alarm from "../../image/icon/seller_icon/seller_alarm.png";
import "../../css/seller/SellerChatBtn.css";
import ChatViewModule from "../sideBtn/Chatting/ChatViewModule.jsx";

const SellerChatBtn = () => {
  const [isChatModal, setIsChatModal] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleChatModal = () => {
    setIsChatModal((prev) => !prev);
  };

  useEffect(() => {
    const closeModal = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsChatModal(false);
      }
    };

    if (isChatModal) {
      document.addEventListener("mousedown", closeModal);
    } else {
      document.removeEventListener("mousedown", closeModal);
    }

    return () => document.removeEventListener("mousedown", closeModal);
  }, [isChatModal]);

  return (
    <div style={{ position: "fixed", right: "36px", bottom: "36px", zIndex: 200 }}>
      <button
        className="seller-chat-btn"
        title="1:1 문의"
        ref={buttonRef}
        onClick={toggleChatModal}
      >
        <img src={alarm} alt="채팅" className="chat-icon" />
        <span>1:1 문의</span>
      </button>
      {isChatModal && (
        <div ref={modalRef} style={{ position: "absolute", right: 0, bottom: "60px" }}>
          <ChatViewModule />
        </div>
      )}
    </div>
  );
};

export default SellerChatBtn;
