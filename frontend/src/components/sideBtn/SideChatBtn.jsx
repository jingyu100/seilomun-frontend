import React, {useState, useRef, useEffect} from "react";
import ChatViewModule from "./Chatting/ChatViewModule.jsx";
import {useChatRooms} from "../../Context/ChatRoomsContext.jsx";
import useLogin from "../../Hooks/useLogin.js";
import { useNavigate } from "react-router-dom";

const SideChatBtn = () => {
    const [isChatModal, setisChatModal] = useState(false);
    const modalRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    const {user, isLoggedIn} = useLogin();
    const {chatRooms} = useChatRooms();

    const toggleAlarmModal = () => {
        setisChatModal((prev) => !prev);
    };

    useEffect(() => {
        const closeModal = (e) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setisChatModal(false);
            }
        };

        if (isChatModal) {
            document.addEventListener("mousedown", closeModal);
        } else {
            document.removeEventListener("mousedown", closeModal);
        }

        return () => document.removeEventListener("mousedown", closeModal);
    }, [isChatModal]);

    const unreadCount = user
        ? chatRooms.reduce((acc, room) => acc + (room.unreadCount || 0), 0)
        : 0;

    return (
        <div>
            <a
                href="#"
                role="button"
                className="sideMenuBtn"
                ref={buttonRef}
                onClick={(e) => {
                    if(isLoggedIn) {
                        e.preventDefault();
                        toggleAlarmModal();
                    } else {
                        navigate("/login");
                    }
                }}
            >
                <em className="iconCount" id="chat-cnt">
                    {unreadCount}
                </em>
                <img
                    src="/image/icon/icon-chat2.png"
                    alt="chat"
                    className="sideBtnIcon"
                    id="chatIcon"
                />
            </a>
            {isChatModal && (
                <div ref={modalRef}>
                    <ChatViewModule/>
                </div>
            )}
        </div>
    );
};

export default SideChatBtn;
