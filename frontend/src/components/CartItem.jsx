import React from 'react';
import AlarmContents from "./AlarmContents.jsx";

const CartItem = ({ product, removeFromCart }) => {
    return (
        <div key={product.id} className="cartItem">
            <AlarmContents product={product} />
            <div className="productDetails">
                <p>상품명: {product.name}</p>
                <p>가격: {product.price}</p>
                <p>정상가: {product.regularPrice}</p>
                <p>할인율: {product.discount}</p>
                <p>배송지: {product.address}</p>
                <p>판매자 ID: {product.sellerId}</p>
                <p>BR번호: {product.BRNumber}</p>
            </div>
            <button onClick={() => removeFromCart(product.id)}>삭제</button>
        </div>
    );
};

export default CartItem;
