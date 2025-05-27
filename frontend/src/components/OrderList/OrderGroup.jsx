import OrderCard from "./OrderCard";

const OrderGroup = ({ date, orders = [] }) => {
  return (
    <div className="order-group">
      <h3 className="order-date">{date}</h3>
      {orders.map((order, index) => (
        <OrderCard key={index} order={order} />
      ))}
    </div>
  );
};

export default OrderGroup;
