import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import StepTabs from "./StepTabs";
import "./Payment.css"; // 클래식 CSS 연결
import DeliverySection from "./DeliverySection";
import OrderItemsSection from "./OrderItemsSection";
import PaymentInfoSection from "./PaymentInfoSection";
import OrderSubmitBar from "./OrderSubmitBar";

const Payment = () => {
  const location = useLocation();
  const [sellerProducts, setSellerProducts] = useState(null);

  // 상품 상세페이지에서 전달받은 데이터
  const { product } = location.state || {};
  const products = product ? [product] : [];

  // 상품의 판매자 정보 가져오기
  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!product?.id) {
        console.log("상품 ID가 없습니다:", product);
        return;
      }

      try {
        console.log("상품 정보 조회 시작. 상품 ID:", product.id);

        // 상품 정보에서 판매자 ID 추출하여 판매자 정보 조회
        const productResponse = await axios.get(
          `http://localhost/api/products/${product.id}`
        );
        console.log("상품 정보 응답:", productResponse.data);

        const productData = productResponse.data.data.Products;
        const sellerData = productData.seller;
        console.log("상품 데이터:", productData);
        console.log("판매자 정보:", sellerData);

        if (sellerData) {
          // 상품 정보에 이미 판매자 배송비 정보가 포함되어 있음
          setSellerProducts(sellerData);
          console.log("판매자 배송비 정보 설정 완료:", sellerData);
        } else {
          console.log("판매자 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("판매자 정보 조회 실패:", error);
      }
    };

    fetchSellerInfo();
  }, [product?.id]);

  // 주문 상품 총액 계산
  const totalProductPrice = products.reduce((total, product) => {
    return (
      total +
      (product.totalPrice ||
        (product.discountPrice || product.originalPrice) * (product.quantity || 1))
    );
  }, 0);

  // 동적 배달비 계산 함수 - 백엔드 구조에 맞게 수정
  const calculateDeliveryFee = (orderAmount, sellerData) => {
    // 배송 불가능한 경우
    if (!sellerData || sellerData.deliveryAvailable !== "Y") {
      return 0; // 픽업만 가능
    }

    // 최소 주문 금액 확인
    const minOrderAmount = parseInt(sellerData.minOrderAmount) || 0;
    if (orderAmount < minOrderAmount) {
      // 최소 주문 금액 미달 시 기본 배송비 + 추가 요금
      const defaultFee = sellerData.deliveryFeeDtos?.[0]?.deliveryTip || 3000;
      return defaultFee + 2000; // 추가 요금
    }

    // 배송비 단계별 적용
    const deliveryRules = sellerData.deliveryFeeDtos || [];

    // 중복 제거를 위해 ordersMoney 기준으로 고유한 규칙만 필터링
    const uniqueRules = deliveryRules.filter(
      (rule, index, self) =>
        index === self.findIndex((r) => r.ordersMoney === rule.ordersMoney)
    );

    // 주문 금액 기준으로 오름차순 정렬
    const sortedRules = [...uniqueRules].sort((a, b) => a.ordersMoney - b.ordersMoney);

    // 주문 금액에 적용 가능한 가장 높은 기준 찾기
    let applicableFee = 3000; // 기본 배송비

    for (const rule of sortedRules) {
      if (orderAmount >= rule.ordersMoney) {
        applicableFee = rule.deliveryTip;
      }
    }

    return applicableFee;
  };

  // 실제 배달비 계산
  const deliveryFee = calculateDeliveryFee(totalProductPrice, sellerProducts);

  // 디버깅용 로그
  console.log("=== 배송비 계산 디버깅 ===");
  console.log("총 상품 금액:", totalProductPrice);
  console.log("판매자 데이터:", sellerProducts);
  console.log("계산된 배송비:", deliveryFee);
  console.log("======================");

  return (
    <div className="payment-wrapper">
      <div className="payment-container">
        <StepTabs />
        <DeliverySection />
        <OrderItemsSection products={products} deliveryFee={deliveryFee} />
        <PaymentInfoSection
          products={products}
          sellerProducts={sellerProducts}
          deliveryFee={deliveryFee}
          totalProductPrice={totalProductPrice}
        />
        <OrderSubmitBar
          products={products}
          sellerProducts={sellerProducts}
          deliveryFee={deliveryFee}
          totalProductPrice={totalProductPrice}
        />
      </div>
    </div>
  );
};

export default Payment;
