import React, { useState, useRef } from "react";
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