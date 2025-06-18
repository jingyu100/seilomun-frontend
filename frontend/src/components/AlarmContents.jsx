import React from "react";
import "../css/customer/SideBtnModules.css";

export default function AlarmContents({ 
    notifications, 
    markAllAsRead,
    markAsRead,
    isLoggedIn,
}) {

    const unreadNotifications = notifications.filter(noti => noti.isRead !== "Y");

    return (
        <div className="headAlarm">
            <div className="headAlarm-inner">
                <div className="headAlarm-head">
                    <div className="headAlarm-title">알림</div>
                </div>
                <main>
                {!isLoggedIn ? (
                    <div className="noAlarm">
                        <li>로그인 후 알림을 확인할 수 있습니다.</li>
                    </div>
                ) : (
                    <>
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
                                <div className="headAlarm-message">
                                    <li
                                    className="headAlarm-subtitle"
                                    style={{
                                        fontWeight: noti.isRead === "N" ? "bold" : "normal",
                                    }}
                                    >
                                    {noti.content}
                                    </li>
                                    <small className="headAlarm-date">
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
                    </>
                )}
                </main>
            </div>
        </div>
    );
}
