import React from "react";
import "./FilterBar.css";

export default function FilterBar() {
  return (
    <div className="filter-bar-container">
      <h2 className="filter-title">주문 목록</h2>

      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="주문한 상품을 검색할 수 있어요 !"
        />
      </div>

      <div className="filter-buttons">
        <button className="filter-btn active">6개월</button>
        <button className="filter-btn">2025</button>
        <button className="filter-btn">2024</button>
        <button className="filter-btn">2023</button>
        <button className="filter-btn">2022</button>
      </div>
    </div>
  );
}
