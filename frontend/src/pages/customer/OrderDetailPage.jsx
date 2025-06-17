import React from "react";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";

const OrderDetailPage = () => {
  // OrderDetailResponseDto에 맞춘 더미 데이터
  const orderDetail = {
    storeName: "맛있는 치킨집",
    orderDate: "2025-06-17T18:30:00",
    orderNumber: "ORD20250617001",
    orderItems: [
      {
        productName: "후라이드 치킨",
        quantity: 1,
        price: 18000,
        totalPrice: 18000,
      },
      {
        productName: "양념 치킨",
        quantity: 1,
        price: 19000,
        totalPrice: 19000,
      },
      {
        productName: "치킨무",
        quantity: 2,
        price: 1000,
        totalPrice: 2000,
      },
    ],
    totalAmount: 42000,
    usedPoint: 2000,
    deliveryFee: 3000,
    address: "서울시 강남구 테헤란로 123, 456호",
    deliveryRequest: "문 앞에 놓아주세요",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  return (
    <div className="OrderDetailPage">
      <div className="header">
        <Header />
      </div>

      <div className="body" style={{ minHeight: "calc(100vh - 200px)" }}>
        <div className="sideMargin">
          <SideMenuBtn />
        </div>

        <div
          className="main-content"
          style={{ maxWidth: "800px", margin: "40px auto 40px auto", padding: "0 20px" }}
        >
          {/* 주문 정보 헤더 */}
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #e9ecef",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "24px" }}>
              주문 상세
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <h3 style={{ margin: "0", color: "#007bff", fontSize: "20px" }}>
                  {orderDetail.storeName}
                </h3>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                  주문번호: {orderDetail.orderNumber}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>주문일시</p>
                <p style={{ margin: "5px 0 0 0", fontSize: "16px", fontWeight: "bold" }}>
                  {formatDate(orderDetail.orderDate)}
                </p>
              </div>
            </div>
          </div>

          {/* 주문 상품 목록 */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <h3 style={{ margin: "0", fontSize: "18px", color: "#333" }}>주문 상품</h3>
            </div>
            <div style={{ padding: "20px" }}>
              {orderDetail.orderItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 0",
                    borderBottom:
                      index < orderDetail.orderItems.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", color: "#333" }}>
                      {item.productName}
                    </h4>
                    <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                      {formatPrice(item.price)} × {item.quantity}개
                    </p>
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>
                    {formatPrice(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 정보 */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <h3 style={{ margin: "0", fontSize: "18px", color: "#333" }}>결제 정보</h3>
            </div>
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666" }}>상품 금액</span>
                <span>
                  {formatPrice(orderDetail.totalAmount - orderDetail.deliveryFee)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#666" }}>배달비</span>
                <span>{formatPrice(orderDetail.deliveryFee)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#007bff" }}>포인트 사용</span>
                <span style={{ color: "#007bff" }}>
                  -{formatPrice(orderDetail.usedPoint)}
                </span>
              </div>
              <hr
                style={{
                  margin: "15px 0",
                  border: "none",
                  borderTop: "1px solid #e9ecef",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                <span>총 결제 금액</span>
                <span style={{ color: "#007bff" }}>
                  {formatPrice(orderDetail.totalAmount - orderDetail.usedPoint)}
                </span>
              </div>
            </div>
          </div>

          {/* 배달 정보 */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <h3 style={{ margin: "0", fontSize: "18px", color: "#333" }}>배달 정보</h3>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "15px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                  배달 주소
                </h4>
                <p style={{ margin: "0", fontSize: "16px", color: "#333" }}>
                  {orderDetail.address}
                </p>
              </div>
              <div>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                  배달 요청사항
                </h4>
                <p
                  style={{
                    margin: "0",
                    fontSize: "16px",
                    color: "#333",
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  {orderDetail.deliveryRequest}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default OrderDetailPage;
