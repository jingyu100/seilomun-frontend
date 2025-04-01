const WishListFilled = ({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border p-4 rounded shadow">
          <img src={item.thumbnailUrl} alt={item.name} className="mb-2 rounded" />
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="text-gray-600">{item.price.toLocaleString()}원</p>
        </div>
      ))}
    </div>
  );
};

export default WishListFilled;
