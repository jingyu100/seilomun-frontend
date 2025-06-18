import {useState} from "react";
import "../css/customer/Filter.css";

const Filter = () => {
    const locations = ["용산구", "한남동", "후암동", "이촌동", "한강로동", "이태원동", "이촌제1동"];
    // const categories = [
    //     "과일", "채소", "과자/초코릿/시리얼", "쌀/잡곡", "수산물/건어물",
    //     "커피/음료/차", "생수/음료", "축산/계란", "떡/조리/가공식품",
    //     "유제품/아이스크림", "냉장/냉동/간편요리", "건강 식품",
    //     "분유/어린이식품", "선물세트", "반찬/간편식/대용식"
    // ];

    const [showMoreLocations, setShowMoreLocations] = useState(false);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // return (
    //     <div className="filter-container">
    //         {/* 위치 필터 */}
    //         <div className="filter-section">
    //             <h3>위치</h3>
    //             <p>서울특별시</p>
    //             {locations.slice(0, showMoreLocations ? locations.length : 4).map((loc, index) => (
    //                 <label key={index} className="filter-item">
    //                     <input
    //                         type="radio"
    //                         name="location"
    //                         value={loc}
    //                         checked={selectedLocation === loc}
    //                         onChange={(e) => setSelectedLocation(e.target.value)}
    //                     />
    //                     {loc}
    //                 </label>
    //             ))}
    //             <button onClick={() => setShowMoreLocations(!showMoreLocations)} className="more-btn">
    //                 {showMoreLocations ? "접기" : "더보기"}
    //             </button>
    //         </div>
    //
    //         {/* 카테고리 필터 (라디오 버튼 제거) */}
    //         <div className="filter-section">
    //             <h3>카테고리</h3>
    //             <div className="category-list">
    //                 {/*{categories.slice(0, showMoreCategories ? categories.length : 5).map((cat, index) => (*/}
    //                 {/*    <div key={index} className={`category-item ${selectedCategory === cat ? "selected" : ""}`}  onClick={() => setSelectedCategory(cat)}>*/}
    //                 {/*        {cat}*/}
    //                 {/*    </div>*/}
    //                 {/*))}*/}
    //             </div>
    //             <button onClick={() => setShowMoreCategories(!showMoreCategories)} className="more-btn">
    //                 {showMoreCategories ? "접기" : "더보기"}
    //             </button>
    //         </div>
    //     </div>
    // );
};

export default Filter;