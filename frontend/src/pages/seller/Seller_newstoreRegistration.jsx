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
  const [deliveryStatus, setDeliveryStatus] = useState("DECLINE"); // 기본값 설정
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

  // fetchSellerInfo 함수를 axios와 쿠키 방식으로 변경
  const fetchSellerInfo = async () => {
    try {
      const response = await axios.get("http://localhost/api/sellers/me", {
        withCredentials: true, // 쿠키를 포함하여 요청
      });

      if (response.status === 200) {
        console.log("API 응답 데이터:", response.data); // 디버깅용

        const responseData = response.data;
        // ⚠️ 응답 구조 수정: data.data.sellerInformationDto
        const sellerInfo = responseData.data?.sellerInformationDto;

        if (!sellerInfo) {
          console.warn("sellerInformationDto가 응답에 없습니다:", responseData);
          console.log("실제 응답 구조:", JSON.stringify(responseData, null, 2));
          return;
        }

        // 기존 데이터로 폼 초기화 (SellerInformationResponseDto 필드명에 맞게)
        setStoreName(sellerInfo.storeName || "");
        setStoreDescription(sellerInfo.storeDescription || "");
        setPhone(sellerInfo.phone || "");
        setPickupTime(sellerInfo.pickupTime || "");
        setMinOrderAmount(sellerInfo.minOrderAmount?.toString() || ""); // 숫자를 문자열로 변환
        setDeliveryStatus(sellerInfo.deliveryAvailable === "Y" ? "ACCEPT" : "DECLINE");
        setDeliveryArea(sellerInfo.deliveryArea || "");
        setStoreTime(sellerInfo.operatingHours || "");
        setDescription(sellerInfo.notification || "");

        // 카테고리 설정
        const category = categories.find((cat) => cat.id === sellerInfo.categoryId);
        if (category) {
          setSelectedCategory(category.name);
          setCategoryId(sellerInfo.categoryId.toString()); // 숫자를 문자열로 변환
        }

        // 배달비 설정 - 기존 데이터를 완전히 교체 (누적되지 않도록)
        if (sellerInfo.deliveryFeeDtos && sellerInfo.deliveryFeeDtos.length > 0) {
          const existingDeliveryFees = sellerInfo.deliveryFeeDtos.map((fee) => ({
            id: fee.id,
            min: fee.ordersMoney?.toString() || "",
            fee: fee.deliveryTip?.toString() || "",
          }));
          setAmountInputs(existingDeliveryFees); // 기존 데이터로 완전히 교체
        } else {
          setAmountInputs([{ min: "", fee: "" }]); // 기본값으로 초기화
        }

        // 기존 이미지 URL 설정 (SellerInformationResponseDto 필드명에 맞게)
        // sellerPhotos (not sellerPhotoUrls), notificationPhotos
        setStoreImages(sellerInfo.sellerPhotos || []);
        setNoticeImages(sellerInfo.notificationPhotos || []);
      }
    } catch (error) {
      console.error("매장 정보 조회 실패:", error);

      // 에러 타입별 처리
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

    // @NotEmpty 필드들 체크 (백엔드 요구사항에 맞춤)
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

    // 에러가 있으면 로그로 확인
    if (Object.keys(newErrors).length > 0) {
      console.log("폼 검증 에러:", newErrors);
      console.log("현재 상태값들:", {
        storeName,
        phone,
        pickupTime,
        storeTime,
        categoryId,
        deliveryStatus,
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  // 매장 정보 저장
  // 매장 정보 저장
  // 매장 정보 저장
  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // 백엔드 SellerInformationDto의 @NotEmpty 요구사항에 맞춤
      const sellerInfo = {
        // @NotEmpty 필수 필드들
        storeName: storeName.trim(), // 공백 제거
        deliveryAvailable: deliveryStatus === "ACCEPT" ? "Y" : "N", // Character - 필수
        operatingHours: storeTime.trim(), // 공백 제거 - 필수
        categoryId: categoryId ? parseInt(categoryId) : null, // categoryId 안전하게 변환
        phone: phone.trim(), // 공백 제거 - 필수
        pickupTime: pickupTime.trim(), // 공백 제거 - 필수

        // 선택적 필드들
        storeDescription: storeDescription || "", // null 방지
        notification: description || "", // null 방지
        minOrderAmount: minOrderAmount || "0", // 빈 값일 경우 기본값
        deliveryArea: deliveryArea || "", // 빈 값 허용

        // 배달비 설정 - ID 확실히 전달
        deliveryFeeDtos: amountInputs
          .filter((input) => input.min && input.fee)
          .map((input) => ({
            id: input.id || null, // 기존 ID 확실히 전달 (있으면 수정, 없으면 신규)
            ordersMoney: parseInt(input.min) || 0,
            deliveryTip: freeDelivery ? 0 : parseInt(input.fee) || 0,
            deleted: false,
          })),

        // 이미지 관련 (빈 배열로 초기화)
        sellerPhotoUrls: [], // 기존 이미지 URL
        notificationPhotos: [], // 기존 공지 이미지 URL
        notificationPhotoIds: [], // 삭제할 이미지 ID들
      };

      // 전송 전 데이터 검증
      console.log("전송할 sellerInfo:", sellerInfo);
      console.log("배달비 데이터:", sellerInfo.deliveryFeeDtos);

      // 필수 필드 검증
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

      // 매장 이미지 처리 - 실제 파일이 있을 때만 전송
      let hasStoreImages = false;
      if (storeImageFiles && storeImageFiles.length > 0) {
        storeImageFiles.forEach((file) => {
          if (file && file instanceof File) {
            formData.append("storeImage", file);
            hasStoreImages = true;
          }
        });
      }

      // 공지 이미지 처리 - 실제 파일이 있을 때만 전송
      let hasNoticeImages = false;
      if (noticeImageFiles && noticeImageFiles.length > 0) {
        noticeImageFiles.forEach((file) => {
          if (file && file instanceof File) {
            formData.append("notificationImage", file);
            hasNoticeImages = true;
          }
        });
      }

      // 이미지가 없는 경우에만 빈 파일 전송 (백엔드 호환성을 위해)
      if (!hasStoreImages) {
        const emptyStoreFile = new File([""], "empty_store.txt", { type: "text/plain" });
        formData.append("storeImage", emptyStoreFile);
        console.log("매장 이미지 없음 - 빈 파일 전송");
      } else {
        console.log(
          "매장 이미지 전송:",
          storeImageFiles.filter((f) => f instanceof File).length,
          "개"
        );
      }

      if (!hasNoticeImages) {
        const emptyNoticeFile = new File([""], "empty_notice.txt", {
          type: "text/plain",
        });
        formData.append("notificationImage", emptyNoticeFile);
        console.log("공지 이미지 없음 - 빈 파일 전송");
      } else {
        console.log(
          "공지 이미지 전송:",
          noticeImageFiles.filter((f) => f instanceof File).length,
          "개"
        );
      }

      // FormData 내용 확인 (디버깅용)
      console.log("FormData 내용:");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], "파일:", pair[1].name, pair[1].size + "bytes");
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const response = await axios.put("http://localhost/api/sellers", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("매장 정보가 성공적으로 업데이트되었습니다!");
        // 성공 후 메인 페이지로 이동
        window.location.href = "/Seller_Main";
      }
    } catch (error) {
      console.error("매장 정보 업데이트 실패:", error);
      console.error("에러 응답:", error.response?.data);

      // 에러 타입별 처리
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
          {/* 메인 폼 */}
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

                  <div className="seller-form-field">
                    <label className="seller-label">최소 주문 금액</label>
                    <input
                      type="number"
                      className="seller-input"
                      placeholder="0"
                      value={minOrderAmount}
                      onChange={(e) => setMinOrderAmount(e.target.value)}
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

            {/* 매장 사진 */}
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
                      onClick={() =>
                        document.getElementById(`seller-store-img-${index}`).click()
                      }
                    >
                      <img
                        src={img || seller_camera}
                        alt="매장 사진"
                        className="seller-image"
                      />
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
                    사진 삭제
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
                              value={input.min}
                              onChange={(e) => handleChange(index, "min", e.target.value)}
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

            {/* 가게 공지 */}
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
                      onClick={() =>
                        document.getElementById(`seller-notice-img-${index}`).click()
                      }
                    >
                      <img
                        src={img || seller_camera}
                        alt="공지 사진"
                        className="seller-image"
                      />
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
                    사진 삭제
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
