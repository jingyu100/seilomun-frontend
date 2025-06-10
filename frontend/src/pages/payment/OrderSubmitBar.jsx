import "./OrderSubmitBar.css";
import axios from "axios";
import { useEffect, useRef } from "react";

const OrderSubmitBar = ({
  products = [],
  deliveryFee,
  totalProductPrice,
  isPickup = false,
}) => {
  const tossPaymentsRef = useRef(null);

  // 최종 결제 금액 계산 (포인트는 PaymentInfoSection에서 처리)
  const finalAmount = totalProductPrice + (isPickup ? 0 : deliveryFee);

  useEffect(() => {
    if (window.TossPayments) {
      tossPaymentsRef.current = window.TossPayments(
        "test_ck_d46qopOB896A1WOwGApY3ZmM75y0"
      );
    } else {
      console.error("TossPayments SDK가 로드되지 않았습니다.");
    }
  }, []);

  const handlePaymentClick = async () => {
    try {
      // 실제 상품 데이터 사용
      const firstProduct = products[0]; // 첫 번째 상품 기준 (여러 상품일 경우 수정 필요)

      if (!firstProduct) {
        alert("주문할 상품이 없습니다.");
        return;
      }

      const orderData = {
        usedPoints: 0,
        memo: "실제 주문",
        isDelivery: isPickup ? "N" : "Y",
        deliveryAddress: "서울시 강남구 테헤란로 123", // 실제로는 배송 정보에서 가져와야 함
        productId: firstProduct.id,
        quantity: firstProduct.quantity || 1,
        price: firstProduct.discountPrice || firstProduct.originalPrice,
        currentDiscountRate: firstProduct.currentDiscountRate || 0,
        payType: "CARD",
        orderName: `${firstProduct.name} ${firstProduct.quantity || 1}개`,
        yourSuccessUrl: "http://localhost/api/orders/toss/success",
        yourFailUrl: "http://localhost/api/orders/toss/fail",
      };

      const response = await axios.post("http://localhost/api/orders/buy", orderData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const paymentData = response.data?.data?.Update;
      if (!paymentData) {
        throw new Error("서버에서 결제 정보를 받지 못했습니다.");
      }

      await tossPaymentsRef.current.requestPayment("CARD", {
        amount: finalAmount, // 실제 계산된 최종 금액 사용
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName || "테스트 고객",
        customerEmail: paymentData.customerEmail || "test@example.com",
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
      });
    } catch (error) {
      if (error?.code === "USER_CANCEL") {
        alert("결제가 취소되었습니다.");
      } else if (error?.response) {
        console.error("서버 오류:", error.response.data);
        alert("서버 오류: " + (error.response.data.message || "에러 발생"));
      } else {
        console.error("기타 오류:", error);
        alert("오류 발생: " + error.message);
      }
    }
  };

  return (
    <div className="payment-button-wrapper">
      <button className="payment-button" onClick={handlePaymentClick}>
        총 {finalAmount.toLocaleString()}원 {isPickup ? "포장주문하기" : "결제하기"}
      </button>
    </div>
  );
};

export default OrderSubmitBar;
