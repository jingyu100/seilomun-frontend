const OrderItem = ({ item }) => {
  return (
    <div className="order-item">
      <img src={item.imageUrl} alt={item.productName} className="thumbnail" />
      <div className="info">
        <div className="name">{item.productName}</div>
        <div className="price">{item.price.toLocaleString()}원</div>
        <div className="quantity">{item.quantity}개</div>
      </div>
    </div>
  );
};

export default OrderItem;
