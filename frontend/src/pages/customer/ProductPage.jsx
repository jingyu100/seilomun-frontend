import React, { useRef, useEffect, useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import useStoreInfo from "../../Hooks/useStoreInfo.js";
import useProductInfo from "../../Hooks/useProductInfo.js";
// ... 기타 imports

export default function ProductPage() {
    const { product } = useProductInfo();
    const { store, sellerId } = useStoreInfo();

    // 채팅 관련 상태
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const chatModalRef = useRef(null);

    // 슬라이더 관련 상태
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    console.log("상품 데이터:", product);

    // 🔥 상품 사진 처리
    const productImages = useMemo(() => {
        if (!product || !product.productPhoto) {
            console.log("🔍 ProductPage - product 또는 productPhoto가 없음");
            return [];
        }

        const photoUrls = product.productPhoto; // useProductInfo에서 이미 배열로 설정됨

        console.log("🔍 ProductPage - 원본 상품 사진 URLs:", photoUrls);

        if (Array.isArray(photoUrls) && photoUrls.length > 0) {
            const processedImages = photoUrls.map(url => {
                if (!url) return null;

                // 이미 완전한 URL인 경우 그대로 사용
                if (url.startsWith("http")) {
                    return url;
                }

                // S3 URL로 변환 (필요한 경우)
                return `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
            }).filter(url => url !== null);

            console.log("✅ ProductPage - 처리된 상품 이미지:", processedImages);
            return processedImages;
        }

        console.log("❌ ProductPage - 상품 이미지가 빈 배열");
        return [];
    }, [product]);

    // 🔥 가게 사진 처리 (기존 로직)
    const storeImages = useMemo(() => {
        const sellerInformationDto = store?.sellerInformationDto;
        const urls = sellerInformationDto?.sellerPhotoUrls || ["/image/product1.jpg"];

        return urls.filter(url => url && typeof url === 'string' && url.trim() !== '');
    }, [store]);

    // 🔥 메인 배너에 표시할 이미지 결정 (상품 사진 우선, 없으면 가게 사진)
    const imageList = useMemo(() => {
        if (productImages.length > 0) {
            console.log("✅ 상품 사진을 배너에 표시:", productImages);
            return productImages;
        }
        console.log("✅ 가게 사진을 배너에 표시:", storeImages);
        return storeImages;
    }, [productImages, storeImages]);

    console.log("🔍 ProductPage - 상품 사진:", productImages);
    console.log("🔍 ProductPage - 가게 사진:", storeImages);
    console.log("🔍 ProductPage - 메인 배너 이미지:", imageList);

    // 이미지가 변경될 때 인덱스 초기화
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [imageList]);

    // 자동 슬라이더 기능
    useEffect(() => {
        if (imageList.length <= 1 || !isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [imageList.length, isAutoPlay]);

    // 나머지 함수들은 기존과 동일...
    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    const handleMouseEnter = () => {
        setIsAutoPlay(false);
    };

    const handleMouseLeave = () => {
        setIsAutoPlay(true);
    };

    // 채팅 관련 함수들도 기존과 동일...
    const handleOpenChat = (chatRoom = null) => {
        if (chatRoom) {
            setSelectedChatRoom(chatRoom);
        }
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setSelectedChatRoom(null);
    };

    const handleBackToList = () => {
        setSelectedChatRoom(null);
    };

    const handleOutsideClick = (e) => {
        if (chatModalRef.current && !chatModalRef.current.contains(e.target)) {
            handleCloseChat();
        }
    };

    useEffect(() => {
        if (isChatOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isChatOpen]);

    // JSX는 기존과 동일 (imageList만 변경됨)
    return (
        <div className="storeMain">
            <div className="header">
                <Header />
            </div>

            <div
                className="storeBanner"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={imageList[currentImageIndex]}
                    alt={`${productImages.length > 0 ? '상품' : '가게'} 이미지 ${currentImageIndex + 1}`}
                    className="storeImage"
                />

                {/* 이미지가 2개 이상일 때만 슬라이더 컨트롤 표시 */}
                {imageList.length > 1 && (
                    <>
                        {/* 이전/다음 버튼 */}
                        <button
                            className="slider-btn prev-btn"
                            onClick={goToPrevImage}
                            aria-label="이전 이미지"
                        >
                            &#8249;
                        </button>

                        <button
                            className="slider-btn next-btn"
                            onClick={goToNextImage}
                            aria-label="다음 이미지"
                        >
                            &#8250;
                        </button>

                        {/* 이미지 인디케이터 (점점점) */}
                        <div className="slider-indicators">
                            {imageList.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => goToImage(index)}
                                    aria-label={`${index + 1}번째 이미지로 이동`}
                                />
                            ))}
                        </div>

                        {/* 이미지 카운터 */}
                        <div className="image-counter">
                            {currentImageIndex + 1} / {imageList.length}
                        </div>
                    </>
                )}
            </div>

            {/* 나머지 JSX는 기존과 동일... */}
            <div className="storeUI">
                <SideMenuBtn />
                <div className="storeInner">
                    <div className="storeMargin">
                        <div
                            className="storeHead"
                            style={{
                                borderBottom: "1px solid #ededed",
                            }}
                        >
                            <StoreHead
                                store={store}
                                sellerId={sellerId}
                                onOpenChat={handleOpenChat}
                            />
                        </div>

                        <div className="productDetail">
                            <div className="productUI">
                                <div className="productHead">
                                    <ProductHead product={product} />
                                </div>

                                <div className="productRec">
                                </div>

                                <div className="productBody">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 채팅 모듈 - 기존과 동일 */}
                {isChatOpen && (
                    <div
                        ref={chatModalRef}
                        style={{
                            position: "fixed",
                            top: "auto",
                            bottom: "30px",
                            right: "53px",
                            zIndex: 9999,
                        }}
                    >
                        {selectedChatRoom ? (
                            <ChatRoomView
                                chatRoom={selectedChatRoom}
                                onBack={handleBackToList}
                            />
                        ) : (
                            <ChatViewModule />
                        )}
                    </div>
                )}
            </div>

            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}