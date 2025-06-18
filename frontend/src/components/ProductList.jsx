import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../css/customer/ProductList.css";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const filterType = searchParams.get("filterType") || "ALL";
  const sortType = searchParams.get("sortType") || "LATEST";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 화면에 표시할 상품 개수 (기본: 12개)
  const [visibleCount, setVisibleCount] = useState(12);

  // 정렬 옵션 정의
  const sortOptions = [
    { value: "LATEST", label: "최신순", icon: "🆕" },
    { value: "HIGHEST_RATING", label: "별점높은순", icon: "⭐" },
    { value: "LOWEST_RATING", label: "별점낮은순", icon: "📉" },
    { value: "HIGHEST_PRICE", label: "가격높은순", icon: "💰" },
    { value: "LOWEST_PRICE", label: "가격낮은순", icon: "💸" },
    { value: "EXPIRING", label: "임박순", icon: "⏰" }
  ];

  // "더보기" 버튼 클릭 시 8개씩 추가 표시
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  // 새로운 검색 시 visibleCount 초기화
  const resetVisibleCount = () => {
    setVisibleCount(12);
  };

  // 정렬 변경 핸들러
  const handleSortChange = (newSortType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortType', newSortType);

    // navigate를 사용하여 부드럽게 URL 변경 (페이지 새로고침 없음)
    navigate(`${window.location.pathname}?${newParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        resetVisibleCount(); // 새로운 검색 시 표시 개수 초기화

        console.log("검색 파라미터:", { keyword, categoryId, filterType, sortType });

        const res = await axios.get("http://localhost/api/products/search", {
          params: {
            keyword: keyword || undefined,
            categoryId: categoryId || undefined,
            filterType: filterType,
            sortType: sortType,
            page: 0,
            size: 99,
          },
        });

        const productList = res?.data?.content || [];
        setProducts(productList);
        console.log("받은 상품 목록:", productList);

      } catch (error) {
        console.error("상품 조회 실패", error);
        setError("상품을 불러오는데 실패했습니다.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, categoryId, filterType, sortType]);

  const getThumbnailUrl = (product) => {
    const url = product.thumbnailUrl;

    if (!url) return "/image/product1.jpg";

    return url.startsWith("http")
        ? url
        : `https://seilomun-bucket.s3.ap-northeast-2.amazonaws.com/${url}`;
  };

  const ProductCard = ({ product }) => {
    return (
        <Link
            to={`/sellers/${product.sellerId}/products/${product.id}`}
            className="product_card"
            style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="product-card">
            <img
                src={getThumbnailUrl(product)}
                alt={product.name}
                className="product_image"
            />
            <div className="product_text">
              <h3 className="product_name">{product.name}</h3>
              <div className="product_info">
                <span className="product_price">{product.discountedPrice?.toLocaleString()}원</span>
                <div className="product_price_container">
                  <span className="product_regularprice">{product.originalPrice?.toLocaleString()}원</span>
                  {product.discountRate && (
                      <span className="product_discount">{product.discountRate}%</span>
                  )}
                </div>
              </div>
              <p className="product_address">{product.address}</p>
              <p className="product_date">{product.expiryDate}</p>
            </div>
          </div>
        </Link>
    );
  };

  // 로딩 상태 표시
  if (loading) {
    return (
        <div className="product-list">
          <div className="loading-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#666'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <div>상품을 불러오는 중...</div>
            </div>
          </div>
        </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
        <div className="product-list">
          <div className="error-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#ef4444'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>❌</div>
              <div>{error}</div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="product-list">
        <div className="product-header">
          <div className="product-number-container">
            <h1 className="product-number">총 {products.length}개 상품</h1>

            {/* 현재 적용된 필터 정보 표시 */}
            <div style={{
              fontSize: '13px',
              color: '#666',
              marginTop: '4px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {keyword && (
                  <span style={{
                    background: '#e3f2fd',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: '#1976d2'
                  }}>
                  🔍 "{keyword}"
                </span>
              )}
              {categoryId && (
                  <span style={{
                    background: '#f3e5f5',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: '#7b1fa2'
                  }}>
                  📂 카테고리 {categoryId}
                </span>
              )}
              {filterType !== 'ALL' && (
                  <span style={{
                    background: '#e8f5e8',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: '#2e7d32'
                  }}>
                  🔧 {filterType === 'RECENT' ? '신상품' : filterType === 'EXPIRING_SOON' ? '임박특가' : filterType}
                </span>
              )}
            </div>
          </div>

          <div className="product-filter-container">
            {/* 기본 select 드롭다운 */}
            <select
                className="product-filter"
                value={sortType}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '120px', // 최소 너비 설정
                  width: 'auto' // 자동 너비
                }}
            >
              {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
              ))}
            </select>

            {/* 추가: 버튼 스타일 정렬 옵션 (모바일 친화적) */}
            <div className="sort-buttons" style={{
              display: 'none', // 기본적으로 숨김, CSS에서 모바일에서 보이도록 설정 가능
              gap: '4px',
              flexWrap: 'wrap'
            }}>
              {sortOptions.map((option) => (
                  <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`sort-button ${sortType === option.value ? 'active' : ''}`}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        border: sortType === option.value ? '2px solid #007bff' : '1px solid #ddd',
                        borderRadius: '16px',
                        backgroundColor: sortType === option.value ? '#e3f2fd' : 'white',
                        color: sortType === option.value ? '#007bff' : '#666',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
              ))}
            </div>
          </div>
        </div>

        {/* 상품이 없는 경우 */}
        {products.length === 0 && !loading && (
            <div className="no-products" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              fontSize: '16px',
              color: '#666',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                상품이 없습니다
              </div>
              <div style={{ fontSize: '14px', color: '#999' }}>
                다른 조건으로 검색해보세요
              </div>
            </div>
        )}

        {/* 상품 리스트 */}
        {products.length > 0 && (
            <div className="product-list-container">
              {products.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
        )}

        {/* "더보기" 버튼 */}
        {products.length > 12 && visibleCount < products.length && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                  className="product-list-moreBtn"
                  onClick={handleLoadMore}
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0056b3';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                    e.target.style.transform = 'translateY(0)';
                  }}
              >
                더보기 ({products.length - visibleCount}개 더 있음)
              </button>
            </div>
        )}
      </div>
  );
};

export default ProductList;