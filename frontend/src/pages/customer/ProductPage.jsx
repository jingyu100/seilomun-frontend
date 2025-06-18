import React, { useRef, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import useStoreInfo from "../../Hooks/useStoreInfo.js";
import useProductInfo from "../../Hooks/useProductInfo.js";
import "../../css/customer/Store.css";
import "../../css/customer/Product.css";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Footer from "../../components/Footer.jsx";
import StoreHead from "../../components/Store/StoreHead.jsx";
import StoreBody from "../../components/Store/StoreBody.jsx";
import ProductHead from "../../components/ProductPage/ProductHead.jsx";
import ChatViewModule from "../../components/sideBtn/Chatting/ChatViewModule.jsx";
import ChatRoomView from "../../components/sideBtn/Chatting/ChatRoomView.jsx";

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

    // 🔥 상품 사진과 가게 사진 분리
    // 상품 사진: product에서 가져옴
    const productImages = product?.productPhoto || [];

    // 가게 사진: store에서 가져옴 (기존 로직 유지)
    const sellerInformationDto = store?.sellerInformationDto;
    const storeImages = sellerInformationDto?.sellerPhotoUrls || ["/image/product1.jpg"];

    // 메인 배너에 표시할 이미지 결정 (상품 사진 우선, 없으면 가게 사진)
    const mainImages = productImages.length > 0 ? productImages : storeImages;

    console.log("🔍 ProductPage - 상품 사진:", productImages);
    console.log("🔍 ProductPage - 가게 사진:", storeImages);
    console.log("🔍 ProductPage - 메인 배너 이미지:", mainImages);

    // 이미지가 변경될 때 인덱스 초기화
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [mainImages]);

    // 자동 슬라이더 기능
    useEffect(() => {
        if (mainImages.length <= 1 || !isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === mainImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [mainImages.length, isAutoPlay]);

    // 슬라이더 함수들
    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === mainImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? mainImages.length - 1 : prevIndex - 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    // 마우스 이벤트 핸들러
    const handleMouseEnter = () => {
        setIsAutoPlay(false);
    };

    const handleMouseLeave = () => {
        setIsAutoPlay(true);
    };

    // 채팅 모듈 열기 함수
    const handleOpenChat = (chatRoom = null) => {
        if (chatRoom) {
            setSelectedChatRoom(chatRoom);
        }
        setIsChatOpen(true);
    };

    // 채팅 모듈 닫기 함수
    const handleCloseChat = () => {
        setIsChatOpen(false);
        setSelectedChatRoom(null);
    };

    // 채팅방 목록으로 돌아가기
    const handleBackToList = () => {
        setSelectedChatRoom(null);
    };

    // 바깥 클릭 시 채팅 모듈 닫기
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

    // 로딩 상태 처리
    if (!product || !store) {
        return (
            <div className="storeMain">
                <div className="header">
                    <Header />
                </div>
                <div className="loading-container" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                    fontSize: '18px',
                    color: '#666'
                }}>
                    상품 정보를 불러오는 중...
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="storeMain">
            <div className="header">
                <Header />
            </div>

            {/* 🔥 메인 배너에 상품 사진 또는 가게 사진 표시 */}
            <div
                className="storeBanner"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={mainImages[currentImageIndex]}
                    alt={`${productImages.length > 0 ? '상품' : '가게'} 이미지 ${currentImageIndex + 1}`}
                    className="storeImage"
                />

                {/* 이미지가 2개 이상일 때만 슬라이더 컨트롤 표시 */}
                {mainImages.length > 1 && (
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
                            {mainImages.map((_, index) => (
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
                            {currentImageIndex + 1} / {mainImages.length}
                        </div>
                    </>
                )}
            </div>

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
                                {/* 🔥 ProductHead 컴포넌트에 상품 정보 전달 */}
                                <div className="productHead">
                                    <ProductHead product={product} />
                                </div>

                                <div className="productRec">
                                    {/* 제품 추천 영역 */}
                                </div>

                                <div className="productBody">
                                    {/* 제품 설명 영역 */}
                                    <div className="product-description-section">
                                        <h3>상품 상세 설명</h3>
                                        <div className="product-description-content">
                                            {product?.productDto?.description || "상품 설명이 없습니다."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 채팅 모듈 - SideChatBtn과 동일한 스타일 */}
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