import React, { useState, useRef, useEffect } from "react";
import "../../css/customer/Store.css";

export default function StoreMiniInfo ({
    notification,
    notificationPhotos = [],
}) {

    console.log("🔍 공지 이미지:", notificationPhotos);

    
    return (
        <div className="storeInfoMini">
            <div className="storeInfo-head">
                <h3>안내 및 혜택</h3>
            </div>
            <div className="storeInfo-body">
                <div className="storeInfo-content">
                {notificationPhotos.length > 0 && (
                    <div className="storeInfo-inner">
                        <h2 style={{
                            fontSize: "22px",                            
                        }}>공지사항</h2>
                        <p style={{
                            fontSize: "16px",
                        }}>{notification}</p>
                        <div className="notification-images">
                            {notificationPhotos.map((url, idx) => (
                            <img
                                key={idx}
                                src={url}
                                alt={`공지 이미지 ${idx + 1}`}
                                className="notification-image"
                            />
                            ))}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}