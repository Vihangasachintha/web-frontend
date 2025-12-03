import { Link } from "react-router-dom";

function formatPrice(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num.toLocaleString() : "0";
}

export default function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const {
    productId,
    images = [],
    name = "",
    description = "",
    price = 0,
    labelledPrice = 0,
    isAvailable = false,
    stock = 0,
  } = product;

  const hasImages = Array.isArray(images) && images.length > 0;
  const showDiscount = Number(labelledPrice) !== Number(price);

  return (
    <Link to={"/overview/" + productId} className="w-[300px] h-[450px] bg-white shadow-lg rounded-lg m-4 overflow-hidden flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="h-[200px] w-full bg-gray-100 flex items-center justify-center">
        {hasImages ? (
          <img
            src={images[0]}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500 mt-1 h-[48px] overflow-hidden">
            {description}
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-3">
          {showDiscount ? (
            <div className="flex items-center gap-2">
              <p className="text-red-500 font-bold text-lg">
                Rs. {formatPrice(price)}
              </p>
              <p className="text-gray-400 line-through text-sm">
                Rs. {formatPrice(labelledPrice)}
              </p>
            </div>
          ) : (
            <p className="text-gray-700 font-semibold text-lg">
              Rs. {formatPrice(price)}
            </p>
          )}
        </div>

        {/* Stock & Button */}
        <div className="mt-4 flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              isAvailable && stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {isAvailable && stock > 0 ? "In Stock" : "Out of Stock"}
          </span>

          <button
            disabled={!isAvailable || stock <= 0}
            className="px-3 py-1 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isAvailable && stock > 0 ? "Buy Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </Link>
  );
}