import React, { useEffect, useRef } from "react";

export default function KakaoMapApi({
  address,
  width = "100%",
  minWidth = "500px",
  height = "300px",
  containerId = "map",
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            const container = document.getElementById(containerId);
            const options = {
              center: coords,
              level: 3,
            };

            const map = new window.kakao.maps.Map(container, options);
            mapRef.current = map; // 지도 인스턴스 저장

            new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });
          } else {
            console.error("주소 변환 실패:", status);
            // 주소가 없을 시의 임시 주소 (서울 시청)
            const coords = new window.kakao.maps.LatLng(37.5665, 126.978);
            const container = document.getElementById(containerId);
            const options = {
              center: coords,
              level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);
            mapRef.current = map; // 지도 인스턴스 저장
          }
        });
      });
    } else {
      console.error("Kakao Maps API is not loaded yet.");
    }
  }, [address, containerId]);

  // 지도 크기 변경 시 리사이즈
  useEffect(() => {
    if (mapRef.current && mapRef.current.relayout) {
      // 약간의 딜레이를 주어 DOM 업데이트 후 리사이즈
      setTimeout(() => {
        mapRef.current.relayout();
      }, 100);
    }
  }, [width, height, minWidth]);

  return (
    <div
      id={containerId}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
        borderRadius: "8px",
        border: "1px solid #e2e2e2",
        overflow: "hidden",
      }}
    ></div>
  );
}
