import React, { useState, useRef } from "react";
import React, { useState, useEffect } from "react";
// import { useParams, Navigate } from "react-router-dom";
import useStoreInfo from "../../Hooks/useStoreInfo.js";
import "../../css/customer/Store.css";
import Header from "../../components/Header.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import Footer from "../../components/Footer.jsx";
import StoreHead from "../../components/Store/StoreHead.jsx";
import StoreBody from "../../components/Store/StoreBody.jsx";
import ChatViewModule from "../../components/sideBtn/Chatting/ChatViewModule.jsx";
import ChatRoomView from "../../components/sideBtn/Chatting/ChatRoomView.jsx";

export default function StorePage() {
    const { store, sellerId } = useStoreInfo();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const chatModalRef = useRef(null);

    const sellerPhotoDto = store?.sellerPhotoDto;

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

    React.useEffect(() => {
        if (isChatOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isChatOpen]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true); // 자동재생 상태 추가

    const sellerInformationDto = store?.sellerInformationDto;
    const imageList = sellerInformationDto?.sellerPhotoUrls || ["/image/product1.jpg"];

    // 이미지가 변경될 때 인덱스 초기화
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [imageList]);

    // 자동 슬라이더 (isAutoPlay 상태도 체크)
    useEffect(() => {
        if (imageList.length <= 1 || !isAutoPlay) return; // 이미지가 1개 이하거나 자동재생이 꺼져있으면 실행 안함

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000); // 4초마다 자동으로 넘어감

        return () => clearInterval(interval); // 정리
    }, [imageList.length, isAutoPlay]); // isAutoPlay 의존성 추가

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

    // 마우스가 슬라이더 영역에 들어가면 자동재생 정지
    const handleMouseEnter = () => {
        setIsAutoPlay(false);
    };

    // 마우스가 슬라이더 영역에서 나가면 자동재생 재개
    const handleMouseLeave = () => {
        setIsAutoPlay(true);
    };

    return (
        <div className="storeMain">
            <div className="header">
                <Header />
            </div>

            <div className="storeBanner">
                <img
                    src={sellerPhotoDto?.photoUrl || "/image/product1.jpg"}
                    alt="가게 메인 이미지"
                    className="storeImage"
                />
            </div>

            <div className="storeUI">
                <SideMenuBtn />
                <div className="storeInner">
                    <div className="storeMargin">
                        <div className="storeHead">
                            <StoreHead
                                store={store}
                                sellerId={sellerId}
                                onOpenChat={handleOpenChat}
                            />
            <div
                className="storeBanner"
                onMouseEnter={handleMouseEnter} // 마우스 호버시 자동재생 정지
                onMouseLeave={handleMouseLeave}  // 마우스 벗어나면 자동재생 재개
            >
                <img
                    src={imageList[currentImageIndex]}
                    alt={`가게 이미지 ${currentImageIndex + 1}`}
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

            <div className="storeUI">
                <SideMenuBtn/>
                <div className="storeInner">
                    <div className="storeMargin">
                        <div className="storeHead">
                            <StoreHead store={store} sellerId={sellerId} />
                        </div>

                        <div className="storeBody">
                            <StoreBody store={store} sellerId={sellerId} />
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
                            bottom: "30px", // CSS와 동일한 위치
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