import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../cart/CartContext';
import { Trash2, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        const productImages = product.images && product.images.length > 0 ? product.images : ['/images/sample.jpg'];
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: productImages[0],
            sellerId: product.sellerId
        });
        removeFromWishlist(product.id);
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
                <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <Heart className="h-10 w-10 text-slate-700" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Your Vault is Empty</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-10 font-light">Your curated selection of future tech awaits. Start scouting the shop to add items to your watchlist.</p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center px-8 py-4 bg-cyan-500 text-slate-950 font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105"
                    >
                        Initialize Shopping
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                            <span className="w-2 h-10 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></span>
                            My <span className="text-cyan-400">Watchlist</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-widest">Saved Inventory: {wishlist.length} Items</p>
                    </div>
                    <Link to="/shop" className="text-cyan-500 hover:text-cyan-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-colors">
                        Continue Scouting <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                    {wishlist.map((product) => (
                        <div key={product.id} className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col overflow-hidden hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-all duration-500">
                            <div className="aspect-square bg-slate-950 group-hover:opacity-90 overflow-hidden relative p-8">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/sample.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                                />
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 shadow-xl transition-all z-20 backdrop-blur-md"
                                    title="Remove from Watchlist"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 block">{product.brand || 'Tech Gear'}</span>
                                    <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-cyan-400 transition-colors">
                                        <Link to={`/product/${product.id}`}>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-2xl font-black text-white tracking-tight">₹{product.price.toLocaleString()}</p>
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCart(product);
                                        }}
                                        className="w-full py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                        Initialize Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
