import React, { useState, useEffect } from "react";
import ProductHeadTitle from "./ProductHeadTitle";
import { useParams } from "react-router-dom";
import useSellerProducts from "../../Hooks/useSellerProducts";


export default function ProductHead() {
    const { sellerId, productId } = useParams();
    const { products } = useSellerProducts(sellerId);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);

    // 디버깅을 위한 콘솔 로그
    console.log("ProductHead 렌더링 - sellerId:", sellerId, "productId:", productId);
    console.log("products:", products);

    // 모든 hooks를 먼저 선언 (조건부 return 이전에)
    useEffect(() => {
        if (products) {
            const product = products.find((p) => String(p.id) === String(productId));
            console.log("찾은 product:", product);

            if (product && product.photoUrl && Array.isArray(product.photoUrl)) {
                // 이미지 URL 처리
                const processedImages = product.photoUrl.map(url =>
                    url.startsWith("http")
                        ? url
                        : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`
                );
                console.log("처리된 이미지들:", processedImages);
                setImages(processedImages);
            } else {
                console.log("photoUrl이 없거나 배열이 아닙니다:", product?.photoUrl);
                setImages([]);
            }
        }
    }, [products, productId]);

    // 이미지 네비게이션 함수들
    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const selectImage = (index) => {
        setCurrentImageIndex(index);
    };

    // 키보드 네비게이션
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "ArrowLeft") {
                prevImage();
            } else if (e.key === "ArrowRight") {
                nextImage();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [images.length]);

    // 조건부 return은 모든 hooks 이후에
    if (!products) {
        console.log("products가 아직 로드되지 않음");
        return <div>로딩 중...</div>;
    }

    const product = products.find((p) => String(p.id) === String(productId));

    if (!product) {
        console.log("상품을 찾을 수 없음");
        return <div>해당 상품을 찾을 수 없습니다.</div>;
    }

    // 기본 이미지 설정
    const defaultImage = "/image/product1.jpg";
    const displayImages = images.length > 0 ? images : [defaultImage];

    console.log("displayImages:", displayImages);
    console.log("currentImageIndex:", currentImageIndex);

    try {
        return (
            <div className="productHead-inner productFlex">
                <div className="productHead-left">
                    {/* 메인 이미지 영역 */}
                    <div className="productHead-image-container">
                        <img
                            className="productHead-image"
                            src={displayImages[currentImageIndex]}
                            alt={`${product.name} - 이미지 ${currentImageIndex + 1}`}
                            onError={(e) => {
                                console.log("이미지 로드 실패:", e.target.src);
                                e.target.src = defaultImage;
                            }}
                            onLoad={() => {
                                console.log("이미지 로드 성공:", displayImages[currentImageIndex]);
                            }}
                        />

                        {/* 이미지 카운터 */}
                        {displayImages.length > 1 && (
                            <div className="image-counter">
                                {currentImageIndex + 1} / {displayImages.length}
                            </div>
                        )}

                        {/* 네비게이션 버튼 */}
                        {displayImages.length > 1 && (
                            <>
                                <button
                                    className="image-nav-btn prev"
                                    onClick={prevImage}
                                    aria-label="이전 이미지"
                                >
                                    ‹
                                </button>
                                <button
                                    className="image-nav-btn next"
                                    onClick={nextImage}
                                    aria-label="다음 이미지"
                                >
                                    ›
                                </button>
                            </>
                        )}
                    </div>

                    {/* 썸네일 네비게이션 */}
                    {displayImages.length > 1 && (
                        <div className="product-thumbnails">
                            {displayImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => selectImage(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} 썸네일 ${index + 1}`}
                                        onError={(e) => {
                                            console.log("썸네일 이미지 로드 실패:", e.target.src);
                                            e.target.src = defaultImage;
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="productHead-right">
                    <ProductHeadTitle
                        sellerId={sellerId}
                        productId={product.id}
                        thumbnailUrl={product.thumbnailUrl || "사진 없음"}
                        name={product.name || "제품명 없음"}
                        expiryDate={product.expiryDate || "유통기한 없음"}
                        description={product.description || "제품 설명 없음"}
                        originalPrice={product.originalPrice || "상품 가격 없음"}
                        maxDiscountRate={product.maxDiscountRate || "최대 할인 없음"}
                        minDiscountRate={product.minDiscountRate || "최소 할인 없음"}
                        currentDiscountRate={product.currentDiscountRate || "현재 할인 없음"}
                        discountPrice={product.discountPrice || "할인 가격 없음"}
                        stockQuantity={product.stockQuantity || "수량 정보 없음"}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error("ProductHead 렌더링 에러:", error);
        return <div>오류가 발생했습니다: {error.message}</div>;
    }
}