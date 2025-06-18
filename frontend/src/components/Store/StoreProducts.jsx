import { Link } from "react-router-dom";

export default function StoreProducts({
  sellerId,
  id,
  index,
  productId,
  thumbnailUrl,
  name,
  date,
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
        <p style={{
              fontSize: "15px",
            }}>{description}</p>
        <div style={{
          display: "flex",
          gap: "5px",

        }}>
          <p>
            <strong style={{
              fontSize: "17px",
              color: "red",
            }}>{discountPrice.toLocaleString()}원</strong>
          </p>
          <p style={{
              fontSize: "14.5px",
              color: "gray",
              textDecoration: "line-through",
            }}>{originalPrice.toLocaleString()}원</p>
          <p style={{
              fontSize: "15px",
              color: "red",
              
            }}>
             <strong>{currentDiscountRate}%</strong>
            </p>
        </div>
        <p style={{
              fontSize: "14px",
              color: "gray",
            }}>{date}</p>
      </Link>
    </div>
  );
}
