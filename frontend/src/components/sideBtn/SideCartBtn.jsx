import React, { useState, useRef, useEffect } from "react";
import CartViewModule from "./CartViewModule";



const ProductsAlarm = [    
    {
        id: 'qdsf115eg',
        name: "커피 원두",
        price: "3,000원",
        regularPrice: "5,000원",
        address: "대구광역시 북구 복현동",
        discount: "40%",
        image: '/image/product1.jpg',
        date: "2025년 11월 13일까지",
        url: 'https://myungga.com/product/%EB%B8%8C%EB%9D%BC%EC%A7%88-%EB%AA%AC%ED%85%8C-%EC%95%8C%EB%A0%88%EA%B7%B8%EB%A0%88-%EB%AC%B8%EB%8F%84-%EB%85%B8%EB%B3%B4/161/category/49/display/1/',
        state: '해당 상품의 주문이 취소되었습니다.',
        sellerId: "",
        BRNumber: "123456"
    },
    {
        id: "f115eg",
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice: "5,000원",
        address: "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
        url: "",
        state: "해당 상품이 배송을 시작했습니다.",
        sellerId: "",
        BRNumber: "9876432"
    },
    {
        id: "f115eg",
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice: "5,000원",
        address: "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
        url: "",
        state: "해당 상품이 배송을 시작했습니다.",
        sellerId: "",
        BRNumber: "9876432"
    }
];



const SideCartBtn = () => {
    const [isCartModal, setisCartModal] = useState(false);
    const modalRef = useRef(null);
    const buttonRef = useRef(null); // 버튼 참조 추가

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
                ref={buttonRef} // 버튼에 ref 추가
                onClick={(e) => {
                    e.preventDefault();
                    toggleAlarmModal();
                }}
            >
                <em className="iconCount" id="shopping-bag-cnt">{ProductsAlarm.length}</em>
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
