import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { apiService } from '../services/apiService';
import { TrendingUp, Star, Eye, ArrowLeft, Heart, ShoppingCart, Share2 } from 'lucide-react';
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [reviewTab, setReviewTab] = useState('overview');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '', name: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const data = await apiService.products.getById(id);
      setProduct(data);
      if (data.colors) setSelectedColor(data.colors[0]);
      if (data.sizes) setSelectedSize(data.sizes[0]);

      // Get reviews
      const productReviews = await apiService.products.getReviews(id);
      setReviews(productReviews);

      // Get related products
      const allProducts = await apiService.products.getAll();
      const related = (allProducts.products || allProducts)
        .filter(p => p.category === data.category && p.id !== data.id)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userReview.comment) {
        toast.error('Please add a comment');
        return;
    }
    
    try {
        setSubmittingReview(true);
        await apiService.reviews.submitReview(id, userReview);
        toast.success('Review submitted successfully!');
        setUserReview({ rating: 5, comment: '', name: '' });
        // Refresh reviews
        const productReviews = await apiService.products.getReviews(id);
        setReviews(productReviews);
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
        setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    // Add to cart using context API (will handle quantity internally)
    const productImages = product.images && product.images.length > 0 ? product.images : ['/images/sample.jpg'];
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0],
      sellerId: product.sellerId,
      qty: quantity
    });

    toast.success(`Added ${quantity} ${product.name} to cart!`);
    setQuantity(1);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out the ${product.name} on LogiMart!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!', {
          icon: '🔗',
          style: {
            borderRadius: '10px',
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #1e293b'
          },
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: x * 100, y: y * 100 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
        <p className="text-cyan-400 font-mono animate-pulse uppercase tracking-[0.2em] text-sm font-black">Decrypting Product Data...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center bg-slate-900 border border-slate-800 rounded-3xl p-12 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Access Denied</h2>
          <p className="text-slate-400 mb-8 font-light">The requested product data could not be retrieved or the item has been removed from our archives.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="w-full bg-cyan-500 text-slate-900 h-14 rounded-xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const productRating = product.rating ?? product.averageRating ?? 0;
  const productReviewsCount = product.reviews ?? product.numReviews ?? 0;
  const isWishlisted = product ? isInWishlist(product.id) : false;

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
    <div className="min-h-screen bg-background py-20 relative">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 transition-colors group text-sm font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Return to Shop
        </button>

        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-8 font-mono tracking-widest uppercase flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-cyan-400 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/shop')} className="hover:text-cyan-400 transition-colors">Shop</button>
          <span>/</span>
          <span className="text-white font-bold">{product?.name || 'Loading...'}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
              className="relative bg-slate-900/50 rounded-3xl overflow-hidden aspect-square border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center p-8 backdrop-blur-md"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/5 to-transparent opacity-50"></div>

              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={product.images && product.images.length > 0 ? product.images[selectedImageIndex] : '/images/sample.jpg'}
                  alt={product.name}
                  className={`max-w-full max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-300 ${showZoom ? 'cursor-zoom-in' : 'cursor-default'
                    }`}
                  style={showZoom ? { transform: `scale(${1.8}) translate(${(mousePos.x / 100 - 0.5) * 40}%, ${(mousePos.y / 100 - 0.5) * 40}%)` } : {}}
                />
              </div>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-6 left-6 z-20 bg-red-500/90 backdrop-blur-md border border-red-500/50 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  -{discount}%
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  if (isWishlisted) {
                    removeFromWishlist(product.id);
                    toast.success('Removed from wishlist');
                  } else {
                    addToWishlist(product);
                    toast.success('Added to wishlist');
                  }
                }}
                className={`absolute top-6 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-md border ${isWishlisted
                  ? 'bg-slate-900 border-red-500/50'
                  : 'bg-slate-900/60 border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50'
                  }`}
              >
                <Heart size={22} className={isWishlisted ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-slate-400'} />
              </button>
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                      ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'border-slate-700 hover:border-slate-500'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`Product thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-between py-6">
            {/* Header */}
            <div>
              <p className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-3">{product.brand}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={`${star <= Math.floor(productRating)
                        ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                        : star - 0.5 <= productRating
                          ? 'fill-cyan-400 text-cyan-400 opacity-50'
                          : 'text-slate-700'
                        }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-white ml-2">{productRating.toFixed(1)}</span>
                <span className="text-slate-500 text-sm">({productReviewsCount} verified reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-extrabold text-white tracking-tight">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xl text-slate-500 line-through font-mono">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                {discount > 0 && (
                  <span className="text-cyan-400 text-sm font-semibold tracking-wide uppercase mt-1 inline-block">
                    Net Savings: ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-8 bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 inline-flex backdrop-blur-sm">
                <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></div>
                <span className={`font-mono text-sm uppercase font-bold tracking-widest ${product.stock > 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `In Stock: ${product.stock} Units` : 'Out of Stock'}
                </span>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                    Select Color: <span className="text-white ml-2">{selectedColor}</span>
                  </label>
                  <div className="flex gap-4">
                    {product.colors.map(color => (
                      <div key={color} className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => setSelectedColor(color)}
                          className={`w-12 h-12 rounded-full border-2 transition-all shadow-lg ${selectedColor === color
                            ? 'border-cyan-500 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                            : 'border-slate-600 hover:border-slate-400 hover:scale-105'
                            }`}
                          style={{
                            backgroundColor: color.toLowerCase() === 'black' ? '#1e293b' : color.toLowerCase() === 'silver' ? '#cbd5e1' : color.toLowerCase() === 'white' ? '#f8fafc' : color.toLowerCase()
                          }}
                          title={color}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Size */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-10">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                    Select Size/Option: <span className="text-white ml-2">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all shadow-sm ${selectedSize === size
                          ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-700/50'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-slate-700 bg-slate-800 rounded-xl overflow-hidden h-14">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 h-full text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 font-mono text-lg font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 h-full text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 h-14 rounded-xl hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 border-none transition-all font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                >
                  <ShoppingCart size={22} />
                  Add to Cart
                </button>

                <a
                  href={`https://wa.me/919726380613?text=Hello, I am interested in inquiring about the product: ${product.name} (ID: ${product.id}). Please provide more details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-green-500/50 bg-green-500/10 text-green-400 h-14 rounded-xl hover:bg-green-500 hover:text-white transition-all font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.123.559 4.196 1.621 6.007L0 24l6.135-1.61a11.803 11.803 0 005.917 1.583h.005c6.637 0 12.032-5.398 12.035-12.032.002-3.218-1.248-6.242-3.517-8.511z"/>
                  </svg>
                  Inquire
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 border border-slate-700 bg-slate-800/50 text-slate-300 py-3 rounded-xl hover:bg-slate-700 hover:text-white transition-all font-semibold backdrop-blur-sm"
                >
                  <Share2 size={18} />
                  Share Product
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border-t border-slate-700/50 pt-6 mt-8">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Seller: <span className="font-bold text-cyan-400">CyberStore Official</span></p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <span className="flex items-center gap-1"><span className="text-cyan-500">✓</span> Fast Shipping</span>
                <span className="flex items-center gap-1"><span className="text-cyan-500">✓</span> Original Product</span>
                <span className="flex items-center gap-1"><span className="text-cyan-500">✓</span> 30-Day Return Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Reviews Tabs */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden mb-20 relative z-10">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-slate-700">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setReviewTab(tab.id)}
                className={`px-8 py-5 font-semibold text-sm uppercase tracking-widest transition-all ${reviewTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 md:p-12">
            {reviewTab === 'overview' && (
              <div className="max-w-4xl animate-fade-in-up">
                <h2 className="text-3xl font-bold text-white mb-6">Product Description</h2>
                <p className="text-slate-300 leading-relaxed mb-10 text-lg font-light">{product.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: TrendingUp, text: 'Next-Gen Silicon', desc: 'Overclocked parameters standard.' },
                    { icon: Star, text: 'Military Grade', desc: 'Forged for absolute durability.' },
                    { icon: Eye, text: 'Holographic Display', desc: 'Retina-burning pixel density.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-3 p-6 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all group">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                        <item.icon size={22} />
                      </div>
                      <span className="font-bold text-white">{item.text}</span>
                      <span className="text-sm text-slate-500">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reviewTab === 'specs' && (
              <div className="max-w-3xl animate-fade-in-up">
                <h2 className="text-3xl font-bold text-white mb-8">Specifications</h2>
                <div className="rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                  <table className="w-full text-left">
                    <tbody>
                      {product.specifications ? product.specifications.map((spec, idx) => (
                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-slate-900/80' : 'bg-slate-800/60'} hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0`}>
                          <td className="px-6 py-4 font-semibold text-slate-300 w-1/3 border-r border-slate-700/30">{spec.label}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono text-sm">{spec.value}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="2" className="px-6 py-12 text-center text-slate-500 bg-slate-900/50 font-mono">
                            [ No telemetry data available for this unit ]
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reviewTab === 'reviews' && (
              <div className="max-w-3xl animate-fade-in-up">
                <h2 className="text-3xl font-bold text-white mb-8">Customer Reviews</h2>

                {/* Review Submission Form */}
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 mb-12 backdrop-blur-md shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Star className="text-cyan-400 fill-cyan-400/20" size={20} />
                    Write a Review
                  </h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Your Name</label>
                        <input
                          type="text"
                          value={userReview.name}
                          onChange={(e) => setUserReview({ ...userReview, name: e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light"
                          placeholder="Cyber Citizen #404"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserReview({ ...userReview, rating: star })}
                              className="bg-transparent border-none p-1 transition-transform hover:scale-125 focus:outline-none"
                            >
                              <Star
                                size={28}
                                className={`${star <= userReview.rating
                                  ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                                  : 'text-slate-700'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Your Comment</label>
                      <textarea
                        rows="4"
                        value={userReview.comment}
                        onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-light"
                        placeholder="Share your experience with this tech..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-cyan-500 text-slate-900 font-bold py-4 rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center gap-2"
                    >
                      {submittingReview ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent"></div>
                          Transmitting...
                        </>
                      ) : 'Submit Review'}
                    </button>
                  </form>
                </div>

                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 bg-slate-900/30 border border-slate-800/50 rounded-xl">
                      <p className="text-slate-500 font-mono italic">[ No reviews logged in the matrix yet ]</p>
                    </div>
                  ) : (
                    reviews.map(review => (
                      <div key={review._id || review.id} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-white mb-1 flex items-center gap-2">
                              {review.user?.name || review.name || 'Anonymous User'}
                              <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 bg-slate-800 rounded">Verified ID</span>
                            </p>
                            <div className="flex gap-0.5 mt-2 mb-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded">
                            Logged Data
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm font-light leading-relaxed mb-4">{review.comment}</p>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Entry Date: {new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-cyan-500 rounded-full"></span>
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(prod => (
                <div key={prod.id} className="group bg-slate-800/40 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-slate-700/50 overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm cursor-pointer flex flex-col pt-2" onClick={() => navigate(`/product/${prod.id}`)}>
                  <div className="relative overflow-hidden aspect-square bg-slate-900/50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 relative z-10" />
                    {prod.discount > 0 && (
                      <div className="absolute top-3 left-3 z-20 bg-red-500/90 backdrop-blur-md border border-red-500/50 text-white px-2 py-1 rounded-md text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                        -{prod.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 relative z-10">
                    <p className="text-[10px] uppercase font-bold text-cyan-500 tracking-widest mb-1">{prod.brand}</p>
                    <p className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors mb-2">{prod.name}</p>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <div className="flex flex-col">
                        {prod.originalPrice > prod.price && (
                          <span className="text-xs text-slate-500 line-through font-mono">₹{prod.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="font-bold text-white tracking-tight">₹{prod.price.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-0.5">
                        <Star size={14} className="fill-cyan-400 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]" />
                        <span className="text-xs text-slate-400 ml-1 font-semibold">{prod.rating}</span>
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