import api, { API_BASE_URL } from "../api/config.js";

export default function SemiHeader() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [popularKeywords, setPopularKeywords] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && isFocused && searchTerm.trim() === "") {
      const fetchHistoryAndPopular = async () => {
        try {
          const res = await api.get("/api/search/history?page=0&size=10");
          const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
          setSuggestions(keywords);
        } catch (err) {
          console.error("❌ 검색 기록 불러오기 실패:", err);
          setSuggestions([]);
        }

        try {
          const res = await api.get("/api/search/popular?limit=10");
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
          api.get(`/api/search/autocomplete?prefix=${searchTerm}`),
          api.get(`/api/search/fuzzy?term=${searchTerm}`),
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
      await api.post("/api/auth/logout", {
        username: user?.email,
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

  const handleSearchFocus = () => {
    setIsFocused(true);
  };

  // 검색 api
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    if (isLoggedIn) {
      try {
        await api.post(`/api/search/history?keyword=${encodeURIComponent(trimmed)}`);
      } catch (err) {
        console.error("검색 기록 저장 실패:", err);
      }
    }

    try {
      setSearchLoading(true);
      const res = await api.get("/api/products/search", {
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
      setIsFocused(true);
    } catch (err) {
      console.error("상품 검색 실패:", err);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDeleteHistoryItem = async (keyword) => {
    try {
      await api.delete(`/api/search/history?keyword=${encodeURIComponent(keyword)}`);
      const res = await api.get("/api/search/history?page=0&size=10");
      const keywords = (res.data?.data?.histories || []).map((h) => h.keyword);
      setSuggestions(keywords);
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await api.delete("/api/search/history/all");
      setSuggestions([]); // 서버도 다 지웠으므로 프론트도 비움
    } catch (err) {
      console.error("전체 삭제 실패:", err);
    }
  };

  return (
    <div>
      <div>
        <div className="search-ui product-search">
          <div>
            <form className="search" method="get" action="" onSubmit={handleSearchSubmit}>
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
                              i !== suggestions.length - 1 ? "1px solid #eee" : "none", // 마지막 항목은 선 제거
                          }}
                        >
                          <span>{typeof item === "string" ? item : item.keyword}</span>
                          <button onClick={() => handleDeleteHistoryItem(item)}>X</button>
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
            {/* 🔹 검색 결과 렌더링 */}
            {searchTerm.trim() !== "" && isFocused && (
              <div
                style={{
                  background: "white",
                  border: "1px solid #aaa",
                  padding: "12px",
                  position: "absolute",
                  width: "100%",
                  top: "100%",
                  zIndex: 20,
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {searchLoading ? (
                  <p style={{ margin: 0 }}>검색 중...</p>
                ) : searchResults.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {searchResults.map((product) => (
                      <li
                        key={product.id}
                        style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}
                      >
                        <Link
                          to={`/sellers/${product.sellerId}/products/${product.id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <strong>{product.name}</strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0 }}>검색 결과가 없습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
