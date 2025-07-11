import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import SideMenuBtn from "../../components/sideBtn/SideMenuBtn.jsx";
import api, { API_BASE_URL } from "../../api/config.js";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const allParams = useParams();

  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 OrderDetailPage - 받은 orderId:", orderId);
    console.log("🔍 orderId 타입:", typeof orderId);
    console.log("🔍 URL params 전체:", allParams);
  }, [orderId, allParams]);

  // API 호출 함수 - 백엔드 구조에 맞춰 수정
  const fetchOrderDetail = async () => {
    try {
      setLoading(true);

      console.log("🌐 API 호출 시작 - orderId:", orderId);
      // ✅ 올바른 API 엔드포인트: /api/customers/orders/{orderId}
      console.log("🌐 API URL:", `${API_BASE_URL}/api/customers/orders/${orderId}`);

      const response = await api.get(`/api/customers/orders/${orderId}`);

      console.log("✅ 전체 API 응답:", response.data);

      // ✅ 백엔드 응답 구조: { "주문 상세 보기": OrderDetailResponseDto }
      const orderDetailData = response.data.data["주문 상세 보기"];
      console.log("✅ 주문 상세 데이터:", orderDetailData);

      // ✅ 백엔드 데이터 그대로 사용 (계산 없음)
      const transformedData = {
        storeName: orderDetailData?.storeName || "알 수 없는 상점",
        orderDate: orderDetailData?.orderDate || new Date().toISOString(),
        orderNumber: orderDetailData?.orderNumber || `ORD${orderId}`,
        orderItems: orderDetailData?.orderItems || [], // 그대로 사용
        totalAmount: Number(orderDetailData?.totalAmount) || 0,
        usedPoint: Number(orderDetailData?.usedPoint) || 0,
        deliveryFee: Number(orderDetailData?.deliveryFee) || 0,
        address: orderDetailData?.address || "주소 정보 없음",
        deliveryRequest: orderDetailData?.deliveryRequest || "요청사항 없음",
      };

      console.log("✅ 변환된 데이터:", transformedData);
      setOrderDetail(transformedData);
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      console.error("❌ 에러 상세:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 404) {
        setError(`주문 번호 ${orderId}를 찾을 수 없습니다.`);
      } else if (err.response?.status === 403) {
        setError("주문 정보에 접근할 권한이 없습니다.");
      } else {
        setError("주문 상세 정보를 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      console.log("🚀 orderId가 있어서 API 호출:", orderId);
      fetchOrderDetail();
    } else {
      console.log("⚠️ orderId가 없어서 더미 데이터 사용");
      setOrderDetail({
        storeName: "맛있는 치킨집",
        orderDate: "2025-06-17T18:30:00",
        orderNumber: "ORD20250617001",
        orderItems: [
          { productName: "후라이드 치킨", quantity: 1, price: 18000, totalPrice: 18000 },
          { productName: "양념 치킨", quantity: 1, price: 19000, totalPrice: 19000 },
          { productName: "치킨무", quantity: 2, price: 1000, totalPrice: 2000 },
        ],
        totalAmount: 42000,
        usedPoint: 2000,
        deliveryFee: 3000,
        address: "서울시 강남구 테헤란로 123, 456호",
        deliveryRequest: "문 앞에 놓아주세요",
      });
      setLoading(false);
    }
  }, [orderId]);

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
    // ✅ 안전한 숫자 변환 및 null/undefined 체크
    const numPrice = Number(price) || 0;
    return numPrice.toLocaleString("ko-KR") + "원";
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="OrderDetailPage">
        <div className="header">
          <Header />
        </div>
        <div
          className="body"
          style={{
            minHeight: "calc(100vh - 200px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <div>로딩 중...</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              주문 ID: {orderId || "없음"}
            </div>
          </div>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="OrderDetailPage">
        <div className="header">
          <Header />
        </div>
        <div
          className="body"
          style={{
            minHeight: "calc(100vh - 200px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "#d32f2f" }}>
            <h3>{error}</h3>
            <div style={{ fontSize: "14px", color: "#666", margin: "10px 0" }}>
              요청한 주문 ID: {orderId}
            </div>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              뒤로 가기
            </button>
          </div>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!orderDetail) {
    return (
      <div className="OrderDetailPage">
        <div className="header">
          <Header />
        </div>
        <div
          className="body"
          style={{
            minHeight: "calc(100vh - 200px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>주문 정보를 찾을 수 없습니다.</div>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }

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
              {orderDetail.orderItems?.map((item, index) => {
                // ✅ unitPrice는 이미 할인된 가격이므로 그대로 사용
                const discountedPrice = item.unitPrice || 0; // 이미 할인된 가격
                const discountRate = item.discountRate || 0; // 표시용 할인률
                const quantity = item.quantity || 1;

                // 원가 역산 (표시용)
                const originalPrice =
                  discountRate > 0
                    ? Math.round(discountedPrice / (1 - discountRate / 100))
                    : discountedPrice;

                // 총 가격 계산 (할인된 가격 × 수량)
                const totalPrice = discountedPrice * quantity;

                return (
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
                      <h4
                        style={{ margin: "0 0 5px 0", fontSize: "16px", color: "#333" }}
                      >
                        {item.productName || "상품명 없음"}
                      </h4>
                      <div style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                        {discountRate > 0 ? (
                          <>
                            <div>
                              원가:{" "}
                              <span
                                style={{ textDecoration: "line-through", color: "#999" }}
                              >
                                {formatPrice(originalPrice)}
                              </span>
                              <span style={{ color: "#e74c3c", marginLeft: "8px" }}>
                                ({discountRate}% 할인)
                              </span>
                            </div>
                            <div>
                              할인가:{" "}
                              <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
                                {formatPrice(discountedPrice)}
                              </span>{" "}
                              × {quantity}개
                            </div>
                          </>
                        ) : (
                          <div>
                            가격: {formatPrice(discountedPrice)} × {quantity}개
                          </div>
                        )}
                        {item.expiryDate && (
                          <div
                            style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}
                          >
                            유통기한:{" "}
                            {new Date(item.expiryDate).toLocaleDateString("ko-KR")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>
                      {formatPrice(totalPrice)}
                    </div>
                  </div>
                );
              })}
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
              {(() => {
                // ✅ 상품 총액 계산 (unitPrice는 이미 할인된 가격)
                const itemsTotal =
                  orderDetail.orderItems?.reduce((sum, item) => {
                    const discountedPrice = item.unitPrice || 0; // 이미 할인된 가격
                    const quantity = item.quantity || 1;
                    return sum + discountedPrice * quantity;
                  }, 0) || 0;

                return (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ color: "#666" }}>상품 금액</span>
                      <span>{formatPrice(itemsTotal)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ color: "#666" }}>배달비</span>
                      <span>{formatPrice(orderDetail.deliveryFee || 0)}</span>
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
                        -{formatPrice(orderDetail.usedPoint || 0)}
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
                        {/* ✅ 백엔드의 totalAmount 사용 (이미 모든 계산이 완료된 값) */}
                        {formatPrice(orderDetail.totalAmount || 0)}
                      </span>
                    </div>
                    {/* ✅ 실제 결제 금액 (포인트 차감 후) 추가 표시 */}
                    {(orderDetail.usedPoint || 0) > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "16px",
                          color: "#28a745",
                          marginTop: "10px",
                        }}
                      >
                        <span>실제 결제 금액</span>
                        <span>
                          {formatPrice(
                            (orderDetail.totalAmount || 0) - (orderDetail.usedPoint || 0)
                          )}
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
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
