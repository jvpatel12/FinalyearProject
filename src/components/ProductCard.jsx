import React, { useState } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Button from '../common/Button';

/**
 * ProductCard Component
 * Displays individual product with image, name, price, rating, and Add to Cart button
 * Includes wishlist and hover effects
 */
const ProductCard = ({
  id,
  category,
  name,
  price,
  discountedPrice,
  image,
  rating = 4.5,
  reviews = 0,
  onAddToCart = () => { },
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await onAddToCart({ id, name, price: discountedPrice || price, image });
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const discountPercent = discountedPrice ? Math.round(((price - discountedPrice) / price) * 100) : 0;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden
                    hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full
                   hover:bg-white transition-all duration-300 shadow-md"
          aria-label="Add to wishlist"
        >
          <Heart
            size={20}
            className={`transition-all duration-300 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-600'}`}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          {category}
        </p>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 h-14">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">{renderStars(rating)}</div>
          <span className="text-sm text-gray-600">
            ({reviews > 0 ? reviews.toLocaleString() : 'New'})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            ₹{(discountedPrice || price).toLocaleString()}
          </span>
          {discountedPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full mt-auto"
          onClick={handleAddToCart}
          loading={isAddingToCart}
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
