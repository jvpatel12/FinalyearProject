import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye, Filter, Search, Grid, List, X, Scale, CheckCircle2 } from 'lucide-react';
import storageService from '../services/storageService';
import { useCart } from '../cart/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext';
import { apiService } from '../services/apiService';
import { ProductSkeleton } from '../common/Skeleton';
import Breadcrumbs from '../common/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useComparison } from '../context/ComparisonContext';

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [categories] = useState(() => storageService.getCategories() || []);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { comparisonItems, addToComparison, isInComparison, clearComparison } = useComparison();

  const [searchTerm, setSearchTerm] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('search') || '';
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedRating, setSelectedRating] = useState('0');
  const [availability, setAvailability] = useState('all'); // all, in-stock, out-of-stock
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Asus', 'Logitech', 'Razer', 'Microsoft', 'Google'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: selectedCategory === 'all' ? 'all' : selectedCategory,
        brand: selectedBrand === 'all' ? 'all' : selectedBrand,
        rating: selectedRating === '0' ? '0' : selectedRating,
        availability: availability,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sortBy: sortBy,
        page: page,
        limit: 12
      };

      const data = await apiService.products.getAll(params);
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setTotal(data.total || (data.products?.length || 0));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setTimeout(() => setLoading(false), 600); // Small delay for smooth feel
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedBrand, selectedRating, availability, priceRange.min, priceRange.max, sortBy, page]);

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id || product.id)) {
      removeFromWishlist(product._id || product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedRating('0');
    setAvailability('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
  };

  const toggleComparison = (product) => {
    addToComparison(product);
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 space-y-8">
            <div>
              <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em] mb-6">Discovery Protocols</h3>

              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search query..."
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Categories */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Sector (Category)</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Global Access</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                {/* Brands */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Vendor (Brand)</label>
                  <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="filter-select">
                    <option value="all">All Vendors</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Unit Status</label>
                  <div className="space-y-2">
                    {['all', 'in-stock', 'out-of-stock'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === opt}
                          onChange={() => setAvailability(opt)}
                          className="hidden"
                        />
                        <div className={`w-3 h-3 rounded-full border ${availability === opt ? 'bg-cyan-500 border-cyan-400' : 'border-slate-700 group-hover:border-slate-500'}`}></div>
                        <span className={`text-xs uppercase tracking-tighter ${availability === opt ? 'text-white font-bold' : 'text-slate-500'}`}>{opt.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">User Rating</label>
                  <select value={selectedRating} onChange={e => setSelectedRating(e.target.value)} className="filter-select">
                    <option value="0">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Credit Range (Price)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="MIN" value={priceRange.min} onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))} className="w-1/2 bg-slate-900/50 border border-slate-700/50 rounded-lg py-1.5 px-2 text-xs text-white" />
                    <input type="number" placeholder="MAX" value={priceRange.max} onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))} className="w-1/2 bg-slate-900/50 border border-slate-700/50 rounded-lg py-1.5 px-2 text-xs text-white" />
                  </div>
                </div>

                <button onClick={clearFilters} className="w-full py-2 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-800 hover:text-white transition-all">Reset All</button>
              </div>
            </div>
          </aside>

          {/* Product Feed */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Payload Feed</h1>
                <p className="text-xs text-slate-500 font-mono mt-1">Found {total} active units matching criteria</p>
              </div>

              <div className="flex items-center gap-4">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent text-xs font-bold text-slate-400 uppercase tracking-widest outline-none cursor-pointer hover:text-cyan-400 transition-colors">
                  <option value="newest" className="bg-slate-900">Newest Arrival</option>
                  <option value="price-low" className="bg-slate-900">Lowest Price</option>
                  <option value="price-high" className="bg-slate-900">Highest Price</option>
                  <option value="rating" className="bg-slate-900">User Rating</option>
                </select>

                <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-cyan-500 text-slate-900' : 'text-slate-500'}`}><Grid size={16} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-cyan-500 text-slate-900' : 'text-slate-500'}`}><List size={16} /></button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 rounded-3xl border border-slate-800/50 border-dashed">
                <Search size={48} className="text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Zero Matches Found</h3>
                <p className="text-slate-500 text-sm mb-6">Adjust your filters to expand discovery search.</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest border border-slate-700 hover:border-cyan-500 transition-all">Clear Protocol</button>
              </div>
            ) : (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence>
                  {products.map((product, idx) => (
                    <motion.div
                      key={product._id || product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`group relative bg-slate-800/40 rounded-3xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/50 transition-all duration-500 ${viewMode === 'list' ? 'flex flex-row h-72' : 'flex flex-col'}`}
                    >
                      {/* Image Layer */}
                      <div className={`relative bg-slate-950/50 flex items-center justify-center p-8 overflow-hidden ${viewMode === 'list' ? 'w-80' : 'h-64'}`}>
                        <img
                          src={product.images?.[0] || '/images/sample.jpg'}
                          alt={product.name}
                          className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-700 relative z-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        {/* Comparison Toggle Overlay */}
                        <button
                          onClick={() => toggleComparison(product)}
                          className={`absolute bottom-3 left-3 z-20 w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center transition-all ${isInComparison(product._id || product.id)
                            ? 'bg-cyan-500 border-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                            : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-cyan-400 hover:text-cyan-400'
                            }`}
                          title="Compare Tool"
                        >
                          <Scale size={14} />
                        </button>

                        {/* Quick Action Overlay */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                          <button
                            onClick={() => toggleWishlist(product)}
                            className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${isInWishlist(product._id || product.id)
                              ? 'bg-red-500/20 border-red-500/50 text-red-500'
                              : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-red-400'
                              }`}
                          >
                            <Heart size={16} fill={isInWishlist(product._id || product.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>

                      {/* Content Layer */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">{product.brand || 'CyberCore'}</span>
                          <div className="flex items-center gap-1">
                            <Star size={10} className="fill-yellow-500 text-yellow-500" />
                            <span className="text-[10px] text-slate-400 font-bold">{product.averageRating || '4.5'}</span>
                          </div>
                        </div>

                        <h3
                          onClick={() => navigate(`/product/${product._id || product.id}`)}
                          className="text-lg font-black text-white hover:text-cyan-400 transition-colors mb-3 line-clamp-2 cursor-pointer leading-tight uppercase"
                        >
                          {product.name}
                        </h3>

                        <div className="mt-auto">
                          <div className="flex items-end justify-between mb-4">
                            <div>
                              <p className="text-2xl font-black text-white tracking-tighter">₹{product.price.toLocaleString()}</p>
                              {product.originalPrice > product.price && (
                                <p className="text-[10px] text-slate-500 line-through font-mono">₹{product.originalPrice.toLocaleString()}</p>
                              )}
                            </div>
                            <span className={`text-[8px] font-bold px-2 py-1 rounded-md border ${product.stock_quantity > 0 ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' : 'border-red-500/30 text-red-400 bg-red-500/5'
                              }`}>
                              {product.stock_quantity > 0 ? 'SYNC READY' : 'OFFLINE'}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/product/${product._id || product.id}`)}
                              className="w-10 h-10 rounded-xl bg-slate-900/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock_quantity <= 0}
                              className="flex-1 bg-cyan-500 text-slate-900 font-black py-2.5 rounded-xl uppercase text-xs tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                            >
                              Deploy Unit
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Comparison Drawer */}
      <AnimatePresence>
        {comparisonItems.length > 0 && (
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-4 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <Scale size={18} className="text-cyan-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Comparison Chamber ({comparisonItems.length}/4)</h4>
              </div>
              <button
                onClick={clearComparison}
                className="text-slate-500 hover:text-white transition-colors"
              ><X size={18} /></button>
            </div>

            <div className="flex gap-3 mb-6">
              {comparisonItems.map(item => (
                <div key={item._id || item.id} className="relative w-20 h-20 bg-slate-950 rounded-xl border border-slate-800 p-2 group">
                  <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-contain" />
                  <button
                    onClick={() => addToComparison(item)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  ><X size={12} /></button>
                </div>
              ))}
              {[...Array(4 - comparisonItems.length)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-slate-800/20 border border-slate-800 border-dashed rounded-xl flex items-center justify-center text-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center px-1">Add Unit</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/compare')}
              className="w-full bg-cyan-500 text-slate-900 font-black py-4 rounded-2xl uppercase text-sm tracking-widest hover:bg-cyan-400 transition-all flex items-center justify-center gap-3"
            >
              Analyze Data <CheckCircle2 size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .filter-select {
          width: 100%;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(226, 232, 240, 0.05);
          border-radius: 12px;
          padding: 10px 14px;
          color: white;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          appearance: none;
          cursor: pointer;
          transition: all 0.3s ease;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.25em 1.25em;
        }
        .filter-select:hover {
          border-color: rgba(6, 182, 212, 0.3);
          background-color: rgba(15, 23, 42, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Shop;
