import React, { useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../css/customer/Product.css";
import ProductHeadTitle from "./ProductHeadTitle.jsx";

export default function ProductHead() {

    const [currentIndex, setCurrentIndex] = useState(0);
    
    // const imageWidth = ;
    // const currentIndex = ;
    
    const moveX = -imageWidth * currentIndex;

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      };
    
      const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
      };

    return (
        <div className="productHead-inner">
            <div className="productHead-right">
                <div className="productHead-image">
                    <ul className="productImg-slide"
                        style={{
                            transform: `translate3d(${moveX}px, 0px, 0px)`,
                            msTransitionDuration: "0ms",
                            display: "flex",
                        }}    
                    >
                        {images.map((src, index) => (
                            <li 
                                className="swiper-slide"
                                key={index}
                            >
                                <img 
                                    src={src}
                                    alt={`제품 이미지 ${index + 1}`} 
                                    style={{ width: "100%", height: "auto", }} 
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <div 
                    className="slideBtn"
                    style={{
                        textAlign: "center", marginTop: "10px" 
                    }}
                >
                    <button onClick={prevSlide} disabled={currentIndex === 0}>이전</button>
                    <button onClick={nextSlide} disabled={currentIndex === images.length - 1}>다음</button>
                </div>
            </div>
            
            <div className="productHead-right">
                <ProductHeadTitle />
            </div>
        </div>
    )
}