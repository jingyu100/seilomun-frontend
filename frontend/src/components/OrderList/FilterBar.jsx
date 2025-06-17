import React from "react";
import "./FilterBar.css";

export default function FilterBar({
                                      searchTerm,
                                      setSearchTerm,
                                      onSearch,
                                      onReset,
                                      isFetching,
                                      currentSearchTerm,
                                      orderCount
                                  }) {

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="filter-bar-container">
            <h2 className="filter-title">주문 목록</h2>

            <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="가게명으로 검색할 수 있어요 !"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <div className="search-buttons">
                    <button
                        className="search-btn"
                        onClick={onSearch}
                        disabled={isFetching}
                    >
                        {isFetching ? "검색중..." : "검색"}
                    </button>
                    <button
                        className="reset-btn"
                        onClick={onReset}
                        disabled={isFetching}
                    >
                        전체
                    </button>
                </div>
            </div>

            {/* 검색 결과 표시 */}
            {currentSearchTerm && (
                <div className="search-result-info">
                    "{currentSearchTerm}" 검색 결과 ({orderCount}개)
                </div>
            )}

            {/*<div className="filter-buttons">*/}
            {/*  <button className="filter-btn active">6개월</button>*/}
            {/*  <button className="filter-btn">2025</button>*/}
            {/*  <button className="filter-btn">2024</button>*/}
            {/*  <button className="filter-btn">2023</button>*/}
            {/*  <button className="filter-btn">2022</button>*/}
            {/*</div>*/}
        </div>
    );
}