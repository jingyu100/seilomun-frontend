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
  const currentOrderIdRef = useRef(null); // 현재 주문 ID를 저장할 ref

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

  // 주문 취소 API 호출 함수
  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
          `http://localhost/api/orders/cancel/${orderId}`,
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
      );

      console.log("주문 취소 완료:", response.data);
      alert("주문이 취소되었습니다.");

      // 필요에 따라 페이지 리다이렉트 또는 상태 업데이트
      // window.location.href = "/orders"; // 주문 목록으로 이동

    } catch (error) {
      console.error("주문 취소 실패:", error);
      if (error.response) {
        alert(`주문 취소 실패: ${error.response.data.message || "오류가 발생했습니다"}`);
      } else {
        alert("네트워크 오류가 발생했습니다.");
      }
    }
  };

  // SDK 창 닫기 처리 함수
  const handlePaymentClose = async (orderId) => {
    try {
      console.log("🔄 결제창 닫기 처리 시작:", orderId);
      
      const response = await axios.post(
        `http://localhost/api/orders/close-payment/${orderId}`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ 결제창 닫기 처리 완료:", response.data);
      
      // 성공 메시지 표시 (선택사항)
      if (response.data?.data?.message) {
        console.log("서버 메시지:", response.data.data.message);
      }

    } catch (error) {
      console.error("❌ 결제창 닫기 처리 실패:", error);
      
      if (error.response?.data?.error) {
        console.error("서버 에러:", error.response.data.error);
      }
      
      // 에러가 발생해도 사용자에게는 알리지 않음 (백그라운드 처리)
      // 필요시 에러 로깅 서비스에 전송
    }
  };

  const handlePaymentClick = async () => {
    try {
      // 디버깅: products 배열 확인
      console.log("🛒 결제 데이터 디버깅 시작");
      console.log("전체 products 배열:", products);
      console.log("products 길이:", products?.length);

      // 실제 상품 데이터 사용
      const firstProduct = products[0]; // 첫 번째 상품 기준 (여러 상품일 경우 수정 필요)
      console.log("첫 번째 상품 (firstProduct):", firstProduct);

      if (!firstProduct) {
        console.error("❌ firstProduct가 없습니다!");
        alert("주문할 상품이 없습니다.");
        return;
      }

      // 개별 필드 확인
      console.log("상품 ID:", firstProduct.id);
      console.log("상품명:", firstProduct.name);
      console.log("수량:", firstProduct.quantity);
      console.log("할인가:", firstProduct.discountPrice);
      console.log("원가:", firstProduct.originalPrice);
      console.log("할인율:", firstProduct.currentDiscountRate);

      // 백엔드 OrderDto 구조에 맞게 데이터 구성
      const orderData = {
        usedPoints: 0, // Integer로 포인트 사용량
        memo: "실제 주문", // 요청사항
        isDelivery: isPickup ? "N" : "Y", // Character - 배송여부 (Y/N)
        deliveryAddress: "서울시 강남구 테헤란로 123", // 실제로는 배송 정보에서 가져와야 함
        orderProducts: [
          {
            productId: firstProduct.id, // Long
            quantity: firstProduct.quantity || 1, // Integer
            price: firstProduct.discountPrice || firstProduct.originalPrice, // Integer
            currentDiscountRate: firstProduct.currentDiscountRate || 0, // Integer
          },
        ],
        payType: "CARD", // 결제 타입
        orderName: `${firstProduct.name} ${firstProduct.quantity || 1}개`, // 주문명
        yourSuccessUrl: "http://localhost/api/orders/toss/success",
        yourFailUrl: "http://localhost/api/orders/toss/fail",
      };

      console.log("📦 최종 주문 데이터:", orderData);
      console.log("📦 orderProducts 배열:", orderData.orderProducts);
      console.log("📦 orderProducts 길이:", orderData.orderProducts?.length);

      const response = await axios.post("http://localhost/api/orders/buy", orderData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const paymentData = response.data?.data?.Update;
      if (!paymentData) {
        throw new Error("서버에서 결제 정보를 받지 못했습니다.");
      }

      // 주문 ID를 ref에 저장 (Order 엔티티의 실제 ID)
      const realOrderId = paymentData.orderId; // Order 엔티티의 실제 ID
      const transactionId = paymentData.transactionId; // 결제 고유 식별자
      
      currentOrderIdRef.current = realOrderId;
      console.log("💾 저장된 Order ID:", realOrderId);
      console.log("💳 결제 Transaction ID:", transactionId);

      // TossPayments 결제 요청
      await tossPaymentsRef.current.requestPayment("CARD", {
        amount: finalAmount, // 실제 계산된 최종 금액 사용
        orderId: transactionId, // 결제 고유 식별자 (TossPayments용)
        orderName: paymentData.orderName,
        customerName: paymentData.customerName || "테스트 고객",
        customerEmail: paymentData.customerEmail || "test@example.com",
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
      });

    } catch (error) {
      console.log("🔍 에러 타입 확인:", error?.code, error?.message);
      
      if (error?.code === "USER_CANCEL") {
        console.log("🚫 사용자가 결제를 취소했습니다.");
        alert("결제가 취소되었습니다.");
        
        // 사용자가 결제창을 닫았을 때 close-payment API 호출
        if (currentOrderIdRef.current) {
          await handlePaymentClose(currentOrderIdRef.current);
          currentOrderIdRef.current = null; // 처리 후 초기화
        }
        
      } else if (error?.code === "INVALID_PARAMETER") {
        console.error("❌ 결제 파라미터 오류:", error);
        alert("결제 정보에 오류가 있습니다. 다시 시도해주세요.");
        
      } else if (error?.response) {
        console.error("❌ 서버 오류:", error.response.data);
        alert("서버 오류: " + (error.response.data.message || "에러 발생"));
        
      } else {
        console.error("❌ 기타 오류:", error);
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