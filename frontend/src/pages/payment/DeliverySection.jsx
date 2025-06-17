import React, { useEffect } from "react";
import "./DeliverySection.css";

const DeliverySection = ({ deliveryInfo, setDeliveryInfo }) => {
  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setDeliveryInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 주소 검색 팝업 열기
  const handleAddressSearch = () => {
    try {
      // 팝업 창 크기와 위치 설정
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // PostcodePopup 페이지 열기
      const popup = window.open(
        "/postcode-popup", // 라우터에서 설정할 경로
        "postcode",
        `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`
      );

      // 팝업이 제대로 열렸는지 확인
      if (!popup) {
        alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
        return;
      }

      // 팝업 포커스
      popup.focus();
    } catch (error) {
      console.error("주소 검색 팝업 열기 실패:", error);
      alert("주소 검색을 열 수 없습니다. 다시 시도해주세요.");
    }
  };

  // 주소 선택 완료 메시지 수신
  useEffect(() => {
    const handleMessage = (event) => {
      // 보안을 위해 origin 체크 (필요시)
      // if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === "ADDRESS_SELECTED") {
        const { address, postCode } = event.data.payload;

        console.log("주소 선택 완료:", { address, postCode });

        // 부모 state 업데이트
        setDeliveryInfo((prev) => ({
          ...prev,
          mainAddress: address,
          postCode: postCode,
        }));

        // 상세주소 입력 필드로 포커스 이동
        setTimeout(() => {
          const detailInput = document.getElementById("detail-address");
          if (detailInput) {
            detailInput.focus();
          }
        }, 100);
      }
    };

    // 메시지 이벤트 리스너 등록
    window.addEventListener("message", handleMessage);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setDeliveryInfo]);

  return (
    <div className="delivery-section">
      <h3 className="section-title">배송지</h3>

      {/* 주소 선택 영역 */}
      <div className="address-selector">
        <label className="address-label">
          주소<span className="required">*</span>
        </label>
        <div className="address-buttons">
          <button
            className="address-search-btn"
            type="button"
            onClick={handleAddressSearch}
          >
            주소 검색
          </button>
        </div>
      </div>

      {/* 주소 입력 필드들 */}
      <div className="address-inputs">
        <input
          type="text"
          id="main-address"
          name="mainAddress"
          className="address-main-input"
          placeholder="기본주소를 입력하세요"
          value={deliveryInfo.mainAddress}
          onChange={(e) => handleInputChange("mainAddress", e.target.value)}
          required
          readOnly // 주소 검색으로만 입력 가능하도록
        />
        <input
          type="text"
          id="detail-address"
          name="detailAddress"
          className="address-detail-input"
          placeholder="상세주소를 입력하세요 (동, 호수 등)"
          value={deliveryInfo.detailAddress}
          onChange={(e) => handleInputChange("detailAddress", e.target.value)}
        />
        {deliveryInfo.postCode && (
          <input
            type="text"
            className="post-code-display"
            value={`우편번호: ${deliveryInfo.postCode}`}
            readOnly
            style={{
              marginTop: "8px",
              padding: "8px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#6c757d",
            }}
          />
        )}
      </div>

      {/* 휴대전화 입력 영역 */}
      <div className="phone-section">
        <label className="phone-label">
          휴대전화<span className="required">*</span>
        </label>
        <div className="phone-inputs-container">
          <input
            type="tel"
            id="phone-first"
            name="phoneFirst"
            className="phone-input-first"
            maxLength="3"
            placeholder="010"
            value={deliveryInfo.phoneFirst}
            onChange={(e) => handleInputChange("phoneFirst", e.target.value)}
            required
          />
          <span className="phone-separator">-</span>
          <input
            type="tel"
            id="phone-middle"
            name="phoneMiddle"
            className="phone-input-middle"
            maxLength="4"
            placeholder="1234"
            value={deliveryInfo.phoneMiddle}
            onChange={(e) => handleInputChange("phoneMiddle", e.target.value)}
            required
          />
          <span className="phone-separator">-</span>
          <input
            type="tel"
            id="phone-last"
            name="phoneLast"
            className="phone-input-last"
            maxLength="4"
            placeholder="5678"
            value={deliveryInfo.phoneLast}
            onChange={(e) => handleInputChange("phoneLast", e.target.value)}
            required
          />
        </div>
      </div>

      {/* 요청사항 입력 영역 */}
      <div className="request-section">
        <label htmlFor="delivery-request" className="sr-only">
          배송 요청사항
        </label>
        <textarea
          id="delivery-request"
          name="deliveryRequest"
          className="request-textarea"
          placeholder="배송 시 요청사항을 입력해주세요 (예: 문 앞에 놓아주세요, 부재 시 경비실에 맡겨주세요)"
          rows={3}
          value={deliveryInfo.deliveryRequest}
          onChange={(e) => handleInputChange("deliveryRequest", e.target.value)}
        ></textarea>
      </div>

      {/* 체크박스 영역 */}
      <div className="checkbox-section">
        <input
          type="checkbox"
          id="save-default"
          name="saveAsDefault"
          className="save-default-checkbox"
          checked={deliveryInfo.saveAsDefault}
          onChange={(e) => handleInputChange("saveAsDefault", e.target.checked)}
        />
        <label htmlFor="save-default" className="save-default-label">
          기본 배송지로 저장
        </label>
      </div>
    </div>
  );
};

export default DeliverySection;
