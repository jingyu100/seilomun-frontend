import React, { useState, useRef, useEffect } from "react";
import CartViewModule from "./CartViewModule";
import { useCart } from "../../Context/CartContext";

const SideCartBtn = () => {
    const [isCartModal, setisCartModal] = useState(false);
    const modalRef = useRef(null);
    const buttonRef = useRef(null);

    const { cartItems } = useCart();

    const toggleAlarmModal = () => {
        setisCartModal(prev => !prev);
    };

    useEffect(() => {
        const closeModal = (e) => {
            if (
                modalRef.current && !modalRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)
            ) {
                setisCartModal(false);
            }
        };

        if (isCartModal) {
            document.addEventListener("mousedown", closeModal);
        } else {
            document.removeEventListener("mousedown", closeModal);
        }

        return () => document.removeEventListener("mousedown", closeModal);
    }, [isCartModal]);

    return (
        <div>
            <a 
                href="#" 
                role="button" 
                className="sideMenuBtn" 
                ref={buttonRef}
                onClick={(e) => {
                    e.preventDefault();
                    toggleAlarmModal();
                }}
            >
                <em className="iconCount" id="shopping-bag-cnt">{cartItems.length}</em>
                <img 
                    src="/image/icon/icon-shopping-bag.png" 
                    alt="shopping-bag" 
                    className="sideBtnIcon"
                />
            </a>
            {isCartModal && (
                <div ref={modalRef}>
                    <CartViewModule />
                </div>
            )}
        </div>
    );
};

export default SideCartBtn;
