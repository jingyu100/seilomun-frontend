import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/customer/SideBtnModules.css";
import { useCart } from "../../Context/CartContext";
import api, { API_BASE_URL } from "../../api/config.js";

function CartViewModule() {
  const { cartItems, setCartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seller, setSeller] = useState(null);

  // 판매자 정보 불러오기 (첫 상품 기준)
  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!cartItems || cartItems.length === 0) return;

      const firstSellerId = cartItems[0]?.sellerId || cartItems[0]?.seller?.id;

      if (!firstSellerId) return;

      try {
        const res = await api.get(`/api/sellers/${firstSellerId}`);
        setSeller(res.data.data.seller);
      } catch (err) {
        console.error("❌ 판매자 정보 조회 실패:", err);
      }
    };

    fetchSellerInfo();
  }, [cartItems]);

  // 장바구니 데이터 로딩 함수
  const loadCartData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1단계: 장바구니 목록 조회
      const cartResponse = await api.get("/api/carts");

      console.log("장바구니 응답:", cartResponse.data);

      const cartData = cartResponse.data?.data;

      if (
        !cartData ||
        !cartData.products ||
        Object.keys(cartData.products).length === 0
      ) {
        console.log("장바구니가 비어있습니다.");
        setCartItems([]);
        return;
      }

      // 2단계: 각 상품의 상세 정보 조회
      const productPromises = Object.entries(cartData.products).map(
        async ([productId, quantity]) => {
          try {
            console.log(`상품 ${productId} 조회 중... (수량: ${quantity})`);
            const productResponse = await api.get(`/api/products/${productId}`);

            const product = productResponse.data?.data?.Products;

            if (!product) {
              console.error(`상품 ${productId}의 데이터가 없습니다.`);
              return null;
            }

            // 장바구니 아이템 형태로 변환
            return {
              id: parseInt(productId), // Payment.jsx에서 사용하는 id 필드 추가
              productId: parseInt(productId),
              name: product.name || "상품명 없음",
              description: product.description || "",
              originalPrice: product.originalPrice || 0,
              discountPrice: product.discountPrice || product.originalPrice || 0,
              currentDiscountRate: product.currentDiscountRate || 0,
              quantity: quantity,
              stockQuantity: product.stockQuantity || 0,
              expiryDate: product.expiryDate || "",
              thumbnailUrl:
                product.photoUrl && product.photoUrl.length > 0
                  ? product.photoUrl[0]
                  : null,
              photoUrls: product.photoUrl || [],
              photoUrl: product.photoUrl || [], // OrderItemsSection에서 사용
              seller: product.seller || {},
              // 🔧 sellerId 제대로 설정 - 여러 가능성 체크
              sellerId:
                product.sellerId || product.seller?.id || product.seller?.sellerId,
              categoryId: product.categoryId || 0,
              status: product.status || "1",
              totalPrice:
                (product.discountPrice || product.originalPrice || 0) * quantity, // 총 가격 계산
            };
          } catch (error) {
            console.error(`상품 ${productId} 조회 실패:`, error);
            return null;
          }
        }
      );

      const productDetails = await Promise.all(productPromises);

      // null 값 제거 (조회 실패한 상품들)
      const validProducts = productDetails.filter((item) => item !== null);
      console.log("로드된 상품들:", validProducts);
      setCartItems(validProducts);
    } catch (error) {
      console.error("장바구니 데이터 로딩 실패:", error);
      setError("장바구니 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 장바구니 데이터 로딩
  useEffect(() => {
    loadCartData();
  }, []);

  // 가격 계산 함수들
  const calculations = useMemo(() => {
    const totalOriginalPrice = cartItems.reduce(
      (total, item) => total + item.originalPrice * item.quantity,
      0
    );

    const totalDiscountPrice = cartItems.reduce(
      (total, item) => total + item.discountPrice * item.quantity,
      0
    );

    const totalDiscountAmount = totalOriginalPrice - totalDiscountPrice;

    // seller 정보는 첫 번째 상품 기준
    const firstItem = cartItems[0];
    const sellerInfo = firstItem?.seller;

    let deliveryFee = 0;

    if (sellerInfo && sellerInfo.deliveryAvailable === "Y") {
      const rules = (sellerInfo.deliveryFeeDtos || []).filter(
        (rule, idx, self) =>
          idx === self.findIndex((r) => r.ordersMoney === rule.ordersMoney)
      );

      const sortedRules = [...rules].sort((a, b) => a.ordersMoney - b.ordersMoney);

      deliveryFee = sortedRules.length > 0 ? sortedRules[0].deliveryTip : 3000;

      for (const rule of sortedRules) {
        if (totalDiscountPrice >= rule.ordersMoney) {
          deliveryFee = rule.deliveryTip;
        }
      }
    } else {
      console.log("📦 배달 불가 매장이거나 seller 정보 없음");
    }

    const finalAmount = totalDiscountPrice + deliveryFee;

    return {
      totalOriginalPrice,
      totalDiscountPrice,
      totalDiscountAmount,
      deliveryFee,
      finalAmount,
    };
  }, [cartItems]);

  // 장바구니에서 상품 삭제
  const handleRemoveFromCart = async (productId) => {
    try {
      console.log("상품 삭제:", productId);
      // await removeFromCart(productId);
      // await loadCartData();
      // 1. 즉시 로컬 상태에서 제거 (UI 즉시 업데이트)
      // setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));

      // 2. 백엔드에서 삭제 (백그라운드에서 처리)
      await removeFromCart(productId);
    } catch (error) {
      console.error("장바구니 삭제 실패:", error);
      loadCartData();
    }
  };

  // 🆕 장바구니에서 구매하기 버튼 클릭
  const handleBuyFromCart = async () => {
    if (cartItems.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      return;
    }

    try {
      console.log("장바구니 구매 요청 시작");

      // 백엔드 API에 맞는 형태로 데이터 변환
      const cartItemsForAPI = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      console.log("API 요청 데이터:", cartItemsForAPI);

      // 백엔드에서 주문 정보 가져오기
      const response = await api.post("/api/orders/cart/buy", cartItemsForAPI, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("백엔드 응답:", response.data);

      // 🆕 응답에서 주문 상품 정보와 판매자 ID 추출
      const responseData = response.data?.data;
      const orderProducts =
        responseData?.orderProducts || responseData?.["주문페이지로 갑니다"] || [];
      const sellerId = responseData?.sellerId;

      console.log("주문 상품들:", orderProducts);
      console.log("판매자 ID:", sellerId);

      // 프론트엔드용 상품 정보와 백엔드 주문 정보 매핑
      const productsWithDetails = cartItems.map((cartItem) => {
        // 백엔드에서 받은 주문 정보 찾기
        const orderProduct = orderProducts.find(
          (op) => op.productId === cartItem.productId
        );

        return {
          ...cartItem,
          // 백엔드에서 계산된 할인가격으로 업데이트
          discountPrice: orderProduct?.price || cartItem.discountPrice,
          currentDiscountRate:
            orderProduct?.currentDiscountRate || cartItem.currentDiscountRate,
          // Payment 컴포넌트에서 필요한 추가 필드들
          totalPrice: (orderProduct?.price || cartItem.discountPrice) * cartItem.quantity,
          // 🆕 판매자 ID 추가
          sellerId: sellerId || cartItem.sellerId,
        };
      });

      console.log("결제 페이지로 전달할 상품들:", productsWithDetails);

      // 장바구니에서 온 것임을 표시하고 결제 페이지로 이동
      navigate("/payment", {
        state: {
          products: productsWithDetails, // 복수형으로 변경
          fromCart: true, // 장바구니에서 왔음을 표시
          sellerId: sellerId, // 🆕 판매자 ID 직접 전달
        },
      });
    } catch (error) {
      console.error("장바구니 구매 처리 실패:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("구매 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 유효기간 포맷팅 함수
  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) return "";
    try {
      return new Date(expiryDate).toLocaleDateString("ko-KR");
    } catch (error) {
      return "";
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="sideCartModule viewModule moduleFrame1">
        <div className="moduleFrame2">
          <h2 className="sideModuleTitle">장바구니</h2>
        </div>
        <div className="order-area">
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>장바구니 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="sideCartModule viewModule moduleFrame1">
        <div className="moduleFrame2">
          <h2 className="sideModuleTitle">장바구니</h2>
        </div>
        <div className="order-area">
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
            <button onClick={loadCartData} style={{ padding: "8px 16px" }}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sideCartModule viewModule moduleFrame1">
      <div className="moduleFrame2">
        <h2 className="sideModuleTitle">장바구니</h2>
      </div>

      <div className="order-area">
        <div className="order-inner moduleFrame2">
          <div className="sideCartTable moduleFrame2">
            <div className="sideCartTop">
              총
              <span className="cartTopCnt" style={{ fontWeight: "800" }}>
                {cartItems.length}건
              </span>
            </div>
          </div>

          <div className="cartModuleMain">
            {cartItems.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#666" }}>
                <p>장바구니가 비어있습니다.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div className="cartProduct displayFlex" key={item.productId}>
                  <div className="productUrl displayFlex">
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          marginRight: "10px",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                    <div className="productInfo" style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "15.5px", margin: "0 0 4px 0" }}>
                        {item.name}
                      </h3>
                      {item.expiryDate && (
                        <p
                          style={{ fontSize: "13px", color: "#666", margin: "0 0 4px 0" }}
                        >
                          유효기간: {formatExpiryDate(item.expiryDate)}
                        </p>
                      )}
                      <div
                        className="displayFlex"
                        style={{ alignItems: "center", gap: "8px", margin: "4px 0" }}
                      >
                        <p style={{ fontWeight: "600", margin: 0, color: "#e74c3c" }}>
                          {item.discountPrice?.toLocaleString()}원
                        </p>
                        {item.originalPrice !== item.discountPrice && (
                          <>
                            <p
                              style={{
                                textDecoration: "line-through",
                                color: "#999",
                                fontSize: "14px",
                                margin: 0,
                              }}
                            >
                              {item.originalPrice?.toLocaleString()}원
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "#e74c3c",
                                fontWeight: "600",
                                margin: 0,
                              }}
                            >
                              {item.currentDiscountRate}% 할인
                            </p>
                          </>
                        )}
                      </div>
                      <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                        수량: {item.quantity}개
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.productId)}
                      style={{
                        marginLeft: "auto",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        padding: "4px",
                        alignSelf: "flex-start",
                        marginRight: "8px",
                      }}
                      title="상품 삭제"
                    >
                      <img src="../../../image/icon/close_X.svg" alt="삭제" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="order-totalsummary moduleFrame1 moduleFrame2 displayFlex">
              <div className="order-subsummary displayFlex">
                <div>
                  상품 금액
                  <span>{calculations.totalOriginalPrice.toLocaleString()}원</span>
                </div>
                -
                <div>
                  할인 금액
                  <span style={{ color: "#e74c3c" }}>
                    {calculations.totalDiscountAmount.toLocaleString()}원
                  </span>
                </div>
                +
                <div>
                  배송비
                  <span>
                    {calculations.deliveryFee > 0
                      ? `${calculations.deliveryFee.toLocaleString()}원`
                      : "무료"}
                  </span>
                </div>
              </div>
              <div className="order-totalpay">
                결제 예정 금액
                <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
                  {calculations.finalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="cartBuy moduleFrame1 moduleFrame2">
          <button className="cartBuyBtn" onClick={handleBuyFromCart}>
            {cartItems.length}개 상품 구매하기
          </button>
        </div>
      )}
    </div>
  );
}

export default CartViewModule;
