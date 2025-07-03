import { useNavigate, useLocation } from "react-router-dom";
import api, { API_BASE_URL, S3_BASE_URL } from "../api/config.js";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AlarmContents from "./AlarmContents.jsx";
import mainLogo from "../image/logo/mainLogo.png";
import useLogin from "../Hooks/useLogin.js";
import SemiHeader from "./SemiHeader.jsx";
import CategoryMenu from "./sideBtn/CategoryMenu.jsx";
import "../css/header/header.css";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useNotificationContext } from "../Context/NotificationContext";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useLogin();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationContext(API_BASE_URL, "customer");
  const { cartItems, setCartItems, removeFromCart } = useCart();

  const [searchParams] = useSearchParams();
  const keywordFromURL = searchParams.get("keyword") || "";
  const [searchTerm, setSearchTerm] = useState(keywordFromURL);

  const navigate = useNavigate();
  const location = useLocation();

  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [searchHistory, setSearchHistory] = useState([]);
  const [popularKeywords, setPopularKeywords] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const categoryButtonRef = useRef(null);

  // 🛒 장바구니 관련 상태 추가
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // 🛒 장바구니 데이터 로딩 함수
  const loadCartData = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }

    setCartLoading(true);
    setCartError(null);

    try {
      // 1단계: 장바구니 목록 조회
      const cartResponse = await api.get("/api/carts");

      const cartData = cartResponse.data?.data;

      if (
        !cartData ||
        !cartData.products ||
        Object.keys(cartData.products).length === 0
      ) {
        setCartItems([]);
        return;
      }

      // 2단계: 각 상품의 상세 정보 조회
      const productPromises = Object.entries(cartData.products).map(
        async ([productId, quantity]) => {
          try {
            const productResponse = await api.get(`/api/products/${productId}`);

            const product = productResponse.data?.data?.Products;

            if (!product) {
              return null;
            }

            return {
              productId: parseInt(productId),
              name: product.name || "상품명 없음",
              description: product.description || "",
              originalPrice: product.originalPrice || 0,
              discountPrice: product.discountPrice || product.originalPrice || 0,
              currentDiscountRate: product.currentDiscountRate || 0,
              quantity: quantity,
              stockQuantity: product.stockQuantity || 0,
              expiryDate: product.expiryDate || "",
              productPhotoUrl:
                product.productPhotoUrl && product.productPhotoUrl.length > 0
                  ? product.productPhotoUrl[0]
                  : null,
              productPhotoUrls: product.productPhotoUrl || [],
              seller: product.seller || {},
              categoryId: product.categoryId || 0,
              status: product.status || "1",
            };
          } catch (error) {
            console.error(`상품 ${productId} 조회 실패:`, error);
            return null;
          }
        }
      );

      const productDetails = await Promise.all(productPromises);
      const validProducts = productDetails.filter((item) => item !== null);
      setCartItems(validProducts);
    } catch (error) {
      console.error("장바구니 데이터 로딩 실패:", error);
      setCartError("장바구니 데이터를 불러오는데 실패했습니다.");
    } finally {
      setCartLoading(false);
    }
  };

  // 🛒 장바구니에 담긴 상품 이미지 부분
    const productImageUrl = (item) => {
      const url =
        Array.isArray(item.productPhotoUrl) && item.productPhotoUrl[0]
          ? item.productPhotoUrl[0]
          : Array.isArray(item.photoUrl) && item.photoUrl[0]
          ? item.photoUrl[0]
          : null;
    
      if (!url) return "/images/default.jpg";
      return url.startsWith("http") ? url : `${S3_BASE_URL}${url}`;
    };

  // 🛒 컴포넌트 마운트 시와 로그인 상태 변경 시 장바구니 데이터 로딩
  useEffect(() => {
    loadCartData();
  }, [isLoggedIn]);

  // URL 변경 시 검색어 동기화
  useEffect(() => {
    const keywordFromURL = searchParams.get("keyword") || "";
    setSearchTerm(keywordFromURL);
  }, [searchParams]);

  // 🛒 장바구니에서 상품 삭제
  const handleRemoveFromCart = async (productId) => {
    try {
      // 1. 낙관적 업데이트: 먼저 UI에서 제거
      const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedCartItems);

      // 2. 서버에서 삭제 API 호출
      await api.delete(`/api/carts/${productId}`);

      console.log(`상품 ${productId} 삭제 완료`);
    } catch (error) {
      console.error("서버 삭제 실패:", error);

      // 서버 삭제 실패 시 원래 상태로 복구
      await loadCartData();

      // 사용자에게 알림
      alert("상품 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 🛒 유효기간 포맷팅 함수
  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) return "";
    try {
      return new Date(expiryDate).toLocaleDateString("ko-KR");
    } catch (error) {
      return "";
    }
  };

  // 현재 활성 메뉴를 판별하는 함수
  const getActiveMenu = () => {
    const { pathname, search } = location;

    if (pathname === "/") {
      return "home";
    }

    if (pathname === "/new") {
      const urlParams = new URLSearchParams(search);
      const filterType = urlParams.get("filterType");
      const keyword = urlParams.get("keyword");

      if (filterType === "RECENT" || keyword) {
        return "new";
      }
      if (filterType === "EXPIRING_SOON") {
        return "expiring";
      }
      return "new";
    }

    if (pathname === "/OrderList") {
      return "orders";
    }

    if (pathname === "/wish") {
      return "wishlist";
    }

    return null;
  };

  const activeMenu = getActiveMenu();

  const getMenuStyle = (menuType) => {
    if (activeMenu === menuType) {
      return {
        borderBottom: "2px solid rgb(0, 0, 0)",
        fontWeight: "600",
      };
    }
    return {};
  };

  // 검색 기록 로드
  useEffect(() => {
    if (isLoggedIn && isDropdownVisible && searchTerm.trim() === "") {
      const fetchSearchHistory = async () => {
        try {
          const res = await api.get("/api/search/history?page=0&size=10");
          const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
          setSearchHistory(keywords);
        } catch (err) {
          console.error("❌ 검색 기록 불러오기 실패:", err);
          setSearchHistory([]);
        }
      };

      fetchSearchHistory();
    } else if (!isLoggedIn) {
      setSearchHistory([]);
    }
  }, [isLoggedIn, isDropdownVisible, searchTerm]);

  // 인기 검색어 로드
  useEffect(() => {
    if (isDropdownVisible && searchTerm.trim() === "") {
      const fetchPopularKeywords = async () => {
        try {
          const res = await api.get("/api/search/popular?limit=5");
          setPopularKeywords(res.data?.data?.popularKeywords || []);
        } catch (err) {
          console.error("❌ 인기 검색어 불러오기 실패:", err);
          setPopularKeywords([]);
        }
      };

      fetchPopularKeywords();
    }
  }, [isDropdownVisible, searchTerm]);

  // 자동완성
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      setSearchResults([]);
      return;
    }

    if (searchTerm.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const controller = new AbortController();

        const [autoRes, fuzzyRes] = await Promise.all([
          api.get(`/api/search/autocomplete?prefix=${searchTerm}`, {
            signal: controller.signal,
          }),
          api.get(`/api/search/fuzzy?term=${searchTerm}`, {
            signal: controller.signal,
          }),
        ]);

        const autoSuggestions = autoRes.data?.data?.suggestions || [];
        const fuzzySuggestions = fuzzyRes.data?.data?.suggestions || [];

        const normalize = (item) => (typeof item === "string" ? item : item.keyword);

        const merged = [...autoSuggestions, ...fuzzySuggestions]
          .map(normalize)
          .filter((v, i, self) => self.indexOf(v) === i)
          .slice(0, 8);

        setSuggestions(merged);

        return () => controller.abort();
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("자동완성 API 호출 실패", err);
        }
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 100);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/logout", {
        username: user?.email,
        userType: "CUSTOMER",
      });

      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } catch (err) {
      console.log("로그아웃 실패:", err);
    }
  };

  const isMouseInsideDropdown = useRef(false);

  const handleSearchFocus = () => {
    setIsFocused(true);
    setIsDropdownVisible(true);
  };

  const handleSearchBlur = () => {
    if (isMouseInsideDropdown.current) {
      return;
    }

    setTimeout(() => {
      if (!isMouseInsideDropdown.current) {
        setIsFocused(false);
        setIsDropdownVisible(false);
        setSearchResults([]);
      }
    }, 100);
  };

  const handleSearchTermChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    if (newValue.trim() === "") {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    if (isLoggedIn) {
      try {
        await api.post(`/api/search/history?keyword=${encodeURIComponent(trimmed)}`, {});
      } catch (err) {
        console.error("검색 기록 저장 실패:", err);
      }
    }

    setSearchResults([]);
    setIsDropdownVisible(false);
    setIsFocused(false);

    navigate(`/new?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchTermClick = (term) => {
    setSearchTerm(term); // 검색어를 검색창에 설정
    setIsDropdownVisible(false); // 드롭다운 닫기
    setIsFocused(false);
    navigate(`/new?keyword=${encodeURIComponent(term)}`);
  };

  const handleDeleteHistoryItem = async (e, keyword) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await api.delete(`/api/search/history?keyword=${encodeURIComponent(keyword)}`);

      const res = await api.get("/api/search/history?page=0&size=10");
      const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
      setSearchHistory(keywords);

      setIsFocused(true);
      setIsDropdownVisible(true);
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const handleClearAllHistory = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await api.delete("/api/search/history/all");
      setSearchHistory([]);

      setIsFocused(true);
      setIsDropdownVisible(true);
    } catch (err) {
      console.error("전체 삭제 실패:", err);
    }
  };

  const handleCategoryMenuToggle = () => {
    console.log("🔵 Header 카테고리 버튼 클릭");
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  const handleCategoryMenuClose = () => {
    console.log("🔴 Header 카테고리 메뉴 닫기");
    setIsCategoryMenuOpen(false);
  };

  const handleCategorySelect = (categoryData) => {
    console.log("🎯 Header에서 선택된 카테고리:", categoryData);
    setSelectedCategoryData(categoryData);
    setIsCategoryMenuOpen(false);
  };

  return (
    <>
      <div className="head-area">
        <header>
          <div className="head-menu sideMargin" style={{ paddingTop: "15px" }}>
            <div className="head-top-menu">
              <div className="head-top-half">
                <div className="head-top-left"></div>
              </div>
              <div className="head-top-half">
                <div className="head-top-right">
                  <ul className="head-top-right">
                    {isLoggedIn ? (
                      <li className="logout">
                        <button onClick={() => navigate("/mypage")}>
                          {user?.nickname}님
                        </button>
                        <button onClick={handleLogout}>로그아웃</button>
                      </li>
                    ) : (
                      <>
                        <li className="login">
                          <a href="/login">로그인</a>
                        </li>
                        <li className="join">
                          <a href="/register">회원가입</a>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="head-mid">
              <div className="head-mid-menu">
                <div className="title-logo">
                  <h2>
                    <a href="/">
                      <div>
                        <img
                          src={mainLogo}
                          alt="sampleLogo"
                          style={{
                            position: "absolute",
                            width: "190px",
                            height: "70px",
                            top: "18px",
                            marginLeft: "110px",
                          }}
                        />
                      </div>
                    </a>
                  </h2>
                </div>
                <div className="search-ui product-search">
                  <div>
                    <form
                      className="search"
                      method="get"
                      action=""
                      onSubmit={handleSearchSubmit}
                    >
                      <div className="search-inner">
                        <div>
                          <input
                            type="text"
                            placeholder="상품을 검색하세요"
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                          />
                          <button type="submit" className="search-inputBtn">
                            <svg
                              width="30"
                              height="30"
                              fill="none"
                              viewBox="0 0 24 24"
                              className="search-icon"
                            >
                              <circle
                                cx="10.412"
                                cy="10.412"
                                r="7.482"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="1.5"
                              ></circle>
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="1.5"
                                d="M16.706 16.706L21 21"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* 검색 드롭다운 */}
                    {isFocused && (
                      <div
                        className="search-dropdown main-search-box"
                        onMouseEnter={() => {
                          isMouseInsideDropdown.current = true;
                        }}
                        onMouseLeave={() => {
                          isMouseInsideDropdown.current = false;
                        }}
                      >
                        {/* 검색어가 없을 때: 검색기록 + 인기검색어 */}
                        {searchTerm.trim() === "" && (
                          <div
                            className="search-sections-container"
                            style={{ display: "flex" }}
                          >
                            {/* 검색 기록 영역 */}
                            <div
                              className="search-section"
                              style={{ flex: "1", paddingRight: "8px" }}
                            >
                              <div className="search-section-header">
                                <h4 className="search-section-title">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="search-icon-small"
                                  >
                                    <path
                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                  최근 검색어
                                </h4>
                                {isLoggedIn && searchHistory.length > 0 && (
                                  <button
                                    className="clear-all-btn"
                                    onClick={handleClearAllHistory}
                                  >
                                    전체삭제
                                  </button>
                                )}
                              </div>

                              {isLoggedIn && searchHistory.length > 0 && (
                                <ul className="search-list">
                                  {searchHistory.map((item, i) => (
                                    <li key={i} className="search-item">
                                      <span
                                        className="search-item-text"
                                        onMouseDown={() =>
                                          handleSearchTermClick(
                                            typeof item === "string" ? item : item.keyword
                                          )
                                        }
                                      >
                                        <svg
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          className="history-icon"
                                        >
                                          <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          />
                                          <polyline
                                            points="12,6 12,12 16,14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          />
                                        </svg>
                                        {typeof item === "string" ? item : item.keyword}
                                      </span>
                                      <button
                                        className="delete-btn"
                                        onClick={(e) => handleDeleteHistoryItem(e, item)}
                                        title="삭제"
                                      >
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                        >
                                          <path
                                            d="M18 6L6 18M6 6l12 12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {(!isLoggedIn ||
                                (isLoggedIn && searchHistory.length === 0)) && (
                                <div
                                  className="empty-history-state"
                                  style={{
                                    textAlign: "center",
                                    padding: "20px 10px",
                                    color: "#666",
                                    fontSize: "14px",
                                  }}
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    style={{ marginBottom: "8px", opacity: "0.5" }}
                                  >
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                    <polyline
                                      points="12,6 12,12 16,14"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                  <p style={{ margin: "0" }}>
                                    {!isLoggedIn
                                      ? "로그인 후 검색기록을 확인하세요"
                                      : "검색기록이 없습니다"}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* 구분선 */}
                            <div
                              className="search-divider"
                              style={{
                                width: "1px",
                                backgroundColor: "#e0e0e0",
                                margin: "8px 0",
                              }}
                            ></div>

                            {/* 인기 검색어 영역 */}
                            <div
                              className="search-section"
                              style={{ flex: "1", paddingLeft: "8px" }}
                            >
                              <div className="search-section-header">
                                <h4 className="search-section-title">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="search-icon-small"
                                  >
                                    <polygon
                                      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                                      fill="currentColor"
                                    />
                                  </svg>
                                  인기 검색어
                                </h4>
                              </div>

                              {popularKeywords.length > 0 ? (
                                <ul className="search-list popular-list">
                                  {popularKeywords.map((item, i) => (
                                    <li
                                      key={i}
                                      className="search-item popular-item"
                                      onMouseDown={() =>
                                        handleSearchTermClick(item.keyword)
                                      }
                                    >
                                      <span className="popular-rank">{i + 1}</span>
                                      <span className="search-item-text popular-text">
                                        {item.keyword}
                                      </span>
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="trending-icon"
                                      >
                                        <path
                                          d="M7 17L17 7M17 7H8M17 7V16"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div
                                  className="empty-popular-state"
                                  style={{
                                    textAlign: "center",
                                    padding: "20px 10px",
                                    color: "#666",
                                    fontSize: "14px",
                                  }}
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    style={{ marginBottom: "8px", opacity: "0.5" }}
                                  >
                                    <polygon
                                      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                                      fill="currentColor"
                                    />
                                  </svg>
                                  <p style={{ margin: "0" }}>인기 검색어가 없습니다</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 검색어가 있을 때: 자동완성만 표시 */}
                        {searchTerm.trim() !== "" && (
                          <div>
                            {suggestions.length > 0 && (
                              <div className="search-section">
                                <div className="search-section-header">
                                  <h4 className="search-section-title">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      className="search-icon-small"
                                    >
                                      <circle
                                        cx="10.412"
                                        cy="10.412"
                                        r="7.482"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                      />
                                      <path
                                        d="M16.706 16.706L21 21"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                      />
                                    </svg>
                                    자동완성
                                  </h4>
                                </div>
                                <ul className="search-list autocomplete-list">
                                  {suggestions.map((s, i) => (
                                    <li
                                      key={i}
                                      className="search-item autocomplete-item"
                                      onMouseDown={() =>
                                        handleSearchTermClick(
                                          typeof s === "string" ? s : s.keyword
                                        )
                                      }
                                    >
                                      <span className="search-item-text">
                                        {typeof s === "string" ? s : s.keyword}
                                      </span>
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="arrow-icon"
                                      >
                                        <path
                                          d="M7 13L12 18L17 13M7 6L12 11L17 6"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        />
                                      </svg>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {suggestions.length === 0 && (
                              <div className="search-section">
                                <div
                                  className="empty-state"
                                  style={{
                                    padding: "32px 16px",
                                    textAlign: "center",
                                    color: "#6b7280",
                                  }}
                                >
                                  <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="empty-icon"
                                    style={{
                                      color: "#d1d5db",
                                      marginBottom: "12px",
                                    }}
                                  >
                                    <circle
                                      cx="10.412"
                                      cy="10.412"
                                      r="7.482"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    />
                                    <path
                                      d="M16.706 16.706L21 21"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    />
                                  </svg>
                                  <p
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "500",
                                      margin: "0 0 4px 0",
                                      color: "#374151",
                                    }}
                                  >
                                    검색어를 입력하세요
                                  </p>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#9ca3af",
                                    }}
                                  >
                                    원하는 상품을 찾아보세요
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 검색 결과는 메인 드롭다운 내부에 추가 */}
                    {searchTerm.trim() !== "" &&
                      isFocused &&
                      searchResults.length > 0 && (
                        <div
                          className="search-dropdown search-results-overlay"
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            width: "100%",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                            zIndex: 55,
                            marginTop: "4px",
                          }}
                          onMouseEnter={() => {
                            isMouseInsideDropdown.current = true;
                          }}
                          onMouseLeave={() => {
                            isMouseInsideDropdown.current = false;
                          }}
                        >
                          <div className="search-section">
                            <div className="search-section-header">
                              <h4 className="search-section-title">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="search-icon-small"
                                >
                                  <path
                                    d="M20 6L9 17L4 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                검색 결과
                              </h4>
                              <span className="result-count">
                                {searchResults.length}개
                              </span>
                            </div>

                            <ul className="search-list results-list">
                              {searchResults.map((product) => (
                                <li key={product.id} className="search-item result-item">
                                  <Link
                                    to={`/sellers/${product.sellerId}/products/${product.id}`}
                                    className="result-link"
                                    onClick={() => {
                                      setSearchResults([]);
                                      setSearchTerm("");
                                      setIsDropdownVisible(false);
                                    }}
                                  >
                                    <div className="result-content">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="product-icon"
                                      >
                                        <rect
                                          x="2"
                                          y="3"
                                          width="20"
                                          height="14"
                                          rx="2"
                                          ry="2"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        />
                                        <line
                                          x1="8"
                                          y1="21"
                                          x2="16"
                                          y2="21"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        />
                                        <line
                                          x1="12"
                                          y1="17"
                                          x2="12"
                                          y2="21"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        />
                                      </svg>
                                      <span className="result-name">{product.name}</span>
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="arrow-icon"
                                      >
                                        <path
                                          d="M9 18L15 12L9 6"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        />
                                      </svg>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                    {/* 검색 로딩 상태 - 오버레이로 표시 */}
                    {searchLoading && (
                      <div
                        className="search-dropdown loading-overlay"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "100%",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                          zIndex: 55,
                          marginTop: "4px",
                        }}
                        onMouseEnter={() => {
                          isMouseInsideDropdown.current = true;
                        }}
                        onMouseLeave={() => {
                          isMouseInsideDropdown.current = false;
                        }}
                      >
                        <div className="loading-state">
                          <div className="loading-spinner"></div>
                          <span>검색 중...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="icon-menu">
                  <ul className="icon-menuInner">
                    <li className="icon-Btn alarm-icon">
                      <div className="myAlarm myIcon">
                        <img
                          src="/image/icon/icon-bell.png"
                          alt="alarm"
                          style={{
                            width: "35px",
                            height: "35px",
                          }}
                        />
                      </div>
                      <em className="headIconCount" id="alarm-cnt">
                        {isLoggedIn ? unreadCount : 0}
                      </em>
                      <div className="alarm-frame">
                        <span className="alarm-contents">
                          <ul className="alarm-inner">
                            <AlarmContents
                              notifications={notifications}
                              markAllAsRead={markAllAsRead}
                              markAsRead={markAsRead}
                              isLoggedIn={isLoggedIn}
                            />
                          </ul>
                        </span>
                      </div>
                    </li>
                    <li className="icon-Btn shopping-bag-icon">
                      <div className="myBag myIcon">
                        <div>
                          <img
                            src="/image/icon/icon-shopping-bag.png"
                            alt="shoppingBag"
                            style={{
                              width: "35px",
                              height: "35px",
                            }}
                          />
                        </div>
                        <em className="headIconCount" id="shopping-bag-cnt">
                          {cartItems.length}
                        </em>
                      </div>
                      <div className="alarm-frame cart-frame">
                        <span className="cart-contents">
                          <div className="cart-inner">
                            <div className="headCart-title">장바구니</div>
                            {cartLoading ? (
                              <div className="headCart-loading">
                                <p>장바구니 로딩 중...</p>
                              </div>
                            ) : cartError ? (
                              <div className="headCart-error">
                                <p>{cartError}</p>
                                <button
                                  onClick={loadCartData}
                                  className="headCart-retry-btn"
                                >
                                  다시 시도
                                </button>
                              </div>
                            ) : cartItems.length === 0 ? (
                              <div className="noAlarm">
                                <p>
                                  {!isLoggedIn
                                    ? "로그인 후 장바구니를 확인하세요"
                                    : "장바구니에 담긴 상품이 없습니다."}
                                </p>
                              </div>
                            ) : (
                              <>
                                {cartItems.map((item) => (
                                  <div key={item.productId} className="headCart-item">
                                    {productImageUrl(item) && (
                                      <img src={productImageUrl(item)} alt={item.name} />
                                    )}
                                    <div className="headCart-item-info">
                                      <p className="headCart-item-info-name">
                                        {item.name}
                                      </p>
                                      <div className="headCart-item-price">
                                        <span className="headCart-discount">
                                          {item.discountPrice?.toLocaleString()}원
                                        </span>
                                        {item.originalPrice !== item.discountPrice && (
                                          <span className="headCart-original">
                                            {item.originalPrice?.toLocaleString()}원
                                          </span>
                                        )}
                                      </div>
                                      <p className="headCart-quantity">
                                        수량: {item.quantity}개
                                      </p>
                                      {item.expiryDate && (
                                        <p className="headCart-expiry">
                                          {formatExpiryDate(item.expiryDate)}
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      className="headCart-remove-btn"
                                      onClick={() => handleRemoveFromCart(item.productId)}
                                      title="상품 삭제"
                                    >
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                      >
                                        <path
                                          d="M18 6L6 18M6 6l12 12"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                                <div className="headCart-footer">
                                  <button
                                    onClick={() => navigate("/cart")}
                                    className="headCart-footer-btn"
                                  >
                                    장바구니 상세보기
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="head-bottom">
              <div className="category">
                <div
                  className="category-frame"
                  style={{
                    width: "48%",
                    maxWidth: "auto",
                    minWidth: "auto",
                    padding: "0 0px 3px 3px",
                  }}
                >
                  <button
                    ref={categoryButtonRef}
                    className="menu-font-st"
                    onClick={handleCategoryMenuToggle}
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "600",
                      padding: "4px",
                      paddingBottom: "8px",
                      height: "24px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span>
                      <img
                        src="/image/icon/icon_nav.svg"
                        alt="category"
                        style={{
                          marginRight: "8px",
                        }}
                      />
                    </span>
                    카테고리
                    <span></span>
                  </button>
                </div>
              </div>
              <nav
                className="menu-ui"
                style={{
                  whiteSpace: "nowrap",
                  justifyItems: "center",
                  paddingLeft: "20px",
                }}
              >
                <ul className="menu-inner">
                  <li className="">
                    <a
                      href="/"
                      className="menu-font-st menu-under"
                      style={getMenuStyle("home")}
                    >
                      홈
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="/"
                      className="menu-font-st menu-under"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/new?filterType=RECENT`);
                      }}
                      style={getMenuStyle("new")}
                    >
                      NEW
                    </a>
                  </li>
                  <li className="">
                    <a
                      href="/"
                      className="menu-font-st menu-under"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/new?filterType=EXPIRING_SOON`);
                      }}
                      style={getMenuStyle("expiring")}
                    >
                      임박특가
                    </a>
                  </li>
                  <li className="">
                    <Link
                      to="/OrderList"
                      className="menu-font-st menu-under"
                      style={getMenuStyle("orders")}
                    >
                      주문 목록
                    </Link>
                  </li>
                  <li className="">
                    <Link
                      to="/wish"
                      className="menu-font-st menu-under"
                      style={getMenuStyle("wishlist")}
                    >
                      위시리스트
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
      </div>

      <CategoryMenu
        isOpen={isCategoryMenuOpen}
        onClose={handleCategoryMenuClose}
        onCategorySelect={handleCategorySelect}
        buttonRef={categoryButtonRef}
      />

      {selectedCategoryData && (
        <div
          style={{
            backgroundColor: "#dbeafe",
            padding: "8px 0",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div
            className="sideMargin"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 16px",
            }}
          >
            <span
              style={{
                color: "#1e40af",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              📂 선택된 카테고리: {selectedCategoryData.name} (ID:{" "}
              {selectedCategoryData.id})
            </span>
            <button
              onClick={() => setSelectedCategoryData(null)}
              style={{
                color: "#2563eb",
                fontWeight: "bold",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                padding: "2px 6px",
              }}
              title="카테고리 선택 해제"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
