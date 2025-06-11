import "./OrderSubmitBar.css";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OrderSubmitBar = ({
  products = [],
  isPickup = false,
  finalAmount, // 부모가 계산한 최종 금액!
}) => {
  const tossPaymentsRef = useRef(null);
  const navigate = useNavigate();

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

  const handleCancel = () => {
    if (window.confirm("결제를 취소하고 이전 페이지로 돌아가시겠습니까?")) {
      navigate(-1);
    }
  };

  return (
    <div className="order-submit-bar">
      <div className="payment-summary">
        <span>최종 결제 금액</span>
        <span className="final-amount">
          {finalAmount ? `${finalAmount.toLocaleString()}원` : "계산 중..."}
        </span>
      </div>
      <div className="button-group">
        <button onClick={handleCancel} className="cancel-button">
          취소하기
        </button>
        <button onClick={handlePaymentClick} className="submit-button">
          결제하기
        </button>
      </div>
    </div>
  );
};

export default OrderSubmitBar;
