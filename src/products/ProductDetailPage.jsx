import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ChevronLeft, ChevronRight, ShoppingCart, Eye, TrendingUp, ArrowLeft } from 'lucide-react';
import { products } from "./productsData";
import { useCart } from '../cart/CartContext.jsx';

/**
 * Product Detail Page Component
 * Image gallery with zoom, specifications, reviews, and related products
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === parseInt(id));

  // All hooks must be called before any early returns
  const [selectedColor, setSelectedColor] = useState(() => product?.colors ? product.colors[0] : null);
  const [selectedSize, setSelectedSize] = useState(() => product?.sizes ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [reviewTab, setReviewTab] = useState('overview');

  // Redirect if product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Mock reviews data (in a real app, this would come from an API)
  const reviews = [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: '2024-01-15',
      title: 'Excellent quality',
      text: `The ${product.name} is amazing! Great build quality and performance.`,
      helpful: 245,
      verified: true,
    },
    {
      id: 2,
      author: 'John D.',
      rating: 4,
      date: '2024-01-10',
      title: 'Good value for money',
      text: `Solid product from ${product.brand}. Does everything I need it to do.`,
      helpful: 128,
      verified: true,
    },
    {
      id: 3,
      author: 'Emma R.',
      rating: 5,
      date: '2024-01-05',
      title: 'Highly recommended',
      text: `Best ${product.category} I've owned. ${product.brand} delivers again!`,
      helpful: 89,
      verified: true,
    },
  ];

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAddToCart = () => {
    // Add to cart using context API (will handle quantity internally)
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }

    showToast(`Added ${quantity} ${product.name} to cart!`);
    setQuantity(1);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: x * 100, y: y * 100 });
  };

  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${star <= Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : star - 0.5 <= rating
                  ? 'text-yellow-400 fill-current opacity-50'
                  : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/shop')} className="hover:text-blue-600">Shop</button>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
              className="relative bg-white rounded-xl overflow-hidden aspect-square border border-gray-200"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
            >
              <div className="relative w-full h-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${showZoom ? 'cursor-zoom-in' : 'cursor-default'
                    }`}
                  style={showZoom ? { transform: `scale(${1.5}) translate(${(mousePos.x / 100 - 0.5) * 30}%, ${(mousePos.y / 100 - 0.5) * 30}%)` } : {}}
                />
              </div>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold">
                  -{discount}%
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => { setIsWishlisted(!isWishlisted); showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isWishlisted
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-between">
            {/* Header */}
            <div>
              <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                {renderStars(product.rating)}
                <span className="font-semibold text-gray-900 ml-2">{product.rating}</span>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
                {discount > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Color: <span className="text-blue-600">{selectedColor}</span>
                  </label>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${selectedColor === color
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Size */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Storage: <span className="text-blue-600">{selectedSize}</span>
                  </label>
                  <div className="flex gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${selectedSize === size
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <p className="text-sm text-gray-600 mb-2">Sold by: <span className="font-semibold text-gray-900">LogiMart Official</span></p>
              <p className="text-sm text-gray-600">✓ Fast Shipping ✓ Genuine Product ✓ 30-Day Returns</p>
            </div>
          </div>
        </div>

        {/* Specifications & Reviews Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setReviewTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors ${reviewTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {reviewTab === 'overview' && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: TrendingUp, text: 'Latest Technology' },
                    { icon: Star, text: 'Premium Quality' },
                    { icon: Eye, text: 'Beautiful Display' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <item.icon size={24} className="text-blue-600" />
                      <span className="font-medium text-gray-900">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reviewTab === 'specs' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
                <table className="w-full">
                  <tbody>
                    {product.specifications ? product.specifications.map((spec, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-3 font-semibold text-gray-900 border-b border-gray-200">{spec.label}</td>
                        <td className="px-6 py-3 text-gray-700 border-b border-gray-200">{spec.value}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                          Specifications not available for this product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {reviewTab === 'reviews' && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.author}</p>
                          <div className="flex gap-1 mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mt-2">{review.title}</h3>
                      <p className="text-gray-700 text-sm mt-2">{review.text}</p>
                      <p className="text-xs text-gray-500 mt-3">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(prod => (
                <div key={prod.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${prod.id}`)}>
                  <div className="relative overflow-hidden aspect-square bg-gray-100">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    {prod.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        -{prod.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 truncate">{prod.brand}</p>
                    <p className="font-semibold text-gray-900 truncate">{prod.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="font-bold text-blue-600">₹{prod.price.toLocaleString()}</p>
                        {prod.originalPrice > prod.price && (
                          <p className="text-sm text-gray-500 line-through">₹{prod.originalPrice.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {renderStars(prod.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;