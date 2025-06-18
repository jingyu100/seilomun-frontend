import React, { useState, useEffect } from "react";
import ProductHeadTitle from "./ProductHeadTitle";

export default function ProductHead({ product }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);

    console.log("🔍 ProductHead - 받은 product prop:", product);

    // 두 가지 구조 모두 지원
    const productData = product?.productDto || product;

    // product가 없으면 로딩 표시
    if (!productData) {
        return <div>로딩 중...</div>;
    }

    console.log("🔍 ProductHead - productData:", productData);
    console.log("🔍 ProductHead - productPhotoUrl:", productData.productPhotoUrl);

    // 이미지 처리 useEffect
    useEffect(() => {
        // 여러 필드명 확인 (productPhotoUrl, photoUrl)
        const photoUrls = productData.productPhotoUrl || productData.photoUrl;

        if (photoUrls && Array.isArray(photoUrls)) {
            // 이미지 URL 처리
            const processedImages = photoUrls.map(url =>
                url.startsWith("http")
                    ? url
                    : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`
            );
            console.log("✅ 처리된 이미지들:", processedImages);
            setImages(processedImages);
        } else {
            console.log("❌ 이미지 URL이 없거나 배열이 아닙니다:", {
                productPhotoUrl: productData?.productPhotoUrl,
                photoUrl: productData?.photoUrl
            });
            setImages([]);
        }
    }, [productData]);

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

    // 기본 이미지 설정
    const defaultImage = "/image/product1.jpg";
    const displayImages = images.length > 0 ? images : [defaultImage];

    console.log("🖼️ 최종 displayImages:", displayImages);
    console.log("🖼️ currentImageIndex:", currentImageIndex);

    try {
        return (
            <div className="productHead-inner productFlex">
                <div className="productHead-left">
                    {/* 메인 이미지 영역 */}
                    <div className="productHead-image-container" style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                            className="productHead-image"
                            src={displayImages[currentImageIndex]}
                            alt={`${productData.name} - 이미지 ${currentImageIndex + 1}`}
                            onError={(e) => {
                                console.log("❌ 이미지 로드 실패:", e.target.src);
                                e.target.src = defaultImage;
                            }}
                            onLoad={() => {
                                console.log("✅ 이미지 로드 성공:", displayImages[currentImageIndex]);
                            }}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />

                        {/* 이미지 카운터 */}
                        {displayImages.length > 1 && (
                            <div className="image-counter" style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '15px',
                                fontSize: '12px',
                                zIndex: 2
                            }}>
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
                                    style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 2,
                                        transition: 'all 0.2s ease',
                                        opacity: 0.7
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.opacity = 1;
                                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.opacity = 0.7;
                                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                                        e.target.style.transform = 'translateY(-50%) scale(1)';
                                    }}
                                >
                                    ‹
                                </button>
                                <button
                                    className="image-nav-btn next"
                                    onClick={nextImage}
                                    aria-label="다음 이미지"
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 2,
                                        transition: 'all 0.2s ease',
                                        opacity: 0.7
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.opacity = 1;
                                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.opacity = 0.7;
                                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                                        e.target.style.transform = 'translateY(-50%) scale(1)';
                                    }}
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
                                        alt={`${productData.name} 썸네일 ${index + 1}`}
                                        onError={(e) => {
                                            console.log("❌ 썸네일 이미지 로드 실패:", e.target.src);
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
                        sellerId={productData.seller?.id || "알 수 없음"}
                        productId={productData.id}
                        thumbnailUrl={(productData.productPhotoUrl || productData.photoUrl)?.[0] || "사진 없음"}
                        name={productData.name || "제품명 없음"}
                        expiryDate={productData.expiryDate || "유통기한 없음"}
                        description={productData.description || "제품 설명 없음"}
                        originalPrice={productData.originalPrice || "상품 가격 없음"}
                        maxDiscountRate={productData.maxDiscountRate || "최대 할인 없음"}
                        minDiscountRate={productData.minDiscountRate || "최소 할인 없음"}
                        currentDiscountRate={productData.currentDiscountRate || "현재 할인 없음"}
                        discountPrice={productData.discountPrice || "할인 가격 없음"}
                        stockQuantity={productData.stockQuantity || "수량 정보 없음"}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error("❌ ProductHead 렌더링 에러:", error);
        return <div>오류가 발생했습니다: {error.message}</div>;
    }
}