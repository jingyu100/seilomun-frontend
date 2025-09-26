import "./OrderSubmitBar.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/config.js";

const OrderSubmitBar = ({
  products = [],
  deliveryFee = 0,
  totalProductPrice = 0,
  isPickup = false,
  finalAmount, // 부모에서 계산된 최종 금액
  deliveryInfo = {},
  pickupInfo = {},
  pointsToUse = 0,
}) => {
  const tossPaymentsRef = useRef(null);
  const currentOrderIdRef = useRef(null); // 현재 주문 ID를 저장할 ref
  const navigate = useNavigate();

  // 최종 결제 금액 계산 (부모에서 전달받은 값 우선 사용)
  const calculatedFinalAmount =
    finalAmount ??
    ((totalProductPrice || 0) + (isPickup ? 0 : (deliveryFee || 0)));

  useEffect(() => {
    if (window.TossPayments) {
      tossPaymentsRef.current = window.TossPayments(
        "test_ck_d46qopOB896A1WOwGApY3ZmM75y0"
      );
    } else {
      console.error("TossPayments SDK가 로드되지 않았습니다.");
    }
  }, []);

  // SDK 창 닫기 처리 함수
  const handlePaymentClose = async (orderId) => {
    if (!orderId) return;
    try {
      const response = await api.post(
        `/api/orders/close-payment/${orderId}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ 결제창 닫기 처리 완료:", response.data);
    } catch (error) {
      console.error("❌ 결제창 닫기 처리 실패:", error);
    }
  };

  // 유효성 검사 함수
  const validateOrderData = () => {
    if (!products || !products.length) {
      alert("주문할 상품이 없습니다.");
      return false;
    }

    if (!isPickup) {
      // 배송인 경우 주소 및 전화번호 확인
      if (!deliveryInfo || !deliveryInfo.mainAddress?.trim()) {
        alert("배송 주소를 입력해주세요.");
        return false;
      }
      if (
        !deliveryInfo.phoneFirst ||
        !deliveryInfo.phoneMiddle ||
        !deliveryInfo.phoneLast
      ) {
        alert("휴대전화 번호를 모두 입력해주세요.");
        return false;
      }
    }
    return true;
  };

  const handlePaymentClick = async () => {
    try {
      if (!validateOrderData()) return;

      if (!tossPaymentsRef.current) {
        alert("결제 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      // null 제거
      const validProducts = products.filter((p) => p && (p.id || p.productId));
      if (!validProducts.length) {
        alert("주문할 상품이 없습니다.");
        return;
      }

      const firstProduct = validProducts[0];
      const orderName =
        validProducts.length === 1
          ? `${firstProduct.name || "상품"} ${firstProduct.quantity || 1}개`
          : `${firstProduct.name || "상품"} 외 ${validProducts.length - 1}건`;

      const orderData = {
        usedPoints: pointsToUse || 0,
        memo: isPickup
          ? pickupInfo.pickupRequest || "픽업 주문"
          : deliveryInfo.deliveryRequest || "배송 주문",
        isDelivery: isPickup ? "N" : "Y",
        deliveryAddress: isPickup
          ? "매장 픽업"
          : `${deliveryInfo.mainAddress || ""} ${deliveryInfo.detailAddress || ""}`.trim(),
        orderProducts: validProducts.map((product) => ({
          productId: product.id || product.productId,
          quantity: product.quantity ?? 1,
          price: product.discountPrice ?? product.originalPrice ?? 0,
          currentDiscountRate: product.currentDiscountRate ?? 0,
        })),
        payType: "CARD",
        orderName,
        yourSuccessUrl: `${window.location.origin}/payment?result=success`,
        yourFailUrl: `${window.location.origin}/payment?result=fail`,
      };

      console.log("📦 최종 주문 데이터:", orderData);

      const response = await api.post("/api/orders/buy", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      const paymentData = response.data?.data?.Update;
      if (!paymentData) throw new Error("서버에서 결제 정보를 받지 못했습니다.");

      const realOrderId = paymentData.orderId;
      const transactionId = paymentData.transactionId;

      currentOrderIdRef.current = realOrderId;

      await tossPaymentsRef.current.requestPayment("CARD", {
        amount: calculatedFinalAmount,
        orderId: transactionId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName || "테스트 고객",
        customerEmail: paymentData.customerEmail || "test@example.com",
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
      });
    } catch (error) {
      console.error("🔴 결제 에러:", error);

      if (error?.code === "USER_CANCEL") {
        alert("결제가 취소되었습니다.");
        if (currentOrderIdRef.current) {
          await handlePaymentClose(currentOrderIdRef.current);
          currentOrderIdRef.current = null;
        }
      } else if (error?.code === "INVALID_PARAMETER") {
        alert("결제 정보에 오류가 있습니다. 다시 시도해주세요.");
      } else if (error?.response) {
        alert("서버 오류: " + (error.response.data.message || "에러 발생"));
      } else {
        alert("오류 발생: " + (error.message || "알 수 없는 오류"));
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
          {calculatedFinalAmount
            ? `${calculatedFinalAmount.toLocaleString()}원`
            : "계산 중..."}
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
