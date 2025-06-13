import React from "react";
import "../../css/customer/ProductList.css"; 
import { useState } from "react";

export default function ProductFilter({ setSortType }) {
    // 기본 정렬 선택 상태
    const [selectedSort, setSelectedSort] = useState("BASIC");

    const handleSortChange = (sortKey) => {
        setSelectedSort(sortKey);
        setSortType(sortKey);
    };

    const sortOptions = [
        { label: "기본 순", key: "BASIC" },
        { label: "최신 순", key: "LATEST" },
        { label: "낮은 가격 순", key: "LOW_PRICE" },
        { label: "높은 가격 순", key: "HIGH_PRICE" },
        { label: "할인율 순", key: "EXPIRING" },
        // { label: "별점 높은 순", key: "HIGH_RATING" },
        // { label: "별점 낮은 순", key: "LOW_RATING" },
    ];

    const sortOptions2 = [
        { label: "기본 순", key: "BASIC" },
        { label: "최신 순", key: "LATEST" },
        { label: "낮은 가격 순", key: "LOW_PRICE" },
        { label: "높은 가격 순", key: "HIGH_PRICE" },
        { label: "할인율 순", key: "EXPIRING" },
        { label: "별점 높은 순", key: "HIGH_RATING" },
        { label: "별점 낮은 순", key: "LOW_RATING" },
    ];

    return (
        // <div className="product-filter-container">
        //     <select className="product-filter">
        //     <option>기본 순</option>
        //     <option>최신 순</option>
        //     <option>별점높은 순</option>
        //     <option>별점낮은 순</option>
        //     <option>가격높은 순</option>
        //     <option>가격낮은 순</option>
        //     </select>
        // </div>
        <div className="productFilter">
            <ul className="productSortList">
            {sortOptions.map(({ label, key }, index) => (
                    <li
                        key={key}
                        className="productSortList-item"
                        onClick={() => handleSortChange(key)}
                    >
                        <div className="productSortList-wrap-text">
                            <div
                                className="productSortList-text"
                                style={{
                                    fontWeight: selectedSort === key ? "bold" : "normal",
                                    color: selectedSort === key ? "#000" : "#555"
                                }}
                            >
                                {label}
                            </div>
                        </div>
                        {index < sortOptions.length - 1 && (
                            <button type="button" className="productSortList-button" />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}