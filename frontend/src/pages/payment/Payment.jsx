import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import StepTabs from "./StepTabs";
import "./Payment.css"; // 클래식 CSS 연결
import DeliverySection from "./DeliverySection";
import PickupSection from "./PickupSection";
import OrderItemsSection from "./OrderItemsSection";
import PaymentInfoSection from "./PaymentInfoSection";
import OrderSubmitBar from "./OrderSubmitBar";

const Payment = () => {
  const location = useLocation();
  const [seller, setSeller] = useState(null); // 통합된 판매자 정보
  const [activeTab, setActiveTab] = useState("delivery");

  // 상품 상세페이지에서 전달받은 데이터
  const { product } = location.state || {};
  const products = product ? [product] : [];

  // 판매자 정보 가져오기 (한 번의 API 호출로 모든 정보 조회)
  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!product?.sellerId) {
        console.log("sellerId가 없습니다:", product);
        return;
      }

      try {
        console.log("판매자 정보 조회 시작. sellerId:", product.sellerId);

        const response = await axios.get(
          `http://localhost/api/sellers/${product.sellerId}`
        );
        console.log("판매자 정보 응답:", response.data);

        const sellerData = response.data.data.seller;
        setSeller(sellerData);
        console.log("판매자 정보 설정 완료:", sellerData);
      } catch (error) {
        console.error("판매자 정보 조회 실패:", error);
      }
    };

    fetchSellerInfo();
  }, [product?.sellerId]);

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
    console.log("🚚 배송비 계산 시작");
    console.log("주문 금액:", orderAmount);
    console.log("판매자 데이터:", sellerData);

    // 배송 불가능한 경우
    if (!sellerData || sellerData.deliveryAvailable !== "Y") {
      console.log("❌ 배송 불가능 - 픽업만 가능");
      return 0; // 픽업만 가능
    }

    // 최소 주문 금액 확인
    const minOrderAmount = parseInt(sellerData.minOrderAmount) || 0;
    console.log("최소 주문 금액:", minOrderAmount);

    if (orderAmount < minOrderAmount) {
      // 최소 주문 금액 미달 시 기본 배송비 + 추가 요금
      const defaultFee = sellerData.deliveryFeeDtos?.[0]?.deliveryTip || 3000;
      const penaltyFee = defaultFee + 2000;
      console.log("⚠️ 최소 주문 금액 미달 - 패널티 배송비:", penaltyFee);
      return penaltyFee;
    }

    // 배송비 단계별 적용
    const deliveryRules = sellerData.deliveryFeeDtos || [];
    console.log("배송비 규칙들:", deliveryRules);

    // 중복 제거를 위해 ordersMoney 기준으로 고유한 규칙만 필터링
    const uniqueRules = deliveryRules.filter(
      (rule, index, self) =>
        index === self.findIndex((r) => r.ordersMoney === rule.ordersMoney)
    );

    // 주문 금액 기준으로 오름차순 정렬
    const sortedRules = [...uniqueRules].sort((a, b) => a.ordersMoney - b.ordersMoney);
    console.log("정렬된 고유 규칙들:", sortedRules);

    // 주문 금액에 적용 가능한 가장 높은 기준 찾기
    let applicableFee = sortedRules[0]?.deliveryTip || 3000; // 첫 번째 규칙의 배송비를 기본값으로
    console.log("초기 배송비:", applicableFee);

    for (const rule of sortedRules) {
      console.log(`규칙 확인: ${rule.ordersMoney}원 이상 → ${rule.deliveryTip}원`);
      if (orderAmount >= rule.ordersMoney) {
        applicableFee = rule.deliveryTip;
        console.log(
          `✅ 적용된 배송비: ${applicableFee}원 (${rule.ordersMoney}원 이상 조건)`
        );
      }
    }

    console.log("🎯 최종 배송비:", applicableFee);
    return applicableFee;
  };

  // 실제 배달비 계산 (배송 탭일 때만)
  const deliveryFee =
    activeTab === "delivery" ? calculateDeliveryFee(totalProductPrice, seller) : 0;

  // 디버깅용 로그
  console.log("=== 배송비 계산 디버깅 ===");
  console.log("현재 탭:", activeTab);
  console.log("총 상품 금액:", totalProductPrice);
  console.log("판매자 데이터:", seller);
  console.log("계산된 배송비:", deliveryFee);
  console.log("======================");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-container">
        <StepTabs onTabChange={handleTabChange} />

        {/* 탭에 따른 컴포넌트 렌더링 */}
        {activeTab === "delivery" && <DeliverySection />}
        {activeTab === "pickup" && <PickupSection seller={seller} />}

        <OrderItemsSection products={products} deliveryFee={deliveryFee} />
        <PaymentInfoSection
          products={products}
          seller={seller}
          deliveryFee={deliveryFee}
          totalProductPrice={totalProductPrice}
          isPickup={activeTab === "pickup"}
        />
        <OrderSubmitBar
          products={products}
          seller={seller}
          deliveryFee={deliveryFee}
          totalProductPrice={totalProductPrice}
          isPickup={activeTab === "pickup"}
        />
      </div>
    </div>
  );
};

export default Payment;
