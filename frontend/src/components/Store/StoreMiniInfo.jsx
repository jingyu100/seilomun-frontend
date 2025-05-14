import React from "react";

export default function StoreMiniInfo({
    address,
    phone,
    minOrderAmount,
    deliveryFee
}) {
    const parsedDeliveryFee = parseInt(deliveryFee) || 0;

    return (
        <div
            className="storeMiniInfo"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            <ul>
                <p>매장 주소</p>
                <li>{address || "정보 없음"}</li>
            </ul>
            <ul>
                <p>전화번호</p>
                <li>{phone || "정보 없음"}</li>
            </ul>
            <div style={{ display: "flex", gap: "15px" }}>
                <ul>
                    <p>최소 배달 주문 금액</p>
                    <li>{minOrderAmount || "정보 없음"}</li>
                </ul>
                <ul>
                    <p>배달비</p>
                    <li>{parsedDeliveryFee.toLocaleString()}원</li>
                </ul>
            </div>
        </div>
    );
}
