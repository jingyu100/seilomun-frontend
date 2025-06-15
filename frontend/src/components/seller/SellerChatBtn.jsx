import React from "react";
import alarm from "../../image/icon/seller_icon/seller_alarm.png";
import "../../css/seller/SellerChatBtn.css";

const SellerChatBtn = () => {
  return (
    <button className="seller-chat-btn" title="1:1 문의">
      <img src={alarm} alt="채팅" className="chat-icon" />
      <span>1:1 문의</span>
    </button>
  );
};

export default SellerChatBtn;
