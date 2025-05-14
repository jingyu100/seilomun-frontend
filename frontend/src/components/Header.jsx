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
  const [popularKeywords, setPopularKeywords] = useState([]);

  useEffect(() => {
    if (isLoggedIn && isFocused && searchTerm.trim() === "") {
      const fetchHistoryAndPopular = async () => {
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

        try {
          const res = await axios.get("http://localhost/api/search/popular?limit=10", {
            withCredentials: true,
          });
          setPopularKeywords(res.data?.data?.popularKeywords || []);
        } catch (err) {
          console.error("❌ 인기 검색어 불러오기 실패:", err);
        }
      };

      fetchHistoryAndPopular();
    }
  }, [isLoggedIn, isFocused, searchTerm]);

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

  const handleSearchFocus = () => {
    setIsFocused(true);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (isLoggedIn) {
      try {
        await axios.post(
          `http://localhost/api/search/history?keyword=${encodeURIComponent(searchTerm)}`,
          {},
          { withCredentials: true }
        );
        // 🔄 서버에서 최신 기록 다시 불러오기
        const res = await axios.get(
          "http://localhost/api/search/history?page=0&size=10",
          { withCredentials: true }
        );
        const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
        setSuggestions(keywords);
      } catch (err) {
        console.error("검색 실패:", err);
      }
    }
  };

  const handleDeleteHistoryItem = async (keyword) => {
    try {
      await axios.delete(
        `http://localhost/api/search/history?keyword=${encodeURIComponent(keyword)}`,
        { withCredentials: true }
      );
      const res = await axios.get("http://localhost/api/search/history?page=0&size=10", {
        withCredentials: true,
      });
      const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
      setSuggestions(keywords);
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await axios.delete("http://localhost/api/search/history/all", {
        withCredentials: true,
      });
      setSuggestions([]); // 서버도 다 지웠으므로 프론트도 비움
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
                          onFocus={() => {
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

                  {isLoggedIn && isFocused && searchTerm.trim() === "" && (
                    <div
                      className="history-popular-box"
                      style={{
                        background: "white",
                        border: "1px solid #ccc",
                        padding: "8px",
                        marginTop: "4px",
                        position: "absolute",
                        width: "100%",
                        zIndex: 9,
                      }}
                    >
                      {/* 검색 기록 */}
                      {suggestions.length > 0 && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "6px",
                            }}
                          >
                            <strong>검색 기록</strong>
                            <button onClick={handleClearAllHistory}>전체 삭제</button>
                          </div>
                          <ul
                            style={{
                              listStyle: "none",
                              paddingLeft: 0,
                              marginBottom: "12px",
                            }}
                          >
                            {suggestions.map((item, i) => (
                              <li
                                key={i}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "4px 0",
                                  borderBottom:
                                    i !== suggestions.length - 1
                                      ? "1px solid #eee"
                                      : "none", // 마지막 항목은 선 제거
                                }}
                              >
                                <span>
                                  {typeof item === "string" ? item : item.keyword}
                                </span>
                                <button onClick={() => handleDeleteHistoryItem(item)}>
                                  X
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {/* 인기 검색어 */}
                      {popularKeywords.length > 0 && (
                        <>
                          <hr
                            style={{
                              border: "none",
                              borderTop: "2px solid #aaa", // ✅ 굵은 구분선
                              margin: "8px 0",
                            }}
                          />
                          <strong style={{ display: "block", marginBottom: "6px" }}>
                            인기 검색어
                          </strong>
                          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                            {popularKeywords.map((item, i) => (
                              <li
                                key={i}
                                style={{
                                  padding: "4px 0",
                                  cursor: "pointer",
                                  borderBottom:
                                    i !== popularKeywords.length - 1
                                      ? "1px solid #eee"
                                      : "none",
                                }}
                                onMouseDown={() => setSearchTerm(item.keyword)}
                              >
                                {item.keyword}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}

                  {/* 🔹 자동완성: 입력값 있을 때만 */}
                  {isFocused && searchTerm.trim() !== "" && suggestions.length > 0 && (
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
                        <li
                          key={i}
                          style={{ padding: "8px", cursor: "pointer" }}
                          onMouseDown={() =>
                            setSearchTerm(typeof s === "string" ? s : s.keyword)
                          }
                        >
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
