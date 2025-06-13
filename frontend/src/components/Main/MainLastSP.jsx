import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MainLastSP() {

  const [products, setProducts] = useState([]);
  const [visibleCount] = useState(4);

  useEffect(() => {
    const fetchExpiringProducts = async () => {
      try {
        const res = await axios.get("http://localhost/api/products/search", {
          params: {
            keyword: "",
            filterType: "EXPIRING_SOON",
            sortType: "EXPIRING",
            page: 0,
            size: 99,
          },
        });
        const productList = res?.data?.content || [];
        setProducts(productList);
        console.log("받은 임박 특가 상품 목록:", productList);
      } catch (error) {
        console.error("임박 상품 조회 실패", error);
      }
    };

    fetchExpiringProducts();
  }, []);

  const ProductCard = ({ product }) => {
    return (
      <Link
        to={`/sellers/${product.sellerId}/products/${product.id}`}
        className="product_card"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={product.imageUrl || "/image/product1.jpg"}
          alt={product.name}
          className="product_image"
        />
        <div className="product_text">
          <h3 className="product_name">{product.name}</h3>
          <div className="product_info">
            <span className="product_price">{product.discountPrice?.toLocaleString()}원</span>
            <div className="product_price_container">
              <span className="product_regularprice">{product.originalPrice?.toLocaleString()}원</span>
              {product.discountRate && (
                <span className="product_discount">{product.discountRate}%</span>
              )}
            </div>
          </div>
          <p className="product_address">{product.address}</p>
          <p className="product_date">{product.expiryDate}</p>
        </div>
      </Link>
    );
  };
  

  return (
    <div className="homepageUI">
      <div className="homepageTitle">
        <span className="homepageTitleUI">
          <h1>
            <a href="/sail">임박특가 추천</a>
          </h1>
        </span>
        <span className="homepageTitleUI allWatch">
          <a href="/sail">
            전체보기
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              className="titleResponsive_arrow"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.667 13.5l5-5-5-5"
              ></path>
            </svg>
          </a>
        </span>
      </div>

      <div className="LSP_ProductList">
        <div className="LSP_ProductList_Container">
          {products.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainLastSP;
