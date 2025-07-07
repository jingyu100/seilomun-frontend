import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/customer/Main.css";
import api, { API_BASE_URL } from "../../api/config.js";

export default function MainSuggestProduct() {
  const [products, setProducts] = useState([]);
  const [visibleCount] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const shuffleAndPick = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchExpiringProducts = async () => {
      try {
        const res = await api.get("/api/products/search", {
          params: {
            keyword: "",
            filterType: "EXPIRING_SOON",
            sortType: "EXPIRING",
            page: 0,
            size: 99,
          },
        });
        const productList = res?.data?.content || [];

        const randomSubset = shuffleAndPick(productList, 12);
        setProducts(randomSubset);
      } catch (error) {
        console.error("임박 상품 조회 실패", error);
      }
    };

    fetchExpiringProducts();
  }, []);

  const getThumbnailUrl = (product) => {
    const url = product.thumbnailUrl;
    if (!url) return "/image/product1.jpg";
    return url.startsWith("http")
      ? url
      : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
  };

  const ProductCard = ({ product }) => (
    <Link
      to={`/sellers/${product.sellerId}/products/${product.id}`}
      className="product_card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <img src={getThumbnailUrl(product)} alt={product.name} className="product_image" />
      <div className="product_text">
        <h3 className="product_name">{product.name}</h3>
        <div className="product_info">
          <span className="product_price">
            {product.discountedPrice?.toLocaleString()}원
          </span>
          <div className="product_price_container">
            <span className="product_regularprice">
              {product.originalPrice?.toLocaleString()}원
            </span>
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

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + visibleCount, Math.max(products.length - visibleCount, 0))
    );
  };

  return products.length === 0 ? null :  (
    <div className="homepageUI">
      <div className="homepageTitle">
        <span className="homepageTitleUI">
          <h1>소비자 맞춤 추천 상품</h1>
        </span>
      </div>

      <div className="LSP_ProductList">
        <div className="LSP_Scroll_Area">
          <button
            className="LSP_nav_button prev"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ◀
          </button>

          <div className="LSP_ProductList_Container">
            {products.slice(currentIndex, currentIndex + visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <button
            className="LSP_nav_button next"
            onClick={handleNext}
            disabled={currentIndex + visibleCount >= products.length}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
