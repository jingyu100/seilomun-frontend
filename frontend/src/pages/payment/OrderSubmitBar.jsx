import "./OrderSubmitBar.css";
import axios from "axios";

const OrderSubmitBar = () => {
  const handlePaymentClick = async () => {
    try {
      const orderData = {
        usedPoints: 0,
        memo: "",
        isDelivery: "N",
        deliveryAddress: "서울시 강남구 역삼동",
        productId: 1, // 실제 존재하는 상품 ID
        quantity: 1,
        price: 5000, // 실제 가격
        currentDiscountRate: 25,
        payType: "card",
        orderName: "샘플 상품 주문",
        yourSuccessUrl: "http://localhost/api/orders/toss/success",
        yourFailUrl: "http://localhost/api/orders/toss/fail",
      };

      const response = await axios.post("http://localhost/api/orders/buy", orderData, {
        withCredentials: true,
      });

      const paymentUrl = response.data?.Update?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        console.error("서버 응답에 paymentUrl이 없습니다:", response.data);
        alert("결제 URL을 받아오지 못했습니다.");
      }
    } catch (error) {
      console.error("결제 요청 중 오류 발생 🔥");

      // axios 응답에 서버 에러 내용이 있는 경우 출력
      if (error.response) {
        console.error("🔸 status:", error.response.status);
        console.error("🔸 data:", error.response.data);
        console.error("🔸 headers:", error.response.headers);
        alert(`서버 오류: ${error.response.data?.message || "에러 발생"}`);
      } else if (error.request) {
        // 요청은 갔지만 응답이 없을 경우
        console.error("❌ 요청은 전송됐지만 응답이 없습니다:", error.request);
        alert("서버로부터 응답이 없습니다.");
      } else {
        // 요청 만들기 자체에서 실패
        console.error("❗ 요청 설정 중 에러 발생:", error.message);
        alert(`요청 에러: ${error.message}`);
      }
    }
  };

  return (
    <div className="payment-button-wrapper">
      <button className="payment-button" onClick={handlePaymentClick}>
        총 43,000원 결제하기
      </button>
    </div>
  );
};

export default OrderSubmitBar;
