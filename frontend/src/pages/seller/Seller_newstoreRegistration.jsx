import { useState, useEffect } from "react";
import "../../css/seller/Seller_newstoreRegistration.css";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import seller_camera from "../../image/icon/seller_icon/seller_camera.png";

const Seller_newstoreRegistration = () => {
  // 기본 매장 정보
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");

  // 배달 관련
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [amountInputs, setAmountInputs] = useState([{ min: "", fee: "" }]);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryArea, setDeliveryArea] = useState("");

  // 카테고리 및 시간
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [storeTime, setStoreTime] = useState("");

  // 공지사항
  const [description, setDescription] = useState("");

  // 이미지
  const [storeImages, setStoreImages] = useState([]);
  const [storeImageFiles, setStoreImageFiles] = useState([]);
  const [noticeImages, setNoticeImages] = useState([]);
  const [noticeImageFiles, setNoticeImageFiles] = useState([]);

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);

  // 카테고리 매핑
  const categories = [
    { id: 1, name: "편의점" },
    { id: 2, name: "마트" },
    { id: 3, name: "빵집" },
    { id: 4, name: "식당" },
  ];

  // 페이지 로드시 기존 매장 정보 불러오기
  useEffect(() => {
    fetchSellerInfo();
  }, []);

  const fetchSellerInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/sellers/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sellerInfo = data.sellerInformationDto;

        // 기존 데이터로 폼 초기화
        setStoreName(sellerInfo.storeName || "");
        setStoreDescription(sellerInfo.storeDescription || "");
        setPhone(sellerInfo.phone || "");
        setPickupTime(sellerInfo.pickupTime || "");
        setMinOrderAmount(sellerInfo.minOrderAmount || "");
        setDeliveryStatus(sellerInfo.deliveryAvailable === "Y" ? "ACCEPT" : "DECLINE");
        setDeliveryArea(sellerInfo.deliveryArea || "");
        setStoreTime(sellerInfo.operatingHours || "");
        setDescription(sellerInfo.notification || "");

        // 카테고리 설정
        const category = categories.find((cat) => cat.id === sellerInfo.categoryId);
        if (category) {
          setSelectedCategory(category.name);
          setCategoryId(sellerInfo.categoryId);
        }

        // 배달비 설정
        if (sellerInfo.deliveryFeeDtos && sellerInfo.deliveryFeeDtos.length > 0) {
          setAmountInputs(
            sellerInfo.deliveryFeeDtos.map((fee) => ({
              id: fee.id,
              min: fee.ordersMoney?.toString() || "",
              fee: fee.deliveryTip?.toString() || "",
            }))
          );
        }

        // 기존 이미지 URL 설정
        setStoreImages(sellerInfo.sellerPhotos || []);
        setNoticeImages(sellerInfo.notificationPhotos || []);
      }
    } catch (error) {
      console.error("매장 정보 조회 실패:", error);
    }
  };

  // 매장 사진 관련 함수들
  const handleAddStoreImage = () => {
    if (storeImages.length < 5) {
      setStoreImages([...storeImages, null]);
    }
  };

  const handleRemoveStoreImage = () => {
    if (storeImages.length > 0) {
      setStoreImages(storeImages.slice(0, -1));
      setStoreImageFiles(storeImageFiles.slice(0, -1));
    }
  };

  const handleStoreImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...storeImages];
      const updatedFiles = [...storeImageFiles];

      updatedImages[index] = URL.createObjectURL(file);
      updatedFiles[index] = file;

      setStoreImages(updatedImages);
      setStoreImageFiles(updatedFiles);
    }
  };

  // 공지 사진 관련 함수들
  const handleAddNoticeImage = () => {
    if (noticeImages.length < 5) {
      setNoticeImages([...noticeImages, null]);
    }
  };

  const handleRemoveNoticeImage = () => {
    if (noticeImages.length > 0) {
      setNoticeImages(noticeImages.slice(0, -1));
      setNoticeImageFiles(noticeImageFiles.slice(0, -1));
    }
  };

  const handleNoticeImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...noticeImages];
      const updatedFiles = [...noticeImageFiles];

      updatedImages[index] = URL.createObjectURL(file);
      updatedFiles[index] = file;

      setNoticeImages(updatedImages);
      setNoticeImageFiles(updatedFiles);
    }
  };

  // 배달 금액 입력 관련
  const handleAddInput = () => {
    setAmountInputs([...amountInputs, { min: "", fee: "" }]);
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
  const handleSelect = (category) => {
    setSelectedCategory(category.name);
    setCategoryId(category.id);
    setIsOpen(false);
  };

  // 폼 검증
  const validateForm = () => {
    const newErrors = {};

    if (!storeName.trim()) newErrors.storeName = "매장이름은 필수입니다.";
    if (!phone.trim()) newErrors.phone = "전화번호는 필수입니다.";
    if (!pickupTime.trim()) newErrors.pickupTime = "픽업시간은 필수입니다.";
    if (!storeTime.trim()) newErrors.operatingHours = "영업시간은 필수입니다.";
    if (!categoryId) newErrors.categoryId = "매장 카테고리는 필수입니다.";
  };

  // 매장 정보 저장
  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // DTO 데이터 구성
      const sellerInfo = {
        storeName: storeName,
        storeDescription: storeDescription,
        notification: description,
        deliveryAvailable: deliveryStatus === "ACCEPT" ? "Y" : "N",
        minOrderAmount: minOrderAmount,
        deliveryFeeDtos: amountInputs
          .filter((input) => input.min && input.fee)
          .map((input) => ({
            id: input.id || null,
            ordersMoney: parseInt(input.min),
            deliveryTip: freeDelivery ? 0 : parseInt(input.fee),
            deleted: false,
          })),
        deliveryArea: deliveryArea,
        operatingHours: storeTime,
        categoryId: categoryId,
        phone: phone,
        pickupTime: pickupTime,
        sellerPhotoUrls: [],
        notificationPhotos: [],
        notificationPhotoIds: [],
      };

      formData.append(
        "sellerInformationDto",
        new Blob([JSON.stringify(sellerInfo)], {
          type: "application/json",
        })
      );

      // 매장 이미지 추가
      storeImageFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("storeImage", file);
        }
      });

      // 공지 이미지 추가
      noticeImageFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("notificationImage", file);
        }
      });

      const token = localStorage.getItem("token");
      const response = await fetch("/api/sellers", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("매장 정보가 성공적으로 업데이트되었습니다!");
      } else {
        throw new Error("서버 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("매장 정보 업데이트 실패:", error);
      alert("매장 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seller_Header />

      <div className="store-registration">
        <div className="container">
          {/* 에러 알림 */}

          {/* 메인 폼 */}
          <div className="form-container">
            {/* 기본 정보 */}
            <section className="card">
              <div className="card-header">
                <div className="card-title">
                  <span className="icon">🏪</span>
                  <h3>기본 정보</h3>
                </div>
                <p className="card-subtitle">매장의 기본적인 정보를 입력해주세요</p>
              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="label">
                      매장이름 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="매장이름을 입력해주세요"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label className="label">
                      전화번호 <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label className="label">
                      픽업 소요시간 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="예: 30분"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label className="label">최소 주문 금액</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="0"
                      value={minOrderAmount}
                      onChange={(e) => setMinOrderAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field full-width">
                  <label className="label">매장 설명</label>
                  <textarea
                    className="textarea"
                    placeholder="500자 이내로 매장을 소개해주세요"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    maxLength="500"
                    rows="4"
                  />
                  <div className="char-counter">{storeDescription.length}/500</div>
                </div>
              </div>
            </section>

            {/* 운영 정보 */}
            <section className="card">
              <div className="card-header">
                <div className="card-title">
                  <span className="icon">⏰</span>
                  <h3>운영 정보</h3>
                </div>
                <p className="card-subtitle">매장 카테고리와 영업시간을 설정해주세요</p>
              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="label">
                      매장 카테고리 <span className="required">*</span>
                    </label>
                    <div className="select-container">
                      <button
                        type="button"
                        className="select-trigger"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <span>{selectedCategory || "카테고리를 선택해주세요"}</span>
                        <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
                      </button>
                      {isOpen && (
                        <div className="select-dropdown">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              onClick={() => handleSelect(cat)}
                              className="select-option"
                            >
                              {cat.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-field full-width">
                  <label className="label">
                    영업시간 <span className="required">*</span>
                  </label>
                  <textarea
                    className="textarea"
                    value={storeTime}
                    onChange={(e) => setStoreTime(e.target.value)}
                    placeholder="예시:
월요일 09:00 ~ 18:00
화요일 09:00 ~ 18:00
수요일 09:00 ~ 18:00
목요일 09:00 ~ 18:00
금요일 09:00 ~ 18:00
토요일 09:00 ~ 18:00
일요일 09:00 ~ 18:00"
                    rows="6"
                  />
                </div>
              </div>
            </section>

            {/* 매장 사진 */}
            <section className="card">
              <div className="card-header">
                <div className="card-title">
                  <span className="icon">📸</span>
                  <h3>매장 사진</h3>
                </div>
                <p className="card-subtitle">
                  매장의 모습을 보여주는 사진을 업로드하세요 (최대 5장)
                </p>
              </div>

              <div className="card-content">
                <div className="image-grid">
                  {storeImages.map((img, index) => (
                    <div
                      key={index}
                      className="image-upload-box"
                      onClick={() =>
                        document.getElementById(`store-img-${index}`).click()
                      }
                    >
                      <img src={img || seller_camera} alt="매장 사진" className="image" />
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
                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddStoreImage}
                    disabled={storeImages.length >= 5}
                  >
                    사진 추가
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleRemoveStoreImage}
                    disabled={storeImages.length === 0}
                  >
                    사진 삭제
                  </button>
                </div>
              </div>
            </section>

            {/* 배달 설정 */}
            <section className="card">
              <div className="card-header">
                <div className="card-title">
                  <span className="icon">🚚</span>
                  <h3>배달 설정</h3>
                </div>
                <p className="card-subtitle">
                  배달 서비스 제공 여부와 배달비를 설정하세요
                </p>
              </div>

              <div className="card-content">
                <div className="form-field">
                  <label className="label">배달 여부</label>
                  <div className="radio-group">
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="delivery"
                        value="ACCEPT"
                        checked={deliveryStatus === "ACCEPT"}
                        onChange={() => setDeliveryStatus("ACCEPT")}
                      />
                      <span className="radio-label">배달 수락</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="delivery"
                        value="DECLINE"
                        checked={deliveryStatus === "DECLINE"}
                        onChange={() => setDeliveryStatus("DECLINE")}
                      />
                      <span className="radio-label">배달 거절</span>
                    </label>
                  </div>
                </div>

                {deliveryStatus === "ACCEPT" && (
                  <>
                    <div className="delivery-section">
                      <label className="label">배달비 설정</label>
                      <div className="delivery-fee-container">
                        {amountInputs.map((input, index) => (
                          <div key={index} className="delivery-fee-row">
                            <input
                              type="number"
                              placeholder="최소 주문금액"
                              value={input.min}
                              onChange={(e) => handleChange(index, "min", e.target.value)}
                              className="delivery-input"
                            />
                            <span className="text">원 이상</span>
                            <input
                              type="number"
                              placeholder="배달비"
                              value={input.fee}
                              onChange={(e) => handleChange(index, "fee", e.target.value)}
                              className="delivery-input"
                              disabled={freeDelivery}
                            />
                            <span className="text">원</span>
                          </div>
                        ))}

                        <div className="button-group">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleAddInput}
                          >
                            구간 추가
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleRemoveInput}
                            disabled={amountInputs.length <= 1}
                          >
                            구간 삭제
                          </button>
                        </div>

                        <label className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={freeDelivery}
                            onChange={(e) => setFreeDelivery(e.target.checked)}
                          />
                          <span className="checkbox-label">무료 배달</span>
                        </label>
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="label">배달 가능 지역</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="예: 복현동, 원대동, 침산동"
                        value={deliveryArea}
                        onChange={(e) => setDeliveryArea(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* 가게 공지 */}
            <section className="card">
              <div className="card-header">
                <div className="card-title">
                  <span className="icon">📢</span>
                  <h3>가게 공지</h3>
                </div>
                <p className="card-subtitle">
                  고객에게 전달하고 싶은 공지사항을 작성하세요
                </p>
              </div>

              <div className="card-content">
                <div className="image-grid">
                  {noticeImages.map((img, index) => (
                    <div
                      key={index}
                      className="image-upload-box"
                      onClick={() =>
                        document.getElementById(`notice-img-${index}`).click()
                      }
                    >
                      <img src={img || seller_camera} alt="공지 사진" className="image" />
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
                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddNoticeImage}
                    disabled={noticeImages.length >= 5}
                  >
                    사진 추가
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleRemoveNoticeImage}
                    disabled={noticeImages.length === 0}
                  >
                    사진 삭제
                  </button>
                </div>

                <div className="form-field full-width">
                  <label className="label">공지 내용</label>
                  <textarea
                    className="textarea"
                    placeholder="고객에게 알리고 싶은 내용을 500자 이내로 작성해주세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength="500"
                    rows="4"
                  />
                  <div className="char-counter">{description.length}/500</div>
                </div>
              </div>
            </section>
          </div>

          {/* 액션 버튼 */}
          <div className="actions">
            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "저장 중..." : "매장 정보 저장"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Seller_newstoreRegistration;
