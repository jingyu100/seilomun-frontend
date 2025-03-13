import React from "react";
import "../css/ProductList.css";

const products = [
    {
        id: 1,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 2,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,100원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 3,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 4,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 5,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 6,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 7,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 8,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 9,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 10,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 11,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },
    {
        id: 12,
        name: "발효훈연소시지 1팩 (50g*4개) 2종",
        price: "3,000원",
        regularPrice : "5,000원",
        address : "대구광역시 북구 복현동",
        discount: "40%",
        image: "/image/product1.jpg",
        date: "2024년 11월 13일까지",
    },

    // 추가 상품들...
];

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <div className="product-info">
                <span className="product-price">{product.price}</span>
                <div className="product-price-container">
                    <span className="product-regularprice">{product.regularPrice}</span>
                    <span className="product-discount">{product.discount}</span>
                </div>
            </div>
            <p className="product-address">{product.address}</p>
            <p className="product-date">{product.date}</p>
        </div>
    );
};

const ProductList = () => {
    return (
        <div className="product-list">
            <div className="product-header">
                <div className="product-number-container">
                    <h1 className= "product-number">총 {products.length}개 상품 </h1>
                </div>
                <div className="product-filter-container">
                    <select className= "product-filter">
                        <option>기본 순</option>
                        <option>최신 순</option>
                        <option>별점높은 순</option>
                        <option>별점낮은 순</option>
                    </select>
                </div>
            </div>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
