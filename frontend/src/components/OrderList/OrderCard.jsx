import OrderItem from "./OrderItem";

const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <div className="order-status">상태: {order.status}</div>
      {order.items.map((item, index) => (
        <OrderItem key={index} item={item} />
      ))}
      <div className="order-actions">
        <button>주문 상세</button>
        <button>리뷰 작성</button>
      </div>
    </div>
  );
};

export default OrderCard;
