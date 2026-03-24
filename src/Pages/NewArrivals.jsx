import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye, Grid, List, Sparkles } from 'lucide-react';
import storageService from '../services/storageService';
import { useCart } from '../cart/CartContext.jsx';

/**
 * New Arrivals Page Component
 * Displays the most recently added products
 */
const NewArrivals = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState([]);
    const [products, setProducts] = useState(() => storageService.getProducts() || []);
    const [viewMode, setViewMode] = useState('grid');

    // Filter products added within the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newProducts = products
        .filter(p => new Date(p.createdAt || Date.now()) > oneWeekAgo)
        .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
        .slice(0, 20);

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

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8 relative">
                {/* Background glow */}
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="mb-8 relative overflow-hidden bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-2xl p-8 text-white z-10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-cyan-400">
                            <Sparkles size={20} />
                            <span className="text-sm font-bold tracking-wider uppercase">Just Landed</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">New Arrivals</h1>
                        <p className="text-slate-400 max-w-xl text-lg font-light">Check out the latest additions to our collection. Be the first to own the newest tech.</p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>
                    <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-cyan-600/20 blur-[80px] pointer-events-none"></div>
                </div>

                {/* Toolbar */}
                <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50 p-5 mb-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 font-mono text-sm">
                            &gt; Showing <span className="text-cyan-400 font-bold">{newProducts.length}</span> latest products
                        </p>

                        <div className="flex border border-slate-700/50 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-3 transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-3 transition-colors border-l border-slate-700/50 ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid/List */}
                <div className={`grid gap-6 relative z-10 ${viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}>
                    {newProducts.map((product) => (
                         <div key={product.id} className={`group bg-slate-800/40 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-slate-700/50 overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'
                            }`}>
                            {/* Product Image */}
                            <div className={`relative overflow-hidden bg-slate-900/50 p-6 flex items-center justify-center ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-square'}`}>
                                {/* Subtle background glow behind product */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div className="absolute top-3 left-3 z-20 bg-cyan-500/90 backdrop-blur-md border border-cyan-500/50 text-slate-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center gap-1">
                                    <Sparkles size={12} /> NEW
                                </div>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={`w-full ${viewMode === 'list' ? 'h-full' : 'h-full'} object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 relative z-10`}
                                />
                                {product.discount > 0 && (
                                     <div className="absolute top-3 right-3 right-auto left-auto mt-8 z-20 bg-red-500/90 backdrop-blur-md border border-red-500/50 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                                        -{product.discount}%
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
                                    <div className="mb-2 flex justify-between items-center">
                                        <span className="text-[10px] uppercase font-bold text-cyan-500 tracking-widest">{product.brand}</span>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800/50 border border-slate-700 px-2 py-0.5 rounded-md">
                                            {getTimeAgo(product.createdAt)}
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
            </div>
        </div>
    );
};

export default NewArrivals;
