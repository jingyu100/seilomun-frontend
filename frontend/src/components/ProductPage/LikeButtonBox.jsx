import React, {useState, useEffect} from "react";
import LikeButton from "./LikeButton.jsx";
import axios from "axios";
import useLogin from "../../Hooks/useLogin.js";

export default function LikeButtonBox({productId}) {
    const [isLiked, setIsLiked] = useState(false);
    const {isLoggedin} = useLogin();

    // 마운트 시: 백엔드에서 해당 상품이 좋아요 되어 있는지 조회
    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (isLoggedin) {
                try {
                    // 1) 전체 위시리스트 가져오기 (page=0, size=100 등의 여유 있는 값을 사용)
                    const response = await axios.get(
                        "http://3.39.239.179/api/customers/wishes?page=0&size=100",
                        {
                            // 필요 시 JWT 쿠키 혹은 세션 기반 인증을 사용하는 경우 아래 옵션을 켜세요.
                            withCredentials: true,
                            // 만약 HTTP 헤더에 토큰을 직접 붙인다면, headers: { Authorization: `Bearer ${token}` } 형태로 변경
                        }
                    );

                    // 응답 구조: { status: 200, data: { wishes: [WishProductDto], hasNext, totalElements, message } }
                    const wishesData = response.data.data.wishes;

                    // 2) 현재 productId가 wishes 목록 안에 있으면 isLiked = true
                    const found = wishesData.some((item) => item.productId === Number(productId));
                    setIsLiked(found);
                } catch (error) {
                    console.error("좋아요 상태 조회 실패:", error);
                }
            }
            ;
        }

        if (productId) {
            fetchLikeStatus();
        }
    }, [productId]);

    // 좋아요 버튼 클릭 시: 토글 API 호출
    const handleLikeClick = async () => {
        try {
            const response = await axios.post(
                `http://3.39.239.179/api/customers/wishes/${productId}`,
                {},
                {
                    withCredentials: true,
                    // JWT를 header에 직접 붙이는 구조라면:
                    // headers: { Authorization: `Bearer ${token}` },
                }
            );

            // 응답 구조: { status: 200, data: { message, isAdd, 사용자, productId } }
            const {isAdd} = response.data.data;
            setIsLiked(isAdd);
        } catch (error) {
            console.error("좋아요 토글 실패:", error);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
            }}
        >
            <LikeButton isLiked={isLiked} onClick={handleLikeClick}/>
        </div>
    );
}
