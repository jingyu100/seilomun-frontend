import ProductsAlarm from '../ProductsAlarm.jsx';
import React, { useState } from 'react';

export default function AlarmViewModule({
    notifications, 
    markAllAsRead,
    markAsRead,
    isLoggedIn,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const unreadNotifications = notifications.filter(noti => noti.isRead !== "Y");

    return (
        <div className="sideAlarmModule viewModule">
            <div className="moduleFrame2">
                <div className="sideModuleTitle">
                    알림
                </div>
                <main>
                {!isLoggedIn ? (
                    <div className="noAlarm">
                    <li>로그인 후 알림을 확인할 수 있습니다.</li>
                    </div>
                ) : (
                    <>
                    {unreadNotifications.length > 0 && (
                        <div className="sideAlarm-control" onClick={markAllAsRead}>
                        전체 읽음 처리
                        </div>
                    )}
                    <div className="sideAlarm-list">
                        {unreadNotifications.length === 0 ? (
                        <div className="noAlarm">
                            <li>알림이 없습니다.</li>
                        </div>
                        ) : (
                        unreadNotifications.map((noti) => (
                            <div key={noti.id} className="sideAlarm-main">
                            <div className="sideAlarm-content">
                                <a href="#">
                                <div>
                                    <li
                                    className="sideAlarm-title"
                                    style={{
                                        fontWeight: noti.isRead === "N" ? "bold" : "normal",
                                    }}
                                    >
                                    {noti.content}
                                    </li>
                                    <small className="sideAlarm-date">
                                    {new Date(noti.createdAt).toLocaleString()}
                                    </small>
                                </div>
                                </a>
                            </div>
                            <div
                                className="sideAlarm-read"
                                onClick={() => markAsRead(noti.id)}
                            >
                                읽음
                            </div>
                            </div>
                        ))
                        )}
                    </div>
                    </>
                )}
                </main>
            </div>
        </div>
    );
}


