import React, { useRef, useState } from "react";
import "../../css/customer/Main.css";

function MainNewMatch() {

    const products = [
        {
            id: 1,
            name: "발효훈연소시지 1팩 (50g*4개) 2종",
            price: "3,000원",
            regularPrice: "5,000원",
            address: "대구광역시 북구 복현동",
            discount: "40%",
            image: "/image/product1.jpg",
            date: "2024년 11월 13일까지",
        },
        {
            id: 2,
            name: "발효훈연소시지 1팩 (50g*4개) 2종",
            price: "3,100원",
            regularPrice: "5,000원",
            address: "대구광역시 북구 복현동",
            discount: "40%",
            image: "/image/product1.jpg",
            date: "2024년 11월 13일까지",
        },
        {
            id: 3,
            name: "발효훈연소시지 1팩 (50g*4개) 2종",
            price: "3,000원",
            regularPrice: "5,000원",
            address: "대구광역시 북구 복현동",
            discount: "40%",
            image: "/image/product1.jpg",
            date: "2024년 11월 13일까지",
        },
        {
            id: 4,
            name: "발효훈연소시지 1팩 (50g*4개) 2종",
            price: "3,000원",
            regularPrice: "5,000원",
            address: "대구광역시 북구 복현동",
            discount: "40%",
            image: "/image/product1.jpg",
            date: "2024년 11월 13일까지",
        },
        {
            id: 5,
            name: "발효훈연소시지 1팩 (50g*4개) 2종",
            price: "3,000원",
            regularPrice: "5,000원",
            address: "대구광역시 북구 복현동",
            discount: "40%",
            image: "/image/product1.jpg",
            date: "2024년 11월 13일까지",
        },
        {
            id: 6,
            name: "발효훈연소시지 1팩 (50g*4개) 2종",
            price: "3,000원",
            regularPrice: "5,000원",
            address: "대구광역시 북구 복현동",
            discount: "40%",
            image: "/image/product1.jpg",
            date: "2024년 11월 13일까지",
        },
        {
            id: 7,
            name: "발효훈연소시지 1팩 (50g*4개) 2종",
            price: "3,000원",
            regularPrice: "5,000원",
            address: "대구광역시 북구 복현동",
            discount: "40%",
            image: "/image/product1.jpg",
            date: "2024년 11월 13일까지",
        },
    ];

    const ProductCard = ({ product }) => {
        return (
            <div className="NM_product_card">
                <img src={product.image} alt={product.name} className="NM_product_image" />
                <div className="NM_product_text">
                    <h3 className="NM_product_name">{product.name}</h3>
                    <div className="NM_product_info">
                        <span className="NM_product_price">{product.price}</span>
                        <div className="NM_product_price_container">
                            <span className="NM_product_regularprice">{product.regularPrice}</span>
                            <span className="NM_product_discount">{product.discount}</span>
                        </div>
                    </div>
                    <p className="NM_product_address">{product.address}</p>
                    <p className="NM_product_date">{product.date}</p>
                </div>
            </div>
        );
    };

    const [visibleCount, setVisibleCount] = useState(6);

    return (
        <div className="homepageUI">
            <div className="homepageTitle">
                <span className="homepageTitleUI">
                    <h1>
                        New 맞춤 추천 상품
                    </h1>
                </span>
            </div>

            <div className="NM_ProductList">
                {/* 상품 리스트 */}
                <div className="NM_ProductList_Container">
                    {products.slice(0, visibleCount).map((product) => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MainNewMatch;