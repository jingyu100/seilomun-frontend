import React, { useEffect } from "react";

export default function KakaoMapApi({ address }) {

  useEffect(() => {
    
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                const container = document.getElementById("map");
                const options = {
                center: coords,
                level: 3,
            };

            const map = new window.kakao.maps.Map(container, options);

            new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });
          } else {
            console.error("주소 변환 실패:", status);
            // 주소가 없을 시의 임시 주소
            const coords = new window.kakao.maps.LatLng(37.5665, 126.9780); // 서울 시청 예시
            const container = document.getElementById("map");
            const options = {
                center: coords,
                level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);
          }
        });
      });
    } else {
      console.error("Kakao Maps API is not loaded yet.");
    }
  }, [address]);

  return (
    <div
      id="map"
      style={{
        width: "500px",
        height: "300px",
        borderRadius: '7px',
        border: '1px solid #e2e2e2',
        // margin: "30px 0",
      }}
    ></div>
  );
}
