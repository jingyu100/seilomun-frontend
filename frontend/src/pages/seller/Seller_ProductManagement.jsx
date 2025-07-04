import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/seller/Seller_ProductManagement.css";
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import api, { S3_BASE_URL } from "../../api/config.js";

const Seller_ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 상품 목록 조회
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // 판매자 정보 먼저 조회
      const sellerResponse = await api.get("/api/sellers", {});

      const sellerId = sellerResponse.data.data.seller.sellerId;

      console.log("sellerId", sellerId);

      // 해당 판매자의 상품 목록 조회
      const productsResponse = await api.get(`/api/products/seller/${sellerId}`);

      console.log("productsResponse", productsResponse);

      setProducts(productsResponse.data || []);
    } catch (error) {
      console.error("상품 목록 조회 실패:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductImageUrl = (product) => {
    const url = Array.isArray(product.productPhotoUrl) && product.productPhotoUrl[0]
      ? product.productPhotoUrl[0]
      : "default.png";
  
    return url.startsWith("http") ? url : S3_BASE_URL + url;
  };
  

  // 상품 삭제
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/api/products/${productId}`, {});
        alert("상품이 삭제되었습니다.");
        fetchProducts(); // 목록 새로고침
      } catch (error) {
        console.error("상품 삭제 실패:", error);
        alert("상품 삭제에 실패했습니다.");
      }
    }
  };

  // 상품 상태 변경
  const handleStatusChange = async (productId, newStatus) => {
    try {
      await api.put(`/api/products/${productId}/status`, { status: newStatus });
      alert("상품 상태가 변경되었습니다.");
      fetchProducts();
    } catch (error) {
      console.error("상품 상태 변경 실패:", error);
      alert("상품 상태 변경에 실패했습니다.");
    }
  };

  // 상품 수정 - 레지스터 페이지로 이동
  const handleEditProduct = (productId) => {
    navigate(`/seller/product/update/${productId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "1":
        return "판매중";
      case "0":
        return "판매중지";
      case "E":
        return "품절";
      default:
        return "알수없음";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "1":
        return "status-active";
      case "0":
        return "status-inactive";
      case "E":
        return "status-soldout";
      default:
        return "status-unknown";
    }
  };

  if (loading) {
    return (
      <div>
        <Seller_Header />
        <div className="seller-product-management">
          <div className="loading">상품 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Seller_Header />
      <div className="seller-product-management">
        <div className="status-product-header">
          <h1 className="stauts-product-title-11"> 상품관리</h1>
          <p className="status-product-subtitle">
            상품의 현재 상태에 대해 확인 및 수정해보세요
          </p>
        </div>

        <div className="product-stats">
          <div className="stat-item">
            <span className="stat-label">전체 상품</span>
            <span className="stat-value">{products.length}개</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">판매중</span>
            <span className="stat-value">
              {products.filter((p) => p.status === "1").length}개
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">품절</span>
            <span className="stat-value">
              {products.filter((p) => p.status === "E").length}개
            </span>
          </div>
        </div>

        <div className="product-list">
          {products.length === 0 ? (
            <div className="empty-state">
              <p>등록된 상품이 없습니다.</p>
              <button
                className="register-btn"
                onClick={() => navigate("/seller/product/register")}
              >
                첫 상품 등록하기
              </button>
            </div>
          ) : (
            <div className="product-table">
              <div className="table-header">
                <div className="col-image">이미지</div>
                <div className="col-name">상품명</div>
                <div className="col-price">가격</div>
                <div className="col-stock">재고</div>
                <div className="col-status">상태</div>
                <div className="col-date">등록일</div>
                <div className="col-actions">관리</div>
              </div>

              {products.map((product) => (
                <div key={product.id} className="table-row">
              <div className="col-image">
                <img
                  src={getProductImageUrl(product)}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = S3_BASE_URL + "default.png";
                  }}
                />
              </div>
                  <div className="col-name">
                    <div className="product-name">{product.name}</div>
                    <div className="product-desc">{product.description}</div>
                  </div>
                  <div className="col-price">
                    <div className="original-price">
                      {product.originalPrice?.toLocaleString()}원
                    </div>
                    <div className="discount-info">
                      {product.minDiscountRate}~{product.maxDiscountRate}% 할인
                    </div>
                  </div>
                  <div className="col-stock">{product.stockQuantity}개</div>
                  <div className="col-status">
                    <span className={`status-badge ${getStatusClass(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </div>
                  <div className="col-date">{formatDate(product.createdAt)}</div>
                  <div className="col-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      수정
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      삭제
                    </button>
                    {product.status === "1" ? (
                      <button
                        className="status-btn inactive"
                        onClick={() => handleStatusChange(product.id, "0")}
                      >
                        판매중지
                      </button>
                    ) : (
                      <button
                        className="status-btn active"
                        onClick={() => handleStatusChange(product.id, "1")}
                      >
                        판매시작
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 플로팅 상품 등록 버튼 - 우측 하단 */}
      <div
        style={{
          position: "fixed",
          bottom: "100px",
          right: "38px",
          zIndex: 1000,
        }}
      >
        <button
          style={{
            backgroundColor: "#77ca80",
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "15px 25px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/seller/product/register")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#69b371";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#77ca80";
            e.target.style.transform = "scale(1)";
          }}
        >
          <span style={{ fontSize: "20px" }}>➕</span>
          상품 등록
        </button>
      </div>
    </div>
  );
};

export default Seller_ProductManagement;
