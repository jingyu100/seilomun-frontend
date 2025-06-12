import React from "react";

const EmptyFavoriteList = () => {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏪</div>

      <p
        style={{
          fontSize: "16px",
          color: "#666",
          lineHeight: "1.5",
          marginBottom: "24px",
        }}
      >
        마음에 드는 매장을 즐겨찾기에 추가해보세요!
      </p>
      <div
        style={{
          background: "#f8f9fa",
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            margin: "0",
          }}
        >
          💡 매장 페이지에서 ⭐ 버튼을 눌러 즐겨찾기에 추가할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default EmptyFavoriteList;
