import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../css/customer/Main.css";

function MainNewMatch() {
  
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get("http://localhost/api/products/search", {
          params: {
            keyword: "",
            filterType: "RECENT",
            sortType: "LATEST",
            page: 0,
            size: 99,
          },
        });
        const productList = res?.data?.content || [];
        setProducts(productList);
        console.log("받은 최신 상품 목록:", productList);
      } catch (error) {
        console.error("임박 상품 조회 실패", error);
      }
    };

    fetchLatestProducts();
  }, []);

  const ProductCard = ({ product }) => {
    return (
      <Link
        to={`/sellers/${product.sellerId}/products/${product.id}`}
        className="NM_product_card"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={product.imageUrl || "/image/product1.jpg"}
          alt={product.name}
          className="NM_product_image"
        />
        <div className="NM_product_text">
          <h3 className="NM_product_name">{product.name}</h3>
          <div className="NM_product_info">
            <span className="NM_product_price">
              {product.discountPrice?.toLocaleString()}원
            </span>
            <div className="NM_product_price_container">
              <span className="NM_product_regularprice">
                {product.originalPrice?.toLocaleString()}원
              </span>
              {product.discountRate && (
                <span className="NM_product_discount">
                  {product.discountRate}%
                </span>
              )}
            </div>
          </div>
          <p className="NM_product_address">{product.address}</p>
          <p className="NM_product_date">{product.expiryDate}</p>
        </div>
      </Link>
    );
  };

  return (
    <div className="homepageUI">
      <div className="homepageTitle">
        <span className="homepageTitleUI">
          <h1>New 맞춤 추천 상품</h1>
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
