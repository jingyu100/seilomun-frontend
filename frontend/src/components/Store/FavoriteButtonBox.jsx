// FavoriteButtonBox.jsx
import React, {useState, useEffect} from "react";
import axios from "axios";
import FavoriteButton from "./FavoriteButton.jsx";
import useLogin from "../../Hooks/useLogin.js";

export default function FavoriteButtonBox({sellerId}) {
    const [isFavorite, setIsFavorite] = useState(false);
    const {isLoggedin} = useLogin();

    // 1) 마운트 시 한 번: 사용자의 전체 즐겨찾기 리스트를 가져와,
    //    현재 sellerId가 포함되어 있는지 확인해서 isFavorite 초기값 설정
    useEffect(() => {
        const fetchFavorites = async () => {
            if (isLoggedin) {
                try {
                    // withCredentials: true로, 로그인 시 발급된 쿠키(JWT) 포함
                    const response = await axios.get(
                        "http://localhost/api/customers/favorites?page=0&size=100",
                        {
                            withCredentials: true,
                        }
                    );
                    const favoritesData = response.data.data.favorites;
                    // favoritesData의 각 item.id는 sellerId(서버가 내려주는 FavoriteSellerDto.id)
                    // 따라서 숫자 비교를 위해 parseInt로 변환
                    const found = favoritesData.some((item) => item.id === parseInt(sellerId, 10));
                    setIsFavorite(found);
                } catch (error) {
                    console.error("즐겨찾기 목록 조회 실패:", error);
                }
            }
            ;
        }

        if (sellerId) {
            fetchFavorites();
        }
    }, [sellerId]);

    // 2) 버튼 클릭 시: 토글 방식으로 항상 POST 호출
    const handleFavoriteClick = async () => {
        try {
            const response = await axios.post(
                `http://localhost/api/customers/favorites/${sellerId}`,
                {},
                {
                    withCredentials: true,
                }
            );
            // response.data.data.isAdd: true면 즐겨찾기 추가 → isFavorite=true
            //                       false면 즐겨찾기 해제 → isFavorite=false
            const isAdd = response.data.data.isAdd;
            setIsFavorite(isAdd);
            // (선택) 성공 시 토스트나 모달 등 메시지 표시할 수 있음
        } catch (error) {
            console.error("즐겨찾기 토글 실패:", error);
            // (선택) 에러 처리: 화면에 안내 띄우거나, 재시도 로직 등 추가
        }
    };

    return (
        <div
            className="storeInfo storeRight-ui"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
            }}
        >
            <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick}/>
        </div>
    );
}
