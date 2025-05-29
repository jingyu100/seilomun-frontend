import { Link } from "react-router-dom";

export default function StoreProducts({
  id,
  thumbnailUrl,
  name,
  expiryDate,
  description,
  originalPrice,
  discountPrice,
  maxDiscountRate,
  minDiscountRate,
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
      
      <Link to={`/api/products/${id}`}>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={name}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        )}
        <h3>{name}</h3>
        <p>{description}</p>
        <p>
          <strong>{discountPrice.toLocaleString()}원</strong>
        </p>
      </Link>
    </div>
  );
}
