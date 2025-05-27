import React from "react";

export default function OrderDetailBox({ store, name, price }) {
  return (
    <div className="item-detail">
      <div className="store-name">{store}</div>
      <div className="item-name">{name}</div>
      <div className="item-price">{price}원</div>
    </div>
  );
}
