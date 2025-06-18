import React from "react";

export default function StoreMiniInfo({ address, addressDetail, phone, minOrderAmount, deliveryFees }) {
  const validDeliveryFees = (deliveryFees || [])
    .filter((fee) => fee.deleted === false)
    .sort((a, b) => a.ordersMoney - b.ordersMoney);

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
        <p className="storeInfo-headtitle">매장 주소</p>
        <li>{address} ({addressDetail})</li>
      </ul>
      <ul>
        <p className="storeInfo-headtitle">전화번호</p>
        <li>{phone}</li>
      </ul>

      <div style={{ display: "flex", gap: "30px" }}>
        <ul>
          <p className="storeInfo-headtitle">최소 배달 주문 금액</p>
          {validDeliveryFees.length > 0 ? (
            validDeliveryFees.map((fee, idx) => (
              <li key={idx}>
                {fee.ordersMoney.toLocaleString()}원 이상
              </li>
            ))
          ) : (
            <li>배달 없음</li>
          )}
        </ul>

        <ul>
          <p className="storeInfo-headtitle">배달비</p>
          {validDeliveryFees.length > 0 ? (
            validDeliveryFees.map((fee, idx) => (
              <li key={idx}>
                {fee.deliveryTip.toLocaleString()}원
              </li>
            ))
          ) : (
            <li></li>
          )}
        </ul>
      </div>
    </div>
  );
}
