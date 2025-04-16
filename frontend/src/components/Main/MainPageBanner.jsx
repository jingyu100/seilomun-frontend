import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../css/customer/Main.css";

function MainBanner() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const images = [
    { src: "../image/banner/BannerSP1.jpg", link: "https://example.com/1" },
    { src: "../image/banner/BannerSP2.jfif", link: "https://example.com/2" },
    { src: "../image/banner/BannerSP3.jfif", link: "https://example.com/3" },
  ];

  return (
    <div className="mainBanner">
      <div className="mainBannerInner">

        {/* 왼쪽 버튼 */}
        <div
          className="bannerLeftBtn"
          ref={prevRef}
          onMouseEnter={() => swiperRef.current?.autoplay.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay.start()}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <svg width="25" height="35" viewBox="0 0 10 18" fill="none">
            <path
              stroke="#ebebeb"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.5 16.5L1 9l7.5-7.5"
            ></path>
          </svg>
        </div>

        {/* 오른쪽 버튼 */}
        <div
          className="bannerRightBtn"
          ref={nextRef}
          onMouseEnter={() => swiperRef.current?.autoplay.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay.start()}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <svg width="25" height="35" viewBox="0 0 10 18" fill="none">
            <path
              stroke="#ebebeb"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1.5 16.5L9 9 1.5 1.5"
            ></path>
          </svg>
        </div>

        {/* Swiper */}
        <div className="bannerImages">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            loop={true}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper) => {
              swiperRef.current = swiper;
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <a href={image.link} target="_blank" rel="noopener noreferrer">
                  <img src={image.src} alt={`배너 이미지 ${index}`} />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default MainBanner;
