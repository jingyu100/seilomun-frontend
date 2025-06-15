import { useRef } from "react";
import { useState } from "react";
import "../../css/seller/Seller_newstoreRegistration.css";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import seller_camera from "../../image/icon/seller_icon/seller_camera.png";

const Seller_newstoreRegistration = () => {
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [amountInputs, setAmountInputs] = useState([{ min: "", max: "", fee: "" }, ]);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const noticeImageRef = useRef(null);
  const storeImageRef = useRef(null);
  const [description, setDescription] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeTime, setStoreTime] = useState("");
  const [noticeImage, setNoticeImage] = useState(null);

// 매장 사진
const handleStoreImageClick = () => {
    storeImageRef.current.click();
  };
  
  const handleStoreImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("매장 사진 선택됨:", file.name);
    }
  };

//배달주문금액
const handleAddInput = () => {
    setAmountInputs([...amountInputs, { min: "", max: "", fee: "" }]);
  };

  const handleRemoveInput = () => {
    if (amountInputs.length > 1) {
      setAmountInputs(amountInputs.slice(0, -1));
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...amountInputs];
    updated[index][field] = value;
    setAmountInputs(updated);
  };

//매장 카테고리
const categories = ["편의점", "마트", "빵집", "식당"];

const handleSelect = (category) => {
  setSelectedCategory(category);
  setIsOpen(false);
};


// 공지 사진
const handleImageClick = () => {
    noticeImageRef.current.click();
  };

const handleNoticeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNoticeImage(imageUrl);
      console.log("공지 이미지 선택됨:", file.name);
    }
  };

  return (
    <div>
      <div className="Seller-Header">
        <Seller_Header />
      </div>
      <div className="Seller-newstoreRegistration">
        <h2 className="seller-new-form-title">매장 정보 설정</h2>
        <div className="store-form-line" />

        {/* 매장이름 */}
        <div className="store-form-group-11">
          <label className="store-label">매장이름</label>
          <input
            type="text"
            className="store-input-1"
            placeholder="매장이름을 입력해주세요"
          />
          <button className="store-button-1">등록</button>
          <button className="store-button-2">변경</button>
        </div>

        {/* 매장 설명 */}
        <div className="store-form-group-22">
          <label className="store-label">매장 설명</label>
          <textarea
            className="store-textarea-1"
            placeholder="500자 이내로 입력해주세요"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
          />
          <button className="store-button-3">등록</button>
          <button className="store-button-4">변경</button>
        </div>

        {/* 매장 사진 */}
        <div className="store-form-group-33">
          <label className="store-label">매장 사진</label>
          <div className="image-upload-box" onClick={handleStoreImageClick}>
            <img
              src={seller_camera}
              alt="카메라 아이콘"
              className="camera-icon"
            />
            <input
              type="file"
              accept="image/*"
              ref={storeImageRef}
              onChange={handleStoreImageChange}
              style={{ display: "none" }}
            />
          </div>
          <button className="store-button-5">등록</button>
          <button className="store-button-6">변경</button>
        </div>


        {/* 배달 여부 확인 */}
        <div className="store-form-group-44">
          <label className="store-label">배달여부 확인</label>

        <label className="delivery-radio">
            <input
            type="radio"
            name="delivery"
            value="ACCEPT"
            checked={deliveryStatus === "ACCEPT"}
            onChange={() => setDeliveryStatus("ACCEPT")}
            />
            배달 수락
        </label>

        <label className="delivery-radio">
            <input
            type="radio"
            name="delivery"
            value="DECLINE"
            checked={deliveryStatus === "DECLINE"}
            onChange={() => setDeliveryStatus("DECLINE")}
            />
            배달 거절
        </label>
        </div>

        {/* 배달 주문 금액 */}
        <div className="store-form-group-55">
          <label className="store-label">배달 주문 금액</label>

          <div className="delivery-amount-container">
        {amountInputs.map((input, index) => (
          <div className="delivery-input-group" key={index}>
            <input
              type="text"
              placeholder="14,900원"
              value={input.min}
              onChange={(e) =>
                handleChange(index, "min", e.target.value)
              }
              className="delivery-input"
            />
            <span>~</span>
            <input
              type="text"
              placeholder="19,900원"
              value={input.max}
              onChange={(e) =>
                handleChange(index, "max", e.target.value)
              }
              className="delivery-input"
            />
            <input
              type="text"
              placeholder="2,000원"
              value={input.fee}
              onChange={(e) =>
                handleChange(index, "fee", e.target.value)
              }
              className="delivery-input"
            />
          </div>
        ))}

        <div className="amount-button-group">
          <button className="amount-gray-btn" onClick={handleAddInput}>추가</button>
          <button className="amount-gray-btn" onClick={handleRemoveInput}>삭제</button>
        </div>

        <label className="free-delivery-checkbox">
          <input
            type="checkbox"
            checked={freeDelivery}
            onChange={(e) => setFreeDelivery(e.target.checked)}
          />
          <span>무료 배달</span>
        </label>
      </div>

          <button className="store-button-7">등록</button>
          <button className="store-button-8">변경</button>
        </div>

        {/* 매장 카테고리 */}
        <div className="store-form-group-66">
          <label className="store-label">매장 카테고리</label>
          <div className="category-dropdown">
        <button
          type="button"
          className="category-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedCategory || "선택"} <span className="arrow">▼</span>
        </button>

        {isOpen && (
          <ul className="category-list">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => handleSelect(cat)}
                className="category-item"
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>
        </div>

        {/* 영업시간 */}
        <div className="store-form-group-77">
          <label className="store-label">영업시간</label>
            <textarea
            className="store-time-textarea"
            value={storeTime}
            onChange={(e) => setStoreTime(e.target.value)}
            placeholder={
                `ex) 월요일 09:00 ~ 18:00\n` +
                `화요일 09:00 ~ 18:00\n` +
                `수요일 09:00 ~ 18:00\n` +
                `목요일 09:00 ~ 18:00\n` +
                `금요일 09:00 ~ 18:00\n` +
                `토요일 09:00 ~ 18:00\n` +
                `일요일 09:00 ~ 18:00`
            }
            />
          <button className="store-button-9">등록</button>
          <button className="store-button-a">변경</button>
        </div>

        {/* 배달 가능 지역 */}
        <div className="store-form-group-88">
          <label className="store-label">배달 가능 지역</label>

          <input
                type="text"
                className="delivery-region-input"
                placeholder="ex) 복현동, 원대동, 침산동"
            />

          <button className="store-button-b">등록</button>
          <button className="store-button-c">변경</button>
        </div>

        {/* 가게 공지 사진 및 설명 */}
        <div className="store-form-group-99">
          <label className="store-label">가게 공지 사진 및 설명</label>
          <div className="notice-wrapper">
            <div className="notice-image-box" onClick={handleImageClick}>
            {noticeImage ? (
                <img src={noticeImage} alt="업로드된 이미지" className="preview-image" />
            ) : (
                <img src={seller_camera} alt="카메라 아이콘" className="camera-icon" />
            )}
            <input
                type="file"
                accept="image/*"
                ref={noticeImageRef}
                onChange={handleNoticeImageChange}
                style={{ display: "none" }}
            />
            </div>
            <textarea
            className="notice-description"
            placeholder="500자 이내로 입력해주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </div>

          <button className="store-button-d">등록</button>
          <button className="store-button-e">변경</button>
        </div> 

        {/* 저장 및 취소 */}
        <div className="store-form-group-aa">
          <button className="store-button-f">저장</button>
          <button className="store-button-g">취소</button>
        </div>        

      </div>
    </div>
  );
};

export default Seller_newstoreRegistration;
