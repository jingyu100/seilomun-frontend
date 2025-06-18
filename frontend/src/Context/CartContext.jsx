import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import useLogin from "../Hooks/useLogin.js";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const {isLoggedin} = useLogin();

    // 장바구니 목록 조회
    const fetchCart = async () => {
        if (isLoggedin) {
            try {
                const res = await axios.get("http://localhost/api/carts", {
                    withCredentials: true,
                });
                const items = res?.data?.data?.products || {};
                const formatted = Object.entries(items).map(([productId, quantity]) => ({
                    productId: parseInt(productId),
                    quantity,
                }));
                setCartItems(formatted);
            } catch (e) {
                console.error("장바구니 조회 실패", e);
            }
        }
        ;
    }

    // 컴포넌트 마운트(새로고침) 시 로컬 캐시 우선 사용, 이후 서버 동기화
    useEffect(() => {
        const cached = localStorage.getItem("cartItems");
        if (cached) {
            setCartItems(JSON.parse(cached));
        }
        fetchCart(); // 서버 데이터로 동기화
    }, []);

    // cartItems 변경 시 localStorage 캐싱
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // 상품 추가
    const addToCart = async (
        productId,
        quantity,
        name,
        thumbnailUrl,
        expiryDate,
        originalPrice,
        discountPrice,
        currentDiscountRate,
        totalPrice
    ) => {
        try {
            await axios.post(
                "http://localhost/api/carts",
                {productId, quantity},
                {withCredentials: true}
            );

            // 서버 동기화
            fetchCart();

            // 프론트 상태에 UI 표시용 데이터 추가
            setCartItems((prev) => {
                const exists = prev.find((item) => item.productId === productId);
                if (exists) {
                    // 기존에 있으면 수량 누적
                    return prev.map((item) =>
                        item.productId === productId
                            ? {
                                ...item,
                                quantity: item.quantity + quantity,
                                totalPrice: (item.quantity + quantity) * discountPrice,
                            }
                            : item
                    );
                } else {
                    return [
                        ...prev,
                        {
                            productId,
                            quantity,
                            name,
                            thumbnailUrl,
                            date: expiryDate,
                            price: `${discountPrice.toLocaleString()}원`,
                            regularPrice: `${originalPrice.toLocaleString()}원`,
                            discount: `${currentDiscountRate}%`,
                            totalPrice,
                        },
                    ];
                }
            });
        } catch (e) {
            console.error("장바구니 추가 실패", e);
        }
    };


    // 상품 삭제
    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`http://localhost/api/carts/${productId}`, {
                withCredentials: true,
            });
            fetchCart();
        } catch (e) {
            console.error("장바구니 삭제 실패", e);
        }
    };

    // 수량 변경
    const updateQuantity = async (productId, quantity) => {
        try {
            await axios.put(
                `http://localhost/api/carts/${productId}`,
                {productId, quantity},
                {withCredentials: true}
            );
            fetchCart();
        } catch (e) {
            console.error("장바구니 수량 변경 실패", e);
        }
    };

    // 장바구니 비우기
    const clearCart = async () => {
        try {
            await axios.delete("http://localhost/api/carts", {
                withCredentials: true,
            });
            setCartItems([]);
        } catch (e) {
            console.error("장바구니 초기화 실패", e);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                fetchCart,
                setCartItems,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
