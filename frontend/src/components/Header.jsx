import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState, useRef} from "react";
import {Link} from "react-router-dom";
import AlarmContents from "./AlarmContents.jsx";
import mainLogo from "../image/logo/mainLogo.png";
import useLogin from "../Hooks/useLogin.js";
import useNotifications from "../Hooks/useNotifications"; // 추가
import SemiHeader from "./SemiHeader.jsx";
import "../css/header/header.css"

const Header = () => {
    const {isLoggedIn, setIsLoggedIn, user, setUser} = useLogin();
    const {notifications, unreadCount, markAsRead, markAllAsRead} = useNotifications(
        "http://localhost",
        "customer"
    ); // 사용

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [popularKeywords, setPopularKeywords] = useState([]);

    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // 🔹 검색 기록만 로그인된 사용자에게 (분리)
    useEffect(() => {
        if (isLoggedIn && isDropdownVisible && searchTerm.trim() === "") {
            const fetchSearchHistory = async () => {
                try {
                    const res = await axios.get(
                        "http://localhost/api/search/history?page=0&size=10",
                        {
                            withCredentials: true,
                        }
                    );
                    const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
                    setSuggestions(keywords);
                } catch (err) {
                    console.error("❌ 검색 기록 불러오기 실패:", err);
                    setSuggestions([]);
                }
            };

            fetchSearchHistory();
        }
    }, [isLoggedIn, isDropdownVisible, searchTerm]);

    // 🔹 인기 검색어는 모든 사용자에게 (분리)
    useEffect(() => {
        if (isDropdownVisible && searchTerm.trim() === "") {
            const fetchPopularKeywords = async () => {
                try {
                    const res = await axios.get("http://localhost/api/search/popular?limit=5", {
                        withCredentials: true,
                    });
                    setPopularKeywords(res.data?.data?.popularKeywords || []);
                } catch (err) {
                    console.error("❌ 인기 검색어 불러오기 실패:", err);
                }
            };

            fetchPopularKeywords();
        }
    }, [isDropdownVisible, searchTerm]);

    useEffect(() => {
        if (searchTerm.trim() === "") return; // ✅ 공백일 땐 suggestions 유지

        // 🔥 입력 바뀌었으면 바로 이전 suggestions 잠깐 비우기 (UI 깜빡임 방지)
        setSuggestions([]);

        const fetchSuggestions = async () => {
            try {
                const [autoRes, fuzzyRes] = await Promise.all([
                    axios.get(`http://localhost/api/search/autocomplete?prefix=${searchTerm}`, {
                        withCredentials: true,
                    }),
                    axios.get(`http://localhost/api/search/fuzzy?term=${searchTerm}`, {
                        withCredentials: true,
                    }),
                ]);

                const autoSuggestions = autoRes.data?.data?.suggestions || [];
                const fuzzySuggestions = fuzzyRes.data?.data?.suggestions || [];

                const normalize = (item) => (typeof item === "string" ? item : item.keyword);

                const merged = [...autoSuggestions, ...fuzzySuggestions]
                    .map(normalize)
                    .filter((v, i, self) => self.indexOf(v) === i);

                setSuggestions(merged);
            } catch (err) {
                console.error("자동완성 API 호출 실패", err);
            }
        };

        const delayDebounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost/api/auth/logout",
                {
                    username: user?.email,
                },
                {
                    withCredentials: true,
                }
            );

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
        // 마우스가 드롭다운 안에 있으면 blur 무시
        if (isMouseInsideDropdown.current) {
            return;
        }

        // 약간의 딜레이로 blur 직후 항목 클릭 가능하게
        setTimeout(() => {
            if (!isMouseInsideDropdown.current) {
                setIsFocused(false);
                setIsDropdownVisible(false);
            }
        }, 200);
    };

    // 검색 api
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (!trimmed) return;

        // 🔹 검색 기록 저장은 로그인된 사용자만
        if (isLoggedIn) {
            try {
                await axios.post(
                    `http://localhost/api/search/history?keyword=${encodeURIComponent(trimmed)}`,
                    {},
                    {withCredentials: true}
                );
            } catch (err) {
                console.error("검색 기록 저장 실패:", err);
            }
        }

        try {
            setSearchLoading(true);
            const res = await axios.get("http://localhost/api/products/search", {
                params: {
                    keyword: trimmed,
                    filterType: "ALL",
                    sortType: "LATEST",
                    page: 0,
                    size: 10,
                },
            });

            const products = res.data?.content || [];

            // 상품명으로만 필터링
            const filtered = products.filter((p) =>
                p.name.toLowerCase().includes(trimmed.toLowerCase())
            );

            // 검색어가 이름과 정확히 일치하는 단일 상품이면 바로 이동
            if (
                filtered.length === 1 &&
                filtered[0].name.trim().toLowerCase() === trimmed.toLowerCase()
            ) {
                const p = filtered[0];
                return navigate(`/sellers/${p.sellerId}/products/${p.id}`);
            }

            // 필터링된 결과만 보여줌
            setSearchResults(filtered);
            setIsDropdownVisible(true);
        } catch (err) {
            console.error("상품 검색 실패:", err);
            alert("검색 중 오류가 발생했습니다.");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleDeleteHistoryItem = async (e, keyword) => {
        e.stopPropagation(); // 이벤트 전파 방지
        e.preventDefault(); // 기본 동작 방지

        try {
            await axios.delete(
                `http://localhost/api/search/history?keyword=${encodeURIComponent(keyword)}`,
                {withCredentials: true}
            );

            // 검색 기록 다시 불러오기
            const res = await axios.get("http://localhost/api/search/history?page=0&size=10", {
                withCredentials: true,
            });
            const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
            setSuggestions(keywords);

            // 포커스 상태 유지
            setIsFocused(true);
            setIsDropdownVisible(true);

        } catch (err) {
            console.error("삭제 실패:", err);
        } finally {
            // 삭제 완료
        }
    };

    const handleClearAllHistory = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            await axios.delete("http://localhost/api/search/history/all", {
                withCredentials: true,
            });
            setSuggestions([]);

            // 포커스 상태 유지
            setIsFocused(true);
            setIsDropdownVisible(true);

        } catch (err) {
            console.error("전체 삭제 실패:", err);
        }
    };

    return (
        <div className="head-area">
            <header>
                <div className="head-menu sideMargin">
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
                                            {/* <!-- 프로젝트 로고 --> */}
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
                                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                                            stroke-linecap="round"
                                                            stroke-width="1.5"
                                                        ></circle>
                                                        <path
                                                            stroke="currentColor"
                                                            stroke-linecap="round"
                                                            stroke-width="1.5"
                                                            d="M16.706 16.706L21 21"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* 🔹 검색창 포커스 시 & 검색어 없을 때 표시되는 영역 */}
                                    {isFocused && searchTerm.trim() === "" && (
                                        <div
                                            className="search-dropdown history-popular-box"
                                            onMouseEnter={() => {
                                                isMouseInsideDropdown.current = true;
                                            }}
                                            onMouseLeave={() => {
                                                isMouseInsideDropdown.current = false;
                                            }}
                                        >
                                            <div className="search-sections-container">
                                                {/* 🔹 검색 기록 (로그인된 사용자만) */}
                                                {isLoggedIn && suggestions.length > 0 && (
                                                    <div className="search-section">
                                                        <div className="search-section-header">
                                                            <h4 className="search-section-title">
                                                                <svg width="16" height="16" viewBox="0 0 24 24"
                                                                     fill="none" className="search-icon-small">
                                                                    <path
                                                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                                                        fill="currentColor"/>
                                                                </svg>
                                                                최근 검색어
                                                            </h4>
                                                            <button
                                                                className="clear-all-btn"
                                                                onClick={handleClearAllHistory}
                                                            >
                                                                전체삭제
                                                            </button>
                                                        </div>
                                                        <ul className="search-list">
                                                            {suggestions.map((item, i) => (
                                                                <li key={i} className="search-item">
              <span
                  className="search-item-text"
                  onMouseDown={() => setSearchTerm(typeof item === "string" ? item : item.keyword)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="history-icon">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                  {typeof item === "string" ? item : item.keyword}
              </span>
                                                                    <button
                                                                        className="delete-btn"
                                                                        onClick={(e) => handleDeleteHistoryItem(e, item)}
                                                                        title="삭제"
                                                                    >
                                                                        <svg width="12" height="12" viewBox="0 0 24 24"
                                                                             fill="none">
                                                                            <path d="M18 6L6 18M6 6l12 12"
                                                                                  stroke="currentColor" strokeWidth="2"
                                                                                  strokeLinecap="round"/>
                                                                        </svg>
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* 🔹 인기 검색어 (모든 사용자) */}
                                                {popularKeywords.length > 0 && (
                                                    <div className="search-section">
                                                        {/* 검색 기록이 있을 때만 구분선 */}
                                                        {isLoggedIn && suggestions.length > 0 &&
                                                            <div className="search-divider"></div>}

                                                        <div className="search-section-header">
                                                            <h4 className="search-section-title">
                                                                <svg width="16" height="16" viewBox="0 0 24 24"
                                                                     fill="none" className="search-icon-small">
                                                                    <polygon
                                                                        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                                                                        fill="currentColor"/>
                                                                </svg>
                                                                인기 검색어
                                                            </h4>
                                                        </div>
                                                        <ul className="search-list popular-list">
                                                            {popularKeywords.map((item, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="search-item popular-item"
                                                                    onMouseDown={() => setSearchTerm(item.keyword)}
                                                                >
                                                                    <span className="popular-rank">{i + 1}</span>
                                                                    <span
                                                                        className="search-item-text popular-text">{item.keyword}</span>
                                                                    <svg width="12" height="12" viewBox="0 0 24 24"
                                                                         fill="none" className="trending-icon">
                                                                        <path d="M7 17L17 7M17 7H8M17 7V16"
                                                                              stroke="currentColor" strokeWidth="2"
                                                                              strokeLinecap="round"/>
                                                                    </svg>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 🔹 자동완성: 입력값 있을 때만 */}
                                    {isFocused && searchTerm.trim() !== "" && suggestions.length > 0 && (
                                        <div
                                            className="search-dropdown autocomplete-dropdown"
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
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                             className="search-icon-small">
                                                            <circle cx="10.412" cy="10.412" r="7.482"
                                                                    stroke="currentColor" strokeWidth="1.5"/>
                                                            <path d="M16.706 16.706L21 21" stroke="currentColor"
                                                                  strokeWidth="1.5"/>
                                                        </svg>
                                                        자동완성
                                                    </h4>
                                                </div>
                                                <ul className="search-list autocomplete-list">
                                                    {suggestions.map((s, i) => (
                                                        <li
                                                            key={i}
                                                            className="search-item autocomplete-item"
                                                            onMouseDown={() => setSearchTerm(typeof s === "string" ? s : s.keyword)}
                                                        >
            <span className="search-item-text">
              {typeof s === "string" ? s : s.keyword}
            </span>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                                                 className="arrow-icon">
                                                                <path d="M7 13L12 18L17 13M7 6L12 11L17 6"
                                                                      stroke="currentColor" strokeWidth="2"/>
                                                            </svg>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* 🔹 검색 결과 렌더링 */}
                                    {searchTerm.trim() !== "" && isFocused && (
                                        <div
                                            className="search-dropdown search-results-dropdown"
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
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                             className="search-icon-small">
                                                            <path d="M20 6L9 17L4 12" stroke="currentColor"
                                                                  strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                        검색 결과
                                                    </h4>
                                                    {searchResults.length > 0 && (
                                                        <span className="result-count">{searchResults.length}개</span>
                                                    )}
                                                </div>

                                                {searchLoading ? (
                                                    <div className="loading-state">
                                                        <div className="loading-spinner"></div>
                                                        <span>검색 중...</span>
                                                    </div>
                                                ) : searchResults.length > 0 ? (
                                                    <ul className="search-list results-list">
                                                        {searchResults.map((product) => (
                                                            <li key={product.id} className="search-item result-item">
                                                                <Link
                                                                    to={`/sellers/${product.sellerId}/products/${product.id}`}
                                                                    className="result-link"
                                                                >
                                                                    <div className="result-content">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24"
                                                                             fill="none" className="product-icon">
                                                                            <rect x="2" y="3" width="20" height="14"
                                                                                  rx="2" ry="2" stroke="currentColor"
                                                                                  strokeWidth="2"/>
                                                                            <line x1="8" y1="21" x2="16" y2="21"
                                                                                  stroke="currentColor"
                                                                                  strokeWidth="2"/>
                                                                            <line x1="12" y1="17" x2="12" y2="21"
                                                                                  stroke="currentColor"
                                                                                  strokeWidth="2"/>
                                                                        </svg>
                                                                        <span
                                                                            className="result-name">{product.name}</span>
                                                                        <svg width="12" height="12" viewBox="0 0 24 24"
                                                                             fill="none" className="arrow-icon">
                                                                            <path d="M9 18L15 12L9 6"
                                                                                  stroke="currentColor"
                                                                                  strokeWidth="2"/>
                                                                        </svg>
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="empty-state">
                                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                                                             className="empty-icon">
                                                            <circle cx="12" cy="12" r="10" stroke="currentColor"
                                                                    strokeWidth="2"/>
                                                            <path d="M16 16L12 12L8 8" stroke="currentColor"
                                                                  strokeWidth="2"/>
                                                            <path d="M8 16L12 12L16 8" stroke="currentColor"
                                                                  strokeWidth="2"/>
                                                        </svg>
                                                        <p>검색 결과가 없습니다</p>
                                                        <span>다른 키워드로 검색해보세요</span>
                                                    </div>
                                                )}
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
                                                src="../image/icon/icon-bell.png"
                                                alt="alarm"
                                                style={{
                                                    width: "35px",
                                                    height: "35px",
                                                }}
                                            />
                                        </div>
                                        <em className="headIconCount" id="alarm-cnt">
                                            {unreadCount}
                                        </em>
                                        <div className="alarm-frame">
                      <span className="alarm-contents">
                        <ul className="alarm-inner">
                          {notifications.length === 0 ? (
                              <li>알림 온 게 없습니다.</li>
                          ) : (
                              <AlarmContents
                                  notifications={notifications}
                                  markAllAsRead={markAllAsRead}
                                  markAsRead={markAsRead}
                              />
                          )}
                        </ul>
                      </span>
                                        </div>
                                    </li>
                                    <li className="icon-Btn shopping-bag-icon">
                                        <a href="" className="myBag myIcon">
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
                                                0
                                            </em>
                                        </a>
                                        <div className="alarm-frame">
                      <span className="cart-contents">
                        <ul className="cart-inner">
                          {/* <!-- 여긴 장바구니에 아무것도 없거나 로그인을 안 했을 시 뜨는 문구 --> */}
                            <li>장바구니에 담긴 상품이 없습니다.</li>
                            {/* <!-- 장바구니에 담은 물건이 있을 시 --> */}
                            <li>
                            <a href="">
                              <img src="" alt=""/>
                              <p>
                                <span>
                                  <span>상품 이름</span>
                                </span>
                              </p>
                            </a>
                          </li>
                        </ul>
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
                                    className="menu-font-st"
                                    style={{
                                        color: "#000",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        padding: "4px",
                                        paddingBottom: "8px",
                                        height: "24px",
                                    }}
                                >
                  <span>
                    <img
                        src="../../image/icon/icon_nav.svg"
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
                                        style={{
                                            borderBottom: "2px solid rgb(0, 0, 0)",
                                        }}
                                    >
                                        홈
                                    </a>
                                </li>
                                <li className="">
                                    <a href="/" className="menu-font-st menu-under">
                                        NEW
                                    </a>
                                </li>
                                <li className="">
                                    <a href="/" className="menu-font-st menu-under">
                                        임박특가
                                    </a>
                                </li>
                                <li className="">
                                    <Link to="/OrderList" className="menu-font-st menu-under">
                                        주문 목록
                                    </Link>
                                </li>
                                <li className="">
                                    <Link to="/wish" className="menu-font-st menu-under">
                                        위시리스트
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;