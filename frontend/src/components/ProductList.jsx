import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/customer/ProductList.css"; 

const ProductList = () => {

  const [products, setProducts] = useState([]);
  // 화면에 표시할 상품 개수 (기본: 12개)
  const [visibleCount, setVisibleCount] = useState(12);

  // "더보기" 버튼 클릭 시 6개씩 추가 표시
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

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
          <div className="product-card">
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
          </div>
      </Link>
    );
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
