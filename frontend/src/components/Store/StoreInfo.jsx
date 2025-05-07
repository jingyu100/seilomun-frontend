import React, { useState, useRef, useEffect } from "react";
import "../../css/customer/Store.css";
import StoreInfoModal from "./StoreInfoModal.jsx";

export default function StoreInfo() {

    const [isInfoModal, setisInfoModal] = useState(false);
    const modalRef = useRef(null);
    const buttonRef = useRef(null); // 버튼 참조 추가

    const toggleInfoModal = () => {
        setisInfoModal(prev => !prev);
    };

    useEffect(() => {
        const closeModal = (e) => {
            if (
                modalRef.current && !modalRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)
            ) {
                setisInfoModal(false);
            }
        };
    
        document.addEventListener("mousedown", closeModal);
    
        return () => {
            document.removeEventListener("mousedown", closeModal);
        };
    }, [isInfoModal]);
    
    return (
        <div className="storeInfo storeRight-ui ">
            <div
                role="button"
                ref={buttonRef}
                onClick={(e) => {
                    e.preventDefault();
                    toggleInfoModal();
                }}
                style={{
                    padding: "3px",
                }}
            >
                <p>안내 및 혜택</p>
            </div>
            {isInfoModal && (
                <div ref={modalRef}>
                    <StoreInfoModal />
                </div>
            )}
        </div>
    )
}