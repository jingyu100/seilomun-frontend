import "./OrderSubmitBar.css";
import axios from "axios";
import { useEffect, useRef } from "react";

const OrderSubmitBar = () => {
  const tossPaymentsRef = useRef(null);

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
      const quantity = 1;
      const originalPrice = 2000;
      const discountRate = 10;
      const discountedPrice = (originalPrice * (100 - discountRate)) / 100;

      const orderData = {
        usedPoints: 0,
        memo: "샘플 테스트 주문",
        isDelivery: "N",
        deliveryAddress: "서울시 강남구 테헤란로 123",
        productId: 19,
        quantity: quantity,
        price: discountedPrice,
        currentDiscountRate: discountRate,
        payType: "CARD",
        orderName: `샘플 상품 ${quantity}개`,
        yourSuccessUrl: "http://localhost/api/orders/toss/success", // ✅ 수정
        yourFailUrl: "http://localhost/api/orders/toss/fail", // ✅ 수정
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
        amount: paymentData.amount,
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
        총 1,800원 결제하기
      </button>
    </div>
  );
};

export default OrderSubmitBar;
