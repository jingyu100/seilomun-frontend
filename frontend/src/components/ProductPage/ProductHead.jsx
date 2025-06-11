import React from "react";
import { useParams } from "react-router-dom";
import useSellerProducts from "../../Hooks/useSellerProducts";
import ProductHeadTitle from "./ProductHeadTitle";

export default function ProductHead() {
  const { sellerId, productId } = useParams();
  const { products } = useSellerProducts(sellerId);

  if (!products) return;

  const product = products.find((p) => String(p.id) === String(productId));

  if (!product) {
    return <div>해당 상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="productHead-inner productFlex">
      <div className="productHead-left">
        <img src={product.thumbnailUrl || "/images/default.jpg"} alt="상품 이미지" />
      </div>
      <div className="productHead-right">
        <ProductHeadTitle
          sellerId={sellerId}
          productId={product.id}
          thumbnailUrl={product.thumbnailUrl || "사진 없음"}
          name={product.name || "제품명 없음"}
          expiryDate={product.expiryDate || "유통기한 없음"}
          description={product.description || "제품 설명 없음"}
          originalPrice={product.originalPrice || "상품 가격 없음"}
          maxDiscountRate={product.maxDiscountRate || "최대 할인 없음"}
          minDiscountRate={product.minDiscountRate || "최소 할인 없음"}
          currentDiscountRate={product.currentDiscountRate || "현재 할인 없음"}
          discountPrice={product.discountPrice || "할인 가격 없음"}
        />
      </div>
    </div>
  );
}
