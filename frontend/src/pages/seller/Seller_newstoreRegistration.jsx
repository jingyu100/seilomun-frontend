import { useState, useEffect } from "react";
import axios from "axios";
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
  const [deliveryStatus, setDeliveryStatus] = useState("DECLINE");
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

  // 이미지 - 개선된 상태 관리
  const [storeImages, setStoreImages] = useState([]);
  const [storeImageFiles, setStoreImageFiles] = useState([]);
  const [setOriginalStoreImages] = useState([]); // 원본 URL 저장

  const [noticeImages, setNoticeImages] = useState([]);
  const [noticeImageFiles, setNoticeImageFiles] = useState([]);
  const [setOriginalNoticeImages] = useState([]); // 원본 URL 저장

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);

  const S3_BASE_URL = "https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/";

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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // 이미 완전한 URL인 경우 (http 또는 https로 시작)
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // 상대 경로인 경우 S3 base URL 추가
    return S3_BASE_URL + imageUrl;
  };

  // 3. fetchSellerInfo 함수에서 이미지 URL 처리 부분 수정
  const fetchSellerInfo = async () => {
    try {
      const response = await axios.get("http://localhost/api/sellers/me", {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("API 응답 데이터:", response.data);

        const responseData = response.data;
        const sellerInfo = responseData.data?.sellerInformationDto;

        if (!sellerInfo) {
          console.warn("sellerInformationDto가 응답에 없습니다:", responseData);
          return;
        }

        // 기본 정보 설정 (기존 코드와 동일)
        setStoreName(sellerInfo.storeName || "");
        setStoreDescription(sellerInfo.storeDescription || "");
        setPhone(sellerInfo.phone || "");
        setPickupTime(sellerInfo.pickupTime || "");
        setMinOrderAmount(sellerInfo.minOrderAmount?.toString() || "");
        setDeliveryStatus(sellerInfo.deliveryAvailable === "Y" ? "ACCEPT" : "DECLINE");
        setDeliveryArea(sellerInfo.deliveryArea || "");
        setStoreTime(sellerInfo.operatingHours || "");
        setDescription(sellerInfo.notification || "");

        // 카테고리 설정 (기존 코드와 동일)
        const category = categories.find((cat) => cat.id === sellerInfo.categoryId);
        if (category) {
          setSelectedCategory(category.name);
          setCategoryId(sellerInfo.categoryId.toString());
        }

        // 배달비 설정 (기존 코드와 동일)
        if (sellerInfo.deliveryFeeDtos && sellerInfo.deliveryFeeDtos.length > 0) {
          const existingDeliveryFees = sellerInfo.deliveryFeeDtos.map((fee) => ({
            id: fee.id,
            min: fee.ordersMoney?.toString() || "",
            fee: fee.deliveryTip?.toString() || "",
          }));
          setAmountInputs(existingDeliveryFees);
        } else {
          setAmountInputs([{ min: "", fee: "" }]);
        }

        // 🔥 이미지 설정 - S3 URL 처리 추가
        const existingStorePhotos = (sellerInfo.sellerPhotos || []).map(getImageUrl);
        const existingNoticePhotos = (sellerInfo.notificationPhotos || []).map(
          getImageUrl
        );

        // 원본 URL 저장 (백엔드 전송용 - 원본 그대로)
        setOriginalStoreImages(sellerInfo.sellerPhotos || []);
        setOriginalNoticeImages(sellerInfo.notificationPhotos || []);

        // 화면 표시용 설정 (S3 URL 포함)
        setStoreImages(existingStorePhotos);
        setNoticeImages(existingNoticePhotos);

        console.log("로딩된 매장 사진:", existingStorePhotos);
        console.log("로딩된 공지 사진:", existingNoticePhotos);
      }
    } catch (error) {
      console.error("매장 정보 조회 실패:", error);
      // 에러 처리 코드는 기존과 동일
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = "/selogin";
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다.");
      } else {
        alert("매장 정보를 불러오는데 실패했습니다.");
      }
    }
  };

  // 🔥 개별 매장 사진 삭제
  const handleDeleteStoreImage = (index) => {
    console.log(`매장 사진 ${index} 삭제 요청`);

    const updatedImages = storeImages.filter((_, i) => i !== index);
    const updatedFiles = storeImageFiles.filter((_, i) => i !== index);

    setStoreImages(updatedImages);
    setStoreImageFiles(updatedFiles);

    console.log("삭제 후 매장 사진:", updatedImages);
  };

  // 🔥 개별 공지 사진 삭제
  const handleDeleteNoticeImage = (index) => {
    console.log(`공지 사진 ${index} 삭제 요청`);

    const updatedImages = noticeImages.filter((_, i) => i !== index);
    const updatedFiles = noticeImageFiles.filter((_, i) => i !== index);

    setNoticeImages(updatedImages);
    setNoticeImageFiles(updatedFiles);

    console.log("삭제 후 공지 사진:", updatedImages);
  };

  // 매장 사진 추가 (슬롯 추가)
  const handleAddStoreImage = () => {
    if (storeImages.length < 5) {
      setStoreImages([...storeImages, null]);
    }
  };

  // 매장 사진 마지막 제거 (기존 방식 유지)
  const handleRemoveStoreImage = () => {
    if (storeImages.length > 0) {
      setStoreImages(storeImages.slice(0, -1));
      setStoreImageFiles(storeImageFiles.slice(0, -1));
    }
  };

  // 매장 사진 파일 변경
  const handleStoreImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...storeImages];
      const updatedFiles = [...storeImageFiles];

      // 새 파일로 교체
      updatedImages[index] = URL.createObjectURL(file);

      // 파일 배열 크기 맞추기
      while (updatedFiles.length <= index) {
        updatedFiles.push(null);
      }
      updatedFiles[index] = file;

      setStoreImages(updatedImages);
      setStoreImageFiles(updatedFiles);

      console.log(`매장 사진 ${index} 변경:`, file.name);
    }
  };

  // 공지 사진 관련 함수들 (동일한 패턴)
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

      while (updatedFiles.length <= index) {
        updatedFiles.push(null);
      }
      updatedFiles[index] = file;

      setNoticeImages(updatedImages);
      setNoticeImageFiles(updatedFiles);

      console.log(`공지 사진 ${index} 변경:`, file.name);
    }
  };

  // 배달 관련 함수들 (기존 유지)
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

  const handleSelect = (category) => {
    setSelectedCategory(category.name);
    setCategoryId(category.id);
    setIsOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!storeName || !storeName.trim()) newErrors.storeName = "매장이름은 필수입니다.";
    if (!phone || !phone.trim()) newErrors.phone = "전화번호는 필수입니다.";
    if (!pickupTime || !pickupTime.trim())
      newErrors.pickupTime = "픽업시간은 필수입니다.";
    if (!storeTime || !storeTime.trim())
      newErrors.operatingHours = "영업시간은 필수입니다.";
    if (!categoryId || categoryId === "" || isNaN(parseInt(categoryId))) {
      newErrors.categoryId = "매장 카테고리는 필수입니다.";
    }
    if (!deliveryStatus || deliveryStatus === "") {
      newErrors.deliveryStatus = "배달 여부는 필수입니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("폼 검증 에러:", newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  // 🔥 핵심: 매장 정보 저장 (삭제 기능 포함)
  // 4. handleSubmit 함수에서 기존 이미지 URL 처리 부분 수정
  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // 🔥 남아있는 기존 이미지 URL들만 필터링 (원본 URL 사용)
      const remainingStoreUrls = storeImages
        .filter((img) => typeof img === "string" && img.startsWith(S3_BASE_URL))
        .map((img) => img.replace(S3_BASE_URL, "")); // S3 base URL 제거하여 원본 경로만 전송

      const remainingNoticeUrls = noticeImages
        .filter((img) => typeof img === "string" && img.startsWith(S3_BASE_URL))
        .map((img) => img.replace(S3_BASE_URL, "")); // S3 base URL 제거하여 원본 경로만 전송

      console.log("전송할 매장 사진 URL:", remainingStoreUrls);
      console.log("전송할 공지 사진 URL:", remainingNoticeUrls);

      const sellerInfo = {
        // 기존 필드들은 동일
        storeName: storeName.trim(),
        deliveryAvailable: deliveryStatus === "ACCEPT" ? "Y" : "N",
        operatingHours: storeTime.trim(),
        categoryId: categoryId ? parseInt(categoryId) : null,
        phone: phone.trim(),
        pickupTime: pickupTime.trim(),
        storeDescription: storeDescription || "",
        notification: description || "",
        minOrderAmount: minOrderAmount || "0",
        deliveryArea: deliveryArea || "",

        deliveryFeeDtos: amountInputs
          .filter((input) => input.min && input.fee)
          .map((input) => ({
            id: input.id || null,
            ordersMoney: parseInt(input.min) || 0,
            deliveryTip: freeDelivery ? 0 : parseInt(input.fee) || 0,
            deleted: false,
          })),

        // 🔥 원본 경로만 전송 (S3 base URL 제거된 상태)
        sellerPhotoUrls: remainingStoreUrls,
        notificationPhotos: remainingNoticeUrls,

        sellerPhotoIds: [],
        notificationPhotoIds: [],
      };

      // 나머지 코드는 기존과 동일
      console.log("전송할 sellerInfo:", sellerInfo);

      if (!sellerInfo.categoryId) {
        alert("매장 카테고리를 선택해주세요.");
        setLoading(false);
        return;
      }

      formData.append(
        "sellerInformationDto",
        new Blob([JSON.stringify(sellerInfo)], {
          type: "application/json",
        })
      );

      // 새로 업로드된 파일들만 전송
      const newStoreFiles = storeImageFiles.filter((file) => file instanceof File);
      const newNoticeFiles = noticeImageFiles.filter((file) => file instanceof File);

      if (newStoreFiles.length > 0) {
        newStoreFiles.forEach((file) => {
          formData.append("storeImage", file);
        });
        console.log("새 매장 이미지 전송:", newStoreFiles.length, "개");
      }

      if (newNoticeFiles.length > 0) {
        newNoticeFiles.forEach((file) => {
          formData.append("notificationImage", file);
        });
        console.log("새 공지 이미지 전송:", newNoticeFiles.length, "개");
      }

      const response = await axios.put("http://localhost/api/sellers", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("매장 정보가 성공적으로 업데이트되었습니다!");
        window.location.href = "/Seller_Main";
      }
    } catch (error) {
      console.error("매장 정보 업데이트 실패:", error);
      // 에러 처리는 기존과 동일
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = "/selogin";
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다.");
      } else if (error.response?.status === 400) {
        alert("입력 정보를 확인해주세요.");
      } else if (error.response?.status === 500) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("매장 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seller_Header />

      <div className="seller-store-registration">
        <div className="seller-store-container">
          <div className="seller-form-container">
            {/* 기본 정보 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">🏪</span>
                  <h3>기본 정보</h3>
                </div>
                <p className="seller-card-subtitle">
                  매장의 기본적인 정보를 입력해주세요
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-form-grid">
                  <div className="seller-form-field">
                    <label className="seller-label">
                      매장이름 <span className="seller-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="seller-input"
                      placeholder="매장이름을 입력해주세요"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>

                  <div className="seller-form-field">
                    <label className="seller-label">
                      전화번호 <span className="seller-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="seller-input"
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="seller-form-field">
                    <label className="seller-label">
                      픽업 소요시간 <span className="seller-required">*</span>
                    </label>
                    <input
                      type="text"
                      className="seller-input"
                      placeholder="예: 30분"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="seller-form-field seller-full-width">
                  <label className="seller-label">매장 설명</label>
                  <textarea
                    className="seller-textarea"
                    placeholder="500자 이내로 매장을 소개해주세요"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    maxLength="500"
                    rows="4"
                  />
                  <div className="seller-char-counter">{storeDescription.length}/500</div>
                </div>
              </div>
            </section>

            {/* 운영 정보 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">⏰</span>
                  <h3>운영 정보</h3>
                </div>
                <p className="seller-card-subtitle">
                  매장 카테고리와 영업시간을 설정해주세요
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-form-grid">
                  <div className="seller-form-field">
                    <label className="seller-label">
                      매장 카테고리 <span className="seller-required">*</span>
                    </label>
                    <div className="seller-select-container">
                      <button
                        type="button"
                        className="seller-select-trigger"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <span>{selectedCategory || "카테고리를 선택해주세요"}</span>
                        <span
                          className={`seller-arrow ${isOpen ? "seller-arrow-open" : ""}`}
                        >
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="seller-select-dropdown">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              onClick={() => handleSelect(cat)}
                              className="seller-select-option"
                            >
                              {cat.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="seller-form-field seller-full-width">
                  <label className="seller-label">
                    영업시간 <span className="seller-required">*</span>
                  </label>
                  <textarea
                    className="seller-textarea"
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

            {/* 🔥 매장 사진 - 개별 삭제 버튼 추가 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">📸</span>
                  <h3>매장 사진</h3>
                </div>
                <p className="seller-card-subtitle">
                  매장의 모습을 보여주는 사진을 업로드하세요 (최대 5장)
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-image-grid">
                  {storeImages.map((img, index) => (
                    <div
                      key={index}
                      className="seller-image-upload-box"
                      style={{ position: "relative" }}
                    >
                      <img
                        src={img || seller_camera}
                        alt="매장 사진"
                        className="seller-image"
                        onClick={() =>
                          document.getElementById(`seller-store-img-${index}`).click()
                        }
                        style={{ cursor: "pointer" }}
                      />

                      {/* 🔥 개별 삭제 버튼 */}
                      {img && img !== seller_camera && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStoreImage(index);
                          }}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "rgba(255, 0, 0, 0.8)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                          }}
                        >
                          ✕
                        </button>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        id={`seller-store-img-${index}`}
                        style={{ display: "none" }}
                        onChange={(e) => handleStoreImageChange(index, e)}
                      />
                    </div>
                  ))}
                </div>
                <div className="seller-button-group">
                  <button
                    type="button"
                    className="seller-btn seller-btn-secondary"
                    onClick={handleAddStoreImage}
                    disabled={storeImages.length >= 5}
                  >
                    사진 추가
                  </button>
                  <button
                    type="button"
                    className="seller-btn seller-btn-secondary"
                    onClick={handleRemoveStoreImage}
                    disabled={storeImages.length === 0}
                  >
                    마지막 사진 삭제
                  </button>
                </div>
              </div>
            </section>

            {/* 배달 설정 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">🚚</span>
                  <h3>배달 설정</h3>
                </div>
                <p className="seller-card-subtitle">
                  배달 서비스 제공 여부와 배달비를 설정하세요
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-form-field">
                  <label className="seller-label">
                    배달 여부 <span className="seller-required">*</span>
                  </label>
                  <div className="seller-radio-group">
                    <label className="seller-radio-item">
                      <input
                        type="radio"
                        name="delivery"
                        value="ACCEPT"
                        checked={deliveryStatus === "ACCEPT"}
                        onChange={() => setDeliveryStatus("ACCEPT")}
                      />
                      <span className="seller-radio-label">배달 수락</span>
                    </label>
                    <label className="seller-radio-item">
                      <input
                        type="radio"
                        name="delivery"
                        value="DECLINE"
                        checked={deliveryStatus === "DECLINE"}
                        onChange={() => setDeliveryStatus("DECLINE")}
                      />
                      <span className="seller-radio-label">배달 거절</span>
                    </label>
                  </div>
                </div>

                {deliveryStatus === "ACCEPT" && (
                  <>
                    <div className="seller-delivery-section">
                      <label className="seller-label">배달비 설정</label>
                      <div className="seller-delivery-fee-container">
                        {amountInputs.map((input, index) => (
                          <div key={index} className="seller-delivery-fee-row">
                            <input
                              type="number"
                              placeholder="최소 주문금액"
                              value={index === 0 ? minOrderAmount : input.min}
                              onChange={(e) => {
                                if (index === 0) {
                                  setMinOrderAmount(e.target.value);
                                  handleChange(index, "min", e.target.value);
                                } else {
                                  handleChange(index, "min", e.target.value);
                                }
                              }}
                              className="seller-delivery-input"
                            />
                            <span className="seller-text">원 이상</span>
                            <input
                              type="number"
                              placeholder="배달비"
                              value={input.fee}
                              onChange={(e) => handleChange(index, "fee", e.target.value)}
                              className="seller-delivery-input"
                              disabled={freeDelivery}
                            />
                            <span className="seller-text">원</span>
                          </div>
                        ))}

                        <div className="seller-button-group">
                          <button
                            type="button"
                            className="seller-btn seller-btn-secondary"
                            onClick={handleAddInput}
                          >
                            구간 추가
                          </button>
                          <button
                            type="button"
                            className="seller-btn seller-btn-secondary"
                            onClick={handleRemoveInput}
                            disabled={amountInputs.length <= 1}
                          >
                            구간 삭제
                          </button>
                        </div>

                        <label className="seller-checkbox-item">
                          <input
                            type="checkbox"
                            checked={freeDelivery}
                            onChange={(e) => setFreeDelivery(e.target.checked)}
                          />
                          <span className="seller-checkbox-label">무료 배달</span>
                        </label>
                      </div>
                    </div>

                    <div className="seller-form-field">
                      <label className="seller-label">배달 가능 지역</label>
                      <input
                        type="text"
                        className="seller-input"
                        placeholder="예: 복현동, 원대동, 침산동"
                        value={deliveryArea}
                        onChange={(e) => setDeliveryArea(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* 🔥 가게 공지 - 개별 삭제 버튼 추가 */}
            <section className="seller-info-card">
              <div className="seller-card-header">
                <div className="seller-card-title">
                  <span className="seller-icon">📢</span>
                  <h3>가게 공지</h3>
                </div>
                <p className="seller-card-subtitle">
                  고객에게 전달하고 싶은 공지사항을 작성하세요
                </p>
              </div>

              <div className="seller-card-content">
                <div className="seller-image-grid">
                  {noticeImages.map((img, index) => (
                    <div
                      key={index}
                      className="seller-image-upload-box"
                      style={{ position: "relative" }}
                    >
                      <img
                        src={img || seller_camera}
                        alt="공지 사진"
                        className="seller-image"
                        onClick={() =>
                          document.getElementById(`seller-notice-img-${index}`).click()
                        }
                        style={{ cursor: "pointer" }}
                      />

                      {/* 🔥 개별 삭제 버튼 */}
                      {img && img !== seller_camera && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNoticeImage(index);
                          }}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "rgba(255, 0, 0, 0.8)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                          }}
                        >
                          ✕
                        </button>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        id={`seller-notice-img-${index}`}
                        style={{ display: "none" }}
                        onChange={(e) => handleNoticeImageChange(index, e)}
                      />
                    </div>
                  ))}
                </div>
                <div className="seller-button-group">
                  <button
                    type="button"
                    className="seller-btn seller-btn-secondary"
                    onClick={handleAddNoticeImage}
                    disabled={noticeImages.length >= 5}
                  >
                    사진 추가
                  </button>
                  <button
                    type="button"
                    className="seller-btn seller-btn-secondary"
                    onClick={handleRemoveNoticeImage}
                    disabled={noticeImages.length === 0}
                  >
                    마지막 사진 삭제
                  </button>
                </div>

                <div className="seller-form-field seller-full-width">
                  <label className="seller-label">공지 내용</label>
                  <textarea
                    className="seller-textarea"
                    placeholder="고객에게 알리고 싶은 내용을 500자 이내로 작성해주세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength="500"
                    rows="4"
                  />
                  <div className="seller-char-counter">{description.length}/500</div>
                </div>
              </div>
            </section>
          </div>

          {/* 액션 버튼 */}
          <div className="seller-actions">
            <button
              className={`seller-btn seller-btn-primary ${
                loading ? "seller-loading" : ""
              }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "저장 중..." : "매장 정보 저장"}
            </button>
            <button
              className="seller-btn seller-btn-secondary"
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
