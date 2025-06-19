import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useSellerProducts from "../../Hooks/useSellerProducts";

export default function ProductHead({ product: productProp }) {
    const { sellerId, productId } = useParams();
    const { products } = useSellerProducts(sellerId);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // product 결정: prop 우선, 없으면 products에서 찾기
    const product = productProp || (products ? products.find((p) => String(p.id) === String(productId)) : null);

    console.log("ProductHead - product:", product);
    console.log("product.photoUrl:", product?.photoUrl);

    // 이미지 배열 준비 (이제 useSellerProducts에서 이미 S3 URL로 변환됨)
    const images = product?.photoUrl && Array.isArray(product.photoUrl) && product.photoUrl.length > 0
        ? product.photoUrl
        : [];

    const defaultImage = "/image/product1.jpg";
    const displayImages = images.length > 0 ? images : [defaultImage];
    const safeCurrentIndex = Math.min(currentImageIndex, displayImages.length - 1);

    console.log("displayImages:", displayImages);
    console.log("currentImageIndex:", currentImageIndex);

    // 이미지가 변경될 때 인덱스 초기화
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [product?.id]);

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
                setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                );
            } else if (e.key === "ArrowRight") {
                setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                );
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [images.length]);

    // 로딩 및 에러 상태
    if (!product && !products) {
        return <div>로딩 중...</div>;
    }

    if (!product) {
        return <div>해당 상품을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="productHead-inner productFlex">
            <div className="productHead-left">
                {/* 메인 이미지 영역 */}
                <div className="productHead-image-container">
                    <img
                        className="productHead-image"
                        src={displayImages[safeCurrentIndex]}
                        alt={`${product.name || '상품'} - 이미지 ${safeCurrentIndex + 1}`}
                        onError={(e) => {
                            console.log("이미지 로드 실패:", e.target.src);
                            if (e.target.src !== defaultImage) {
                                e.target.src = defaultImage;
                            }
                        }}
                        onLoad={() => {
                            console.log("이미지 로드 성공:", displayImages[safeCurrentIndex]);
                        }}
                    />

                    {/* 이미지 카운터 */}
                    {displayImages.length > 1 && (
                        <div className="image-counter">
                            {safeCurrentIndex + 1} / {displayImages.length}
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
                                className={`thumbnail-item ${index === safeCurrentIndex ? 'active' : ''}`}
                                onClick={() => selectImage(index)}
                            >
                                <img
                                    src={image}
                                    alt={`${product.name || '상품'} 썸네일 ${index + 1}`}
                                    onError={(e) => {
                                        console.log("썸네일 이미지 로드 실패:", e.target.src);
                                        if (e.target.src !== defaultImage) {
                                            e.target.src = defaultImage;
                                        }
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
}