//주소 찾기 창

import React from "react";
import DaumPostcode from "react-daum-postcode";

function PostcodePopup() {
  const handleComplete = (data) => {
    const fullAddress = data.address;
    const zoneCode = data.zonecode;

    // 부모 창으로 데이터 전송
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "ADDRESS_SELECTED",
          payload: {
            address: fullAddress,
            postCode: zoneCode,
          },
        },
        "*"
      );
      window.close(); // 창 닫기
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <DaumPostcode onComplete={handleComplete} style={{ width: "100%" }} />
    </div>
  );
}

export default PostcodePopup;
