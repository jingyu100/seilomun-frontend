import React, { useRef, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import useProductInfo from "../../Hooks/useProductInfo.js";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../css/customer/Product.css";
import ProductHeadTitle from "./ProductHeadTitle.jsx";

export default function ProductHead() {

    const { product } = useProductInfo();
    
    const productDto = product?.productDto;
    const productPhoto = product?.productPhoto;
    const productDocument = product?.productDocument;
    

    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        "/images/product1.jpg",
        "/images/product2.jpg",
        "/images/product3.jpg"
    ];
    
    const imageWidth = 510;
    // const currentIndex = ;
    
    const moveX = -imageWidth * currentIndex;

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      };
    
      const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
      };

    return (
        <div className="productHead-inner productFlex">
            <div className="productHead-left">
                <div className="productHead-image">
                    <ul className="productImg-slide productFlex"
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
                <ProductHeadTitle
                    thumbnailUrl= {productDto?.thumbnailUrl || "사진 없음"}
                    name= {productDto?.name || "제품명 없음"}
                    expiryDate= {productDto?.expiryDate || "유통기한 없음"}
                    description= {productDto?.description || "제품 설명 없음"}
                    originalPrice= {productDto?.originalPrice || "상품 가격 없음"}
                    maxDiscountRate= {productDto?. maxDiscountRate || "최대 할인"}
                    minDiscountRate= {productDto?. minDiscountRate || "최소 할인"}
                    discountPrice= {productDto?.discountPrice || "할인 가격 없음"}

                />
            </div>
        </div>
    )
}