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
  price, // Selling price
  originalPrice, // Original price (optional)
  image,
  rating = 4.5,
  reviews = 0,
  createdAt,
  onAddToCart = () => { },
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await onAddToCart({ id, name, price, image });
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Added today';
    if (diffDays === 2) return 'Added yesterday';
    if (diffDays <= 7) return `Added ${diffDays - 1} days ago`;
    return `Added on ${date.toLocaleDateString()}`;
  };

  const timeAgoString = getTimeAgo(createdAt);

  return (
    <div className="group bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden
                    hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-500 flex flex-col backdrop-blur-sm">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-900/50 aspect-square p-6 flex items-center justify-center">
        {/* Subtle background glow behind product */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <img
          src={image || '/images/sample.jpg'}
          alt={name}
          onError={(e) => { 
            if (e.currentTarget.src.endsWith('/images/sample.jpg')) return;
            e.currentTarget.onerror = null; 
            e.currentTarget.src = '/images/sample.jpg'; 
          }}
          className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 relative z-10"
        />


        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-20 bg-red-500/90 backdrop-blur-md border border-red-500/50 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 z-20 bg-slate-900/60 backdrop-blur-md border border-slate-700 p-2.5 rounded-full
                   hover:bg-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-xl group/wishlist"
          aria-label="Add to wishlist"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-slate-400 group-hover/wishlist:text-red-400'}`}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 relative z-10">
        {/* Category & Time */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
            {category}
          </p>
          {timeAgoString && (
            <p className="text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-full">
              {timeAgoString}
            </p>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-white line-clamp-2 mb-3 h-12 group-hover:text-cyan-400 transition-colors">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${i < Math.floor(rating) ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]' : 'text-slate-700'}`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 ml-1 font-medium">
            ({reviews > 0 ? reviews.toLocaleString() : 'New'})
          </span>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-slate-500 line-through mb-0.5">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-bold text-white tracking-tight">
              ₹{price.toLocaleString()}
            </span>
          </div>

          {/* Add to Cart Button (Icon Only on compact cards, but keeping existing layout) */}
          <Button
            variant="primary"
            size="sm"
            className="bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-900 border border-cyan-500/20 transition-all duration-300 rounded-xl px-4 py-2 font-semibold shadow-none hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            onClick={handleAddToCart}
            loading={isAddingToCart}
          >
            <ShoppingCart size={18} className="mr-2 hidden sm:inline-block" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
