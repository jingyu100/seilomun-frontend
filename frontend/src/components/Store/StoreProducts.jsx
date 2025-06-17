import { Link } from "react-router-dom";

export default function StoreProducts({
  sellerId,
  id,
  index,
  productId,
  thumbnailUrl,
  name,
  expiryDate,
  description,
  originalPrice,
  discountPrice,
  maxDiscountRate,
  minDiscountRate,
  currentDiscountRate,
}) {
  return (
    <div
      className="productItem"
      style={{
        width: "200px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      <Link
        to={`/sellers/${sellerId}/products/${id}`}
      >
        <img 
          className="store-product-image"
          src={thumbnailUrl || "/image/product1.jpg"} 
          alt={name}
        />
        <h3>{name}</h3>
        <p>{description}</p>
        <p>
          <strong>{discountPrice.toLocaleString()}원</strong>
        </p>
        <p>{currentDiscountRate}%</p>
      </Link>
    </div>
  );
}
