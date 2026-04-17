import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Grid, List, Star } from 'lucide-react';
import storageService from '../services/storageService';
import { useCart } from '../cart/CartContext.jsx';
import { ProductSkeleton } from '../common/Skeleton';
import Breadcrumbs from '../common/Breadcrumbs';

const Deals = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('discount');

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setLoading(true);
                // Simulate API call using storageService
                const allProducts = storageService.getProducts() || [];
                // Only products with discounts
                const deals = allProducts.filter(p => p.discount > 0);
                setProducts(deals);
            } finally {
                setTimeout(() => setLoading(false), 800);
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

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8 relative">
                <Breadcrumbs />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                        {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
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
                    <div className={`grid gap-6 relative z-10 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                        {sortedProducts.map((product) => (
                            <div key={product.id} className={`group bg-slate-800/40 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-slate-700/50 overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                                <div className={`relative overflow-hidden bg-slate-900/50 p-6 flex items-center justify-center ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-square'}`}>
                                    <div className="absolute top-3 left-3 z-20 bg-red-500/90 backdrop-blur-md border border-red-500/50 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                                        -{product.discount}%
                                    </div>
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : '/images/sample.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 relative z-10"
                                    />
                                </div>

                                <div className="p-6 flex flex-col justify-between flex-1 relative z-10">
                                    <div>
                                        <div className="mb-2 flex justify-between items-center">
                                            <span className="text-[10px] uppercase font-bold text-cyan-500 tracking-widest">{product.brand}</span>
                                            <div className="flex items-center gap-1">
                                                <Star size={12} className="text-yellow-400 fill-current" />
                                                <span className="text-xs text-slate-400 font-bold">{product.rating || '4.5'}</span>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors h-14" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-end justify-between mb-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500 line-through mb-0.5 font-mono">₹{product.originalPrice.toLocaleString()}</span>
                                                <span className="text-2xl font-bold text-white tracking-tight">₹{product.price.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => addToCart(product)}
                                            className="w-full flex items-center justify-center gap-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-500/20 py-3 rounded-xl transition-all font-semibold uppercase text-xs tracking-widest"
                                        >
                                            Intercept Unit
                                        </button>
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
