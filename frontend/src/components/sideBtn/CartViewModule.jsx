import React, { useState } from 'react';
import '../../css/SideBtnModules.css';
import AlarmContents from "../AlarmContents.jsx";
import ProductsAlarm from '../ProductsAlarm.jsx';

function CartViewModule () {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="sideCartModule viewModule moduleFrame1">
            <div className='moduleFrame2'>
                <h2 className='sideModuleTitle'>장바구니</h2>
            </div>
            
            <div className='order-area'>
                <div className='order-inner moduleFrame2'>
                    <div className='sideCartTable moduleFrame2'>
                        <div className="">
                            총 
                            <span className=''
                                style={{fontWeight: '800'}}>
                                건
                            </span>
                        </div>
                        
                        <div className="cartModuleMain">
                            <AlarmContents product={ProductsAlarm} />           
                        </div>
                    </div>
                    <div className='order-totalsummary moduleFrame1 moduleFrame2'>
                        <div className='order-subsummary '>
                            <div>
                                선택 상품 금액
                                <span>8,900 원</span>
                            </div>
                            <span>
                                <svg style={{width: "11", height: "11" }} viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#C7C7C7" d="M.502 6h14v2h-14z"></path>
                                    <path fill="#C7C7C7" d="M6.502 0h2v14h-2z"></path>
                                </svg>
                            </span>
                            <div>
                                총 배송비
                                <span></span>
                            </div>
                            <span>
                                <svg style={{width: "11", height: "11"}} viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#C7C7C7" d="M.502 6h14v2h-14z"></path>
                                </svg>
                            </span>
                            <div>
                                할인 금액
                                <span></span>
                            </div>
                        </div>
                        <div>
                            주문 금액
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='cartBuy moduleFrame1 moduleFrame2'>
                <button className='cartBuyBtn'>바로 구매</button>
            </div>
        </div>  
    );
};

export default CartViewModule;