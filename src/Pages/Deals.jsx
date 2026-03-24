import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye, Filter, Grid, List, ShoppingBag } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useCart } from '../cart/CartContext.jsx';
import { useEffect } from 'react';

/**
 * Deals Page Component
 * Displays products with active discounts
 */
const Deals = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('discount');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setLoading(true);
                const allProducts = await apiService.products.getAll();
                // Filter only products with discount > 0
                setProducts(allProducts.filter(p => p.discount > 0));
            } catch (error) {
                console.error("Failed to fetch deal products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'discount') return b.discount - a.discount;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

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

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8 relative">
                {/* Background glow */}
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="mb-8 relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Techno Deals</h1>
                    <p className="text-slate-400">Grab the best electronics at unbeatable prices</p>
                </div>

                {/* Toolbar */}
                <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50 p-5 mb-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 font-mono text-sm">
                            &gt; Found <span className="text-cyan-400 font-bold">{sortedProducts.length}</span> amazing deals
                        </p>

                        <div className="flex gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-white bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                            >
                                <option value="discount" className="bg-slate-800 text-white">Biggest Discount</option>
                                <option value="price-low" className="bg-slate-800 text-white">Price: Low to High</option>
                                <option value="price-high" className="bg-slate-800 text-white">Price: High to Low</option>
                            </select>

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
                </div>

                {/* Products Grid/List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
                        <p className="text-cyan-400 font-mono animate-pulse uppercase tracking-[0.2em]">Intercepting Transmissions...</p>
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-slate-800 relative z-10 backdrop-blur-sm">
                        <ShoppingBag size={64} className="mx-auto text-slate-600 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No Active Deals</h3>
                        <p className="text-slate-400 mb-8 font-light max-w-md mx-auto">Our intelligence suggests no active discounts at this time. Check back at the next cycle.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold px-8 py-3 rounded-xl hover:bg-cyan-500 hover:text-slate-900 hover:border-cyan-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all"
                        >
                            Return to Armory
                        </button>
                    </div>
                ) : (
                    <div className={`grid gap-6 relative z-10 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                    {sortedProducts.map((product) => (
                        <div key={product.id} className={`group bg-slate-800/40 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-slate-700/50 overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'
                            }`}>
                            {/* Product Image */}
                            <div className={`relative overflow-hidden bg-slate-900/50 p-6 flex items-center justify-center ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-square'}`}>
                                {/* Subtle background glow behind product */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                <img
                                    src={product.image || '/images/sample.jpg'}
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
                                        -{product.discount}% OFF
                                    </div>
                                )}
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute top-3 right-3 z-20 bg-slate-900/60 backdrop-blur-md border border-slate-700 p-2.5 rounded-full hover:bg-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-xl group/wishlist"
                                >
                                    <Heart
                                        size={18}
                                        className={`transition-all duration-300 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-slate-400 group-hover/wishlist:text-red-400'}`}
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
                                            {product.stock > 0 ? 'IN STOCK' : 'DEPLETED'}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors h-14" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer'}}>{product.name}</h3>

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
                                        <span className="text-xs text-slate-500 ml-2 font-medium">({product.reviews} reviews)</span>
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
                                            View
                                        </button>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                            className="flex-1 flex items-center justify-center gap-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-500/20 py-2.5 px-4 rounded-xl disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-800 disabled:shadow-none transition-all font-semibold"
                                        >
                                            <ShoppingCart size={16} />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
};

export default Deals;
