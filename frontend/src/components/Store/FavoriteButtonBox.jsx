// components/Store/FavoriteButtonBox.jsx
import React, { useState } from "react";
import FavoriteButton from "./FavoriteButton.jsx";

export default function FavoriteButtonBox() {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite((prev) => !prev);
    // TODO: API 연동
  };

  return (
    <div
      className="storeInfo storeRight-ui"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} />
    </div>
  );
}
