import ProductsAlarm from '../ProductsAlarm.jsx';
import React, { useState } from 'react';

export default function AlarmViewModule({
    notifications, 
    markAllAsRead,
    markAsRead,
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
        <div className="headAlarm">
            <div className="headAlarm-inner">
                <header className="headAlarm-head">
                    <div className="headAlarm-title">알림</div>
                </header>
                <main>
                    {unreadNotifications.length > 0 && (
                        <div className="headAlarm-control" onClick={markAllAsRead}>
                            전체 읽음 처리
                        </div>
                    )}
                    <div>                        
                        {unreadNotifications.length === 0 ? (
                            <div className="noAlarm">
                                <li>알림이 없습니다.</li>
                            </div>
                        ) : (
                            unreadNotifications.map((noti) => (
                                <div key={noti.id} className="headAlarm-main">
                                    <div className="headAlarm-content">
                                        <a href="#">
                                            <div>
                                                <li
                                                    style={{
                                                        fontWeight:
                                                            noti.isRead === "N"
                                                                ? "bold"
                                                                : "normal",
                                                    }}
                                                >
                                                    {noti.content}
                                                </li>
                                                <small>
                                                    {new Date(noti.createdAt).toLocaleString()}
                                                </small>
                                            </div>
                                        </a>
                                    </div>
                                    <div
                                        className="headAlarm-read"
                                        onClick={() => markAsRead(noti.id)}
                                    >
                                        읽음
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}


