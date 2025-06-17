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
                    <div className="notification-images">
                    <h4>공지 이미지</h4>
                    <div className="image-grid">
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