import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../../css/customer/Banner.css";

const rawBannerData = [
  { src: "../image/banner/BannerSP1.jpg", link: "#" },
  { src: "../image/banner/BannerSP2.jfif", link: "#" },
  { src: "../image/banner/BannerSP3.jfif", link: "#" },
];

const extendedBannerData = [
  rawBannerData[rawBannerData.length - 2],
  ...rawBannerData,
];

export default function SlideBannerPerfectLoop() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="bannerWrapper">
      <div className="bannerNav-left" ref={prevRef}>
        <svg width="25" height="35" viewBox="0 0 10 18" fill="none">
          <path d="M8.5 16.5L1 9l7.5-7.5" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>
      <div className="bannerNav-right" ref={nextRef}>
        <svg width="25" height="35" viewBox="0 0 10 18" fill="none">
          <path d="M1.5 16.5L9 9 1.5 1.5" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        loop={true}
        centeredSlides={true}
        loopedSlides={extendedBannerData.length}
        slidesPerView={1.5}
        spaceBetween={20}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {extendedBannerData.map((banner, index) => (
          <SwiperSlide key={index} className="bannerSlide">
            <a href={banner.link}>
              <img src={banner.src} alt={`배너 ${index}`} />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
