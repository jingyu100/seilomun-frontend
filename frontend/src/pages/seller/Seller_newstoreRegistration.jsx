import { useRef } from "react";
import { useState } from "react";
import "../../css/seller/Seller_newstoreRegistration.css";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import seller_camera from "../../image/icon/seller_icon/seller_camera.png";

const Seller_newstoreRegistration = () => {
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [amountInputs, setAmountInputs] = useState([{ min: "", max: "", fee: "" }]);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeTime, setStoreTime] = useState("");

  // ✅ 매장 사진 (최대 5개)
  const [storeImages, setStoreImages] = useState([]);

  const handleAddStoreImage = () => {
    if (storeImages.length < 5) {
      setStoreImages([...storeImages, null]);
    }
  };

  const handleRemoveStoreImage = () => {
    if (storeImages.length > 0) {
      setStoreImages(storeImages.slice(0, -1));
    }
  };

  const handleStoreImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...storeImages];
      updated[index] = URL.createObjectURL(file);
      setStoreImages(updated);
    }
  };

  // ✅ 공지 이미지 (최대 5개)
  const [noticeImages, setNoticeImages] = useState([]);

  const handleAddNoticeImage = () => {
    if (noticeImages.length < 5) {
      setNoticeImages([...noticeImages, null]);
    }
  };

  const handleRemoveNoticeImage = () => {
    if (noticeImages.length > 0) {
      setNoticeImages(noticeImages.slice(0, -1));
    }
  };

  const handleNoticeImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...noticeImages];
      updated[index] = URL.createObjectURL(file);
      setNoticeImages(updated);
    }
  };

  // 배달 금액 입력 관련
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

  // 카테고리 선택
  const categories = ["편의점", "마트", "빵집", "식당"];

  const handleSelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="Seller-Header">
        <Seller_Header />
      </div>
      <div className="Seller-newstoreRegistration">
        <h2 className="seller-new-form-title">매장 정보 설정 및 변경</h2>
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

        {/* 매장 사진 영역 */}
        <div className="store-form-group-33">
          <label className="store-label">매장 사진</label>
          <div className="image-row">
            {storeImages.map((img, index) => (
              <div
                className="image-upload-box-11"
                key={index}
                onClick={() => document.getElementById(`store-img-${index}`).click()}
              >
                <img
                  src={img || seller_camera}
                  alt="store"
                  className="camera-icon"
                />
                <input
                  type="file"
                  accept="image/*"
                  id={`store-img-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleStoreImageChange(index, e)}
                />
              </div>
            ))}
          </div>
          <div className="amount-button-group">
            <button className="amount-gray-btn" onClick={handleAddStoreImage}>추가</button>
            <button className="amount-gray-btn" onClick={handleRemoveStoreImage}>삭제</button>
            <button className="store-button-5">등록</button>
            <button className="store-button-6">변경</button>
          </div>
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
            <label className="store-label">가게 공지</label>

            <div className="notice-wrapper">
              <div className="image-row">
              {noticeImages.map((file, index) => (
                <div
                  key={index}
                  className="notice-image-box"
                  onClick={() => document.getElementById(`notice-img-${index}`).click()}
                >
                  <img
                    src={file ? URL.createObjectURL(file) : seller_camera}  // ✅ 수정
                    alt="notice"
                    className="camera-icon"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id={`notice-img-${index}`}
                    style={{ display: "none" }}
                    onChange={(e) => handleNoticeImageChange(index, e)}
                  />
                </div>
              ))}
              </div>
              <div className="amount-button-group">
                <button className="amount-gray-btn" onClick={handleAddNoticeImage}>추가</button>
                <button className="amount-gray-btn" onClick={handleRemoveNoticeImage}>삭제</button>
                <button className="store-button-d">등록</button>
                <button className="store-button-e">변경</button>
              </div>

              <textarea
                className="notice-description"
                placeholder="500자 이내로 입력해주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />


            </div>
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
