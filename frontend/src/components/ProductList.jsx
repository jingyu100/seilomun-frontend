import React from "react";
import "../css/customer/ProductList.css"; 
import { useState } from "react";

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
  {
    id: 8,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 9,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 10,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 11,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 12,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
    name: "발효훈연소시지 1팩 (50g*4개) 2종",
    price: "3,000원",
    regularPrice: "5,000원",
    address: "대구광역시 북구 복현동",
    discount: "40%",
    image: "/image/product1.jpg",
    date: "2024년 11월 13일까지",
  },
  {
    id: 13,
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
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-text">
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
    </div>
  );
};

const ProductList = () => {
  // 화면에 표시할 상품 개수 (기본: 12개)
  const [visibleCount, setVisibleCount] = useState(12);

  // "더보기" 버튼 클릭 시 6개씩 추가 표시
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  return (
    <div className="product-list">
      <div className="product-header">
        <div className="product-number-container">
          <h1 className="product-number">총 {products.length}개 상품</h1>
        </div>
        <div className="product-filter-container">
          <select className="product-filter">
            <option>기본 순</option>
            <option>최신 순</option>
            <option>별점높은 순</option>
            <option>별점낮은 순</option>
            <option>가격높은 순</option>
            <option>가격낮은 순</option>
          </select>
        </div>
      </div>

      {/* 상품 리스트 */}
      <div className="product-list-container">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 상품이 12개 이상일 때만 "더보기" 버튼 표시 */}
      {products.length > 12 && visibleCount < products.length && (
        <button className="product-list-moreBtn" onClick={handleLoadMore}>
          더보기
        </button>
      )}
    </div>
  );
};

export default ProductList;
