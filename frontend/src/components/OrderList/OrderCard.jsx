import React from "react";
import "./OrderCard.css";
import ProductImageBox from "./ProductImageBox";
import OrderDetailBox from "./OrderDetailBox";
import OrderButtonGroup from "./OrderButtonGroup";

export default function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-date">{order.date}</div>
      <div className="order-content">
        <div className="order-info">
          <div className="order-status">주문 완료</div>
          <div className="order-body">
            <ProductImageBox count={order.count} />
            <OrderDetailBox store={order.store} name={order.name} price={order.price} />
          </div>
        </div>
        <OrderButtonGroup />
      </div>
    </div>
  );
}
