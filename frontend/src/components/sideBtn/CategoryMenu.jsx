// src/components/sideBtn/CategoryMenu.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CategoryMenu = ({ isOpen, onClose, onCategorySelect, buttonRef }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const categoryData = {
    매장: [
      { id: 1, name: "편의점", enum: "CONVENIENCE_STORE", icon: "🏪" },
      { id: 2, name: "마트", enum: "MART", icon: "🛒" },
      { id: 3, name: "빵집", enum: "BAKERY", icon: "🥖" },
      { id: 4, name: "식당", enum: "RESTAURANT", icon: "🍽️" },
    ],
    식품: [
      { id: 1, name: "과일", enum: "FRUIT", icon: "🍎" },
      { id: 2, name: "채소", enum: "VEGETABLE", icon: "🥬" },
      { id: 3, name: "과자/초콜릿/시리얼", enum: "STACK", icon: "🍪" },
      { id: 4, name: "쌀/잡곡", enum: "CEREALS", icon: "🍚" },
      { id: 5, name: "수산물/건어물", enum: "SEAFOOD_DRIEDFISH", icon: "🐟" },
      { id: 6, name: "커피/원두/차", enum: "CAFE", icon: "☕" },
      { id: 7, name: "생수/음료", enum: "WATER_DRINKS", icon: "🥤" },
      { id: 8, name: "축산/계란", enum: "LIVESTOCK_EGGS", icon: "🥩" },
      { id: 9, name: "면/통조림/가공식품", enum: "PROCESSED_FOOD", icon: "🥫" },
      { id: 10, name: "유제품", enum: "DAIRY_FOOD", icon: "🥛" },
      { id: 11, name: "아이스크림", enum: "ICE_CREAM", icon: "🍦" },
      { id: 12, name: "냉장/냉동/간편요리", enum: "FROZEN_FOOD", icon: "🧊" },
      { id: 13, name: "건강식품", enum: "HEALTH_FOOD", icon: "💊" },
      { id: 14, name: "분유/어린이식품", enum: "CHILDREN_FOOD", icon: "🍼" },
      { id: 15, name: "선물세트관", enum: "GIFT_SET", icon: "🎁" },
      { id: 16, name: "반찬/간편식/대용식", enum: "SIDE_DISH", icon: "🍱" },
      { id: 17, name: "빵", enum: "BRAD", icon: "🍞" }, //
    ],
  };

  // 버튼 위치에 따라 드롭다운 위치 계산
  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.bottom + window.scrollY + 5, // 버튼 아래 5px 간격
        left: buttonRect.left + window.scrollX,
      });
    }
  }, [isOpen, buttonRef]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSelect = (mainCat, item) => {
    // 기존 콜백 호출 (부모 컴포넌트에서 필요한 경우)
    if (onCategorySelect) {
      const payload = {
        type: mainCat === "매장" ? "SELLER_CATEGORY" : "PRODUCT_CATEGORY",
        id: item.id,
        name: item.name,
        enum: item.enum,
      };
      onCategorySelect(payload);
    }

    // 카테고리에 따라 적절한 페이지로 navigate
    if (mainCat === "매장") {
      // 매장 카테고리 선택 시 - 판매자 검색 페이지로 이동
      navigate(`/sellers?category=${item.enum}`);
      console.log("가게 : ", item.enum);
    } else {
      // 식품 카테고리 선택 시 - 상품 검색 페이지로 이동
      navigate(`/new?categoryId=${item.id}&filterType=ALL`);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="search-dropdown category-dropdown"
      ref={menuRef}
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        width: "280px",
        maxHeight: "500px",
        overflowY: "auto",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "0",
      }}
    >
      <div className="search-section" style={{ padding: "16px" }}>
        {/* 매장 카테고리 */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "8px",
              padding: "8px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            🏪 매장
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "4px",
            }}
          >
            {categoryData.매장.map((item) => (
              <div
                key={`매장-${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect("매장", item);
                }}
                style={{
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                  ":hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.borderColor = "#e5e7eb";
                }}
              >
                <span style={{ fontSize: "14px" }}>{item.icon}</span>
                <span style={{ fontWeight: "500" }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 식품 카테고리 */}
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "8px",
              padding: "8px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            🍎 식품
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "4px",
            }}
          >
            {categoryData.식품.map((item) => (
              <div
                key={`식품-${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect("식품", item);
                }}
                style={{
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.borderColor = "#e5e7eb";
                }}
              >
                <span style={{ fontSize: "14px" }}>{item.icon}</span>
                <span style={{ fontWeight: "500" }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
