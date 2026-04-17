import React from 'react';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { X, ShoppingCart, Heart, ArrowLeft, Scale, Info, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../common/Breadcrumbs';

const ComparePage = () => {
    const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const navigate = useNavigate();

    const specs = [
        { label: 'Neural Link Brand', key: 'brand' },
        { label: 'Transmission Rating', key: 'averageRating' },
        { label: 'Credit Requirement', key: 'price', format: (v) => `₹${v.toLocaleString()}` },
        { label: 'Unit Availability', key: 'stock_quantity', format: (v) => v > 0 ? 'READY' : 'OFFLINE' },
        { label: 'Category Sector', key: 'category' },
    ];

    if (comparisonItems.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 mb-6 border border-slate-700">
                    <Scale size={40} />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Comparison Chamber Empty</h2>
                <p className="text-slate-500 mb-8 max-w-sm">No neural links established. Return to the shop to select units for side-by-side analysis.</p>
                <button
                    onClick={() => navigate('/shop')}
                    className="flex items-center gap-2 px-8 py-4 bg-cyan-500 text-slate-900 font-black rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                    <ArrowLeft size={16} /> Return to Shop
                </button>
            </div>
        );
    }

    const toggleWishlist = (product) => {
        if (isInWishlist(product._id || product.id)) {
            removeFromWishlist(product._id || product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Scale size={24} className="text-cyan-500" />
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Analytical Bench</h1>
                        </div>
                        <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">Cross-referencing {comparisonItems.length} neural units</p>
                    </div>

                    <button
                        onClick={clearComparison}
                        className="px-6 py-3 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 hover:border-red-500/50 transition-all"
                    >
                        Purge Chamber
                    </button>
                </div>

                <div className="overflow-x-auto pb-8 custom-scrollbar">
                    <div className="min-w-[1000px] grid" style={{ gridTemplateColumns: `250px repeat(${comparisonItems.length}, 1fr)` }}>
                        {/* Headers */}
                        <div className="p-6 border-b border-slate-800 flex items-center">
                            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Protocol Spec</span>
                        </div>
                        {comparisonItems.map(item => (
                            <div key={item._id || item.id} className="p-6 border-b border-slate-800 relative group">
                                <button
                                    onClick={() => removeFromComparison(item._id || item.id)}
                                    className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                                <div className="aspect-square bg-slate-900/50 rounded-2xl p-4 mb-6 border border-slate-800 flex items-center justify-center">
                                    <img src={item.images?.[0] || '/images/sample.jpg'} alt={item.name} className="w-full h-full object-contain drop-shadow-2xl" />
                                </div>
                                <h3 className="font-black text-white text-sm uppercase leading-tight mb-4 line-clamp-2">{item.name}</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => addToCart(item)}
                                        disabled={item.stock_quantity <= 0}
                                        className="flex-1 bg-cyan-500 text-slate-900 font-black py-2.5 rounded-xl uppercase text-[9px] tracking-widest hover:bg-cyan-400 transition-all"
                                    >
                                        Deploy
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(item)}
                                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isInWishlist(item._id || item.id)
                                                ? 'bg-red-500/20 border-red-500/50 text-red-500'
                                                : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-red-400'
                                            }`}
                                    >
                                        <Heart size={14} fill={isInWishlist(item._id || item.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Specs */}
                        {specs.map((spec, specIdx) => (
                            <React.Fragment key={specIdx}>
                                <div className={`p-6 border-b border-slate-800 flex items-center ${specIdx % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{spec.label}</span>
                                </div>
                                {comparisonItems.map(item => (
                                    <div key={`${item._id || item.id}-${specIdx}`} className={`p-6 border-b border-slate-800 flex items-center font-mono text-xs ${specIdx % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
                                        <span className="text-white">
                                            {spec.key === 'averageRating' ? (
                                                <div className="flex items-center gap-1.5 text-cyan-400">
                                                    <Star size={12} className="fill-cyan-400" />
                                                    {item[spec.key] || '4.5'}
                                                </div>
                                            ) : (
                                                spec.format ? spec.format(item[spec.key]) : (item[spec.key] || 'N/A')
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                        {/* Description */}
                        <div className="p-6 border-b border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Intel</span>
                        </div>
                        {comparisonItems.map(item => (
                            <div key={`${item._id || item.id}-desc`} className="p-6 border-b border-slate-800 text-[10px] text-slate-500 leading-relaxed font-light">
                                {item.description?.substring(0, 150)}...
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #0f172a;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
};

export default ComparePage;
