import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye, Filter, Search, Grid, List } from 'lucide-react';
import storageService from '../services/storageService';
import { useCart } from '../cart/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext';
import { apiService } from '../services/apiService';
import { categories as initialCategories } from "./productsData";

/**
 * Shop Page Component - Product Listing Page
 * Features product grid, filtering, search, and cart functionality
 */
const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [categories] = useState(() => storageService.getCategories() || []);
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('search') || '';
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch products from API with filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        keyword: searchTerm,
        categories: selectedCategory === 'all' ? '' : selectedCategory,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sort: sortBy === 'price-low' ? 'priceLow' : sortBy === 'price-high' ? 'priceHigh' : sortBy === 'rating' ? 'rating' : 'newest',
        pageNumber: page,
        pageSize: 12
      };

      const data = await apiService.products.getAll(params);

      // Handle different return structures if any
      if (data.products) {
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } else {
        setProducts(data);
        setPages(1);
        setTotal(data.length);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, priceRange.min, priceRange.max, sortBy, page]);

  // Toggle wishlist using global context
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
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

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Background glow for shop page */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <div className="mb-8 relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Browse our Collection</h1>
          <p className="text-slate-400">Discover our complete collection of premium tech</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50 p-5 mb-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"

              />
            </div>

            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-white bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
              >
                <option value="all" className="bg-slate-800 text-white">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug} className="bg-slate-800 text-white">{category.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-white bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
              >
                <option value="relevance" className="bg-slate-800">Relevance</option>
                <option value="price-low" className="bg-slate-800">Price: Low to High</option>
                <option value="price-high" className="bg-slate-800">Price: High to Low</option>
                <option value="rating" className="bg-slate-800">Highest Rated</option>
                <option value="name" className="bg-slate-800">Name A-Z</option>
                <option value="newest" className="bg-slate-800">Newest</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 border rounded-xl transition-all text-sm font-semibold shadow-[0_0_15px_rgba(0,0,0,0.3)] ${showFilters ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700/80 hover:text-white hover:border-slate-500'
                  }`}
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>

              <div className="flex border border-slate-700/50 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-3 transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-3 transition-colors border-l border-slate-700/50 ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-slate-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">Min Price</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">Max Price</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="Maximum"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full bg-slate-800 border border-slate-600 text-slate-300 py-3 px-4 rounded-xl hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all font-semibold shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 relative z-10">
          <p className="text-slate-400 font-mono text-sm">
            &gt; Found <span className="text-cyan-400 font-bold">{total || products.length}</span> products
            {selectedCategory !== 'all' && ` in [${(categories.length > 0 ? categories : initialCategories).find(c => c.slug === selectedCategory)?.name || selectedCategory}]`}
          </p>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
            <p className="text-cyan-400 font-mono animate-pulse">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-slate-800 relative z-10 backdrop-blur-sm">
            <Search size={64} className="mx-auto text-slate-600 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No products found</h3>
            <p className="text-slate-400 mb-8 font-light max-w-md mx-auto">The requested parameters yield no results in the current database. Try broadening your search criteria.</p>
            <button
              onClick={clearFilters}
              className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold px-8 py-3 rounded-xl hover:bg-cyan-500 hover:text-slate-900 hover:border-cyan-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 relative z-10 ${viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
            }`}>
            {products.map((product) => (
              <div key={product.id} className={`group bg-slate-800/40 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-slate-700/50 overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'
                }`}>
                {/* Product Image */}
                <div className={`relative overflow-hidden bg-slate-900/50 p-6 flex items-center justify-center ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-square'}`}>
                  {/* Subtle background glow behind product */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/sample.jpg'}
                    alt={product.name}
                    onError={(e) => {
                      if (e.currentTarget.src.endsWith('/images/sample.jpg')) return;
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/sample.jpg';
                    }}
                    className={`w-full ${viewMode === 'list' ? 'h-full' : 'h-full'} object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 relative z-10`}
                  />

                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 z-20 bg-red-500/90 backdrop-blur-md border border-red-500/50 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                      -{product.discount}%
                    </div>
                  )}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 z-20 bg-slate-900/60 backdrop-blur-md border border-slate-700 p-2.5 rounded-full hover:bg-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-xl group/wishlist"
                  >
                    <Heart
                      size={18}
                      className={`transition-all duration-300 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-slate-400 group-hover/wishlist:text-red-400'}`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className={`p-6 flex flex-col justify-between relative z-10 ${viewMode === 'list' ? 'flex-1' : 'flex-1'}`}>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-cyan-500 tracking-widest">{product.brand}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${product.stock > 0 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors h-14">{product.name}</h3>

                    {viewMode === 'list' && (
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2 font-light">{product.description}</p>
                    )}

                    <div className="flex items-center mb-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={`${star <= Math.floor(product.rating)
                              ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]'
                              : star - 0.5 <= product.rating
                                ? 'fill-cyan-400 text-cyan-400 opacity-50'
                                : 'text-slate-700'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 ml-2 font-medium">({product.reviews})</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-5">
                      <div className="flex flex-col">
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-500 line-through mb-0.5 font-mono">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-white tracking-tight">₹{product.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-white py-2.5 px-4 rounded-xl hover:bg-slate-700 hover:border-slate-500 transition-all font-semibold"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 flex items-center justify-center gap-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-500/20 py-2.5 px-4 rounded-xl disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-800 disabled:shadow-none transition-all font-semibold"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {[...Array(pages).keys()].map(x => (
                  <button
                    key={x + 1}
                    onClick={() => setPage(x + 1)}
                    className={`w-10 h-10 rounded-lg border font-mono text-sm transition-all ${page === x + 1
                        ? 'bg-cyan-500 border-cyan-500 text-slate-900 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;