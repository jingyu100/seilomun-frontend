import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import useSellerProducts from "../../Hooks/useSellerProducts.js";
import "../../css/customer/Store.css";
import ProductFilter from "./ProductFilter";
import StoreProducts from "./StoreProducts";

export default function StoreMenu() {
  const { products } = useSellerProducts();
  const [sortType, setSortType] = useState("BASIC");

  const productList = useMemo(() => {
    if (!products) return [];

    const sortedProducts = [...products];

    switch (sortType) {
      case "LATEST":
        return sortedProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

      case "LOW_PRICE":
        return sortedProducts.sort((a, b) => a.discountPrice - b.discountPrice);

      case "HIGH_PRICE":
        return sortedProducts.sort((a, b) => b.discountPrice - a.discountPrice);

      case "HIGH_RATING":
        return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case "LOW_RATING":
        return sortedProducts.sort((a, b) => (a.rating || 0) - (b.rating || 0));

      case "EXPIRING":
        return sortedProducts.sort((a, b) => {
          const rateA = a.currentDiscountRate || 0;
          const rateB = b.currentDiscountRate || 0;
          return rateB - rateA;
        });

      case "BASIC":
      default:
        // 기본 정렬 - 원본 배열 그대로
        return sortedProducts;
    }
  }, [products, sortType]);

  return (
    <div className="storeMenu" style={{ position: "relative", padding: "30px 0 25px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "40px" }}>
        <ProductFilter setSortType={setSortType} />
      </div>

      <div className="productList">
        {productList.length === 0 ? (
          <div>등록된 제품이 없습니다.</div>
        ) : (
          productList.map((prod, index) => (
            <StoreProducts
              key={prod.id || index} // key는 고유값으로 주는게 좋아요
              id={prod.id}
              index={index}
              productId={prod.id}
              sellerId={sellerId}
              thumbnailUrl={
                prod.productPhotoUrl[0]?.startsWith("http")
                  ? prod.productPhotoUrl[0]
                  : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${prod.productPhotoUrl[0]}`
              }
              name={prod.name}
              date={prod.expiryDate}
              expiryDate={prod.expiryDate}
              description={prod.description}
              originalPrice={prod.originalPrice}
              maxDiscountRate={prod.maxDiscountRate}
              minDiscountRate={prod.minDiscountRate}
              discountPrice={prod.discountPrice}
              currentDiscountRate={prod.currentDiscountRate || "현재 할인"}
            />
          ))
        )}
      </div>
    </div>
  );
}
