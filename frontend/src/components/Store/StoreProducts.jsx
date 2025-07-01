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
        height: "250px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      <Link
        to={`/sellers/${sellerId}/products/${id}`}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: "100%",
        }}
      >
        <img 
          className="store-product-image"
          src={thumbnailUrl} 
          alt={name}
        />
        <h3 style={{
          maxHeight: "2.8em",
          marginBottom: "5px",
        }}>{name}</h3>
        <p style={{
              fontSize: "14.5px",
              lineHeight: "1.4em",
              maxHeight: "1.4em",
              overflow: "hidden",
              whiteSpace: "normal",
              display: "block",
              marginBottom: "7px",
            }}>{description}</p>
        <div style={{
          marginTop: "auto",
        }}>
          <p style={{
            fontSize: "14px",
            color: "gray",
            marginBottom: "5px",
          }}>{date}</p>
          <div style={{
            display: "flex",
            gap: "5px",
          }}>
            <p>
              <strong style={{
                fontSize: "17px",
                color: "#000",
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
        </div>
      </Link>
    </div>
  );
}
