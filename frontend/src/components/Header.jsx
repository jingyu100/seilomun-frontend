import AlarmContents from "./AlarmContents.jsx";
import ProductsAlarm from "./ProductsAlarm.jsx";
import mainLogo from "../image/logo/mainLogo.png";
import useLogin from "../Hooks/useLogin.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useLogin();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost/api/search/autocomplete?prefix=${searchTerm}`,
          {
            withCredentials: true,
          }
        );
        console.log("전체 응답", res); // 🔍 전체 응답 구조 확인
        console.log("status", res.status); // HTTP status
        console.log("data", res.data); // API response body
        console.log("suggestions", res.data?.data?.suggestions); // 이게 undefined면 응답 형식 문제
        setSuggestions(res.data?.data?.suggestions);
      } catch (err) {
        console.error("자동완성 실패", err);
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

  const handleSearchFocus = async () => {
    console.log("🔍 검색창 포커스됨");
    console.log("✅ 로그인 상태:", isLoggedIn);

    if (isLoggedIn) {
      try {
        const res = await axios.get(
          "http://localhost/api/search/history?page=0&size=10",
          { withCredentials: true }
        );
        console.log("📦 검색 기록 응답 전체:", res.data);

        const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
        console.log("✅ 추출된 keywords:", keywords);

        setSuggestions(keywords);
      } catch (err) {
        console.error("❌ 검색 기록 불러오기 실패:", err);
        setSuggestions([]);
      }
    } else {
      console.log("🙅‍♂️ 로그인되어 있지 않음 → 빈 추천어 표시");
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      console.log("❌ 빈 검색어. 저장 요청 안 보냄");
      return;
    }

    console.log("🔍 검색 실행됨:", searchTerm);

    if (isLoggedIn) {
      try {
        console.log("📤 검색 기록 저장 요청 전송 중...");
        const res = await axios.post(
          `http://localhost/api/search/history?keyword=${encodeURIComponent(searchTerm)}`,
          {}, // ← body 없음
          { withCredentials: true }
        );
        console.log("✅ 검색어 저장 성공:", res.data);
      } catch (err) {
        console.error("❌ 검색어 저장 실패:", err.response?.data || err.message);
      }
    } else {
      console.log("🙅‍♂️ 로그인 안됨 → 저장 요청 스킵");
    }

    // 여기서 검색 결과 페이지 이동 로직 추가 가능
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
                      <button>{user?.nickname}님</button>
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
                          onFocus={() => {
                            setIsFocused(true);
                            handleSearchFocus();
                          }}
                          onBlur={() => {
                            // 약간의 딜레이로 blur 직후 항목 클릭 가능하게
                            setTimeout(() => setIsFocused(false), 200);
                          }}
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

                  {isFocused && suggestions.length > 0 && (
                    <ul
                      className="autocomplete-list"
                      style={{
                        background: "white",
                        border: "1px solid #ccc",
                        position: "absolute",
                        zIndex: 10,
                        width: "100%",
                      }}
                    >
                      {suggestions.map((s, i) => (
                        <li key={i} style={{ padding: "8px", cursor: "pointer" }}>
                          {typeof s === "string" ? s : s.keyword}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="icon-menu">
                <ul className="icon-menuInner">
                  <li className="icon-Btn alarm-icon">
                    <a href="" className="myAlarm myIcon">
                      <div>
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
                        0
                      </em>
                    </a>
                    <div className="alarm-frame">
                      <span className="alarm-contents">
                        <ul className="alarm-inner">
                          {/* <!-- 여긴 알림에 아무것도 없거나 로그인을 안 했을 시 뜨는 문구 --> */}
                          <li>알림 온 게 없습니다.</li>

                          {/* <!-- 알림 온 게 있을 시 --> */}
                          <AlarmContents products={ProductsAlarm} />
                          <li>
                            <a href="">
                              <div>
                                <span>해당 상품이 배송을 시작하였습니다.</span>
                              </div>
                              <div>
                                <img
                                  src="/image/product1.jpg"
                                  alt="product1"
                                  style={{ width: "70px", height: "70px" }}
                                />
                                <p>
                                  <span>
                                    <span>상품 이름</span>
                                  </span>
                                </p>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="">
                              <div>
                                <AlarmContents products={ProductsAlarm} />
                              </div>
                            </a>
                          </li>
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
                              <img src="" alt="" />
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
            <div className="kategorie">
              <div
                className="kategorie-frame"
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
                      src="./image/icon/icon_nav.svg"
                      alt="kategorie"
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
                  <a href="/" className="menu-font-st menu-under">
                    주문 목록
                  </a>
                </li>
                <li className="">
                  <a href="/" className="menu-font-st menu-under">
                    위시리스트
                  </a>
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
