import React, { useState, useRef, useEffect } from "react";
import AlarmViewModule from "./AlarmViewModule";

const SideAlarmBtn = ({
    notifications, 
    markAllAsRead,
    markAsRead,
}) => {
    const [isAlarmModal, setisAlarmModal] = useState(false);
    const modalRef = useRef(null);
    const buttonRef = useRef(null); // 버튼 참조 추가

    const unreadNotifications = notifications.filter(noti => noti.isRead !== "Y");

    const toggleAlarmModal = () => {
        setisAlarmModal(prev => !prev);
    };

    useEffect(() => {
        const closeModal = (e) => {
            if (
                modalRef.current && !modalRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)
            ) {
                setisAlarmModal(false);
            }
        };

        if (isAlarmModal) {
            document.addEventListener("mousedown", closeModal);
        } else {
            document.removeEventListener("mousedown", closeModal);
        }

        return () => document.removeEventListener("mousedown", closeModal);
    }, [isAlarmModal]);

    return (
        <div>
            <a 
                href="#" 
                role="button" 
                className="sideMenuBtn" 
                ref={buttonRef} // 버튼에 ref 추가
                onClick={(e) => {
                    e.preventDefault();
                    toggleAlarmModal();
                }}
            >
                <em className="iconCount" id="alarm-cnt">0</em>
                <img src="/image/icon/icon-bell.png" alt="alarm"
                    className="sideBtnIcon"
                />
            </a>
            {isAlarmModal && (
                <div ref={modalRef}>
                    <AlarmViewModule />
                </div>
            )}
        </div>
    );
};

export default SideAlarmBtn;
