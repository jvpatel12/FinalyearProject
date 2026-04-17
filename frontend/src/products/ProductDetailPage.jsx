import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Star, 
    ShoppingCart, 
    Heart, 
    Share2, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    ChevronRight,
    Minus,
    Plus,
    Scale
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { useCart } from '../cart/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext';
import { DetailSkeleton } from '../common/Skeleton';
import Breadcrumbs from '../common/Breadcrumbs';
import { useComparison } from '../context/ComparisonContext';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToComparison, isInComparison } = useComparison();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('data');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await apiService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <DetailSkeleton />;

    if (!product) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h2 className="text-2xl font-bold text-white">System Error: Unit Not Found</h2>
                <button onClick={() => navigate('/shop')} className="mt-4 text-cyan-400">Return to Armory</button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
    };

    const toggleWishlist = () => {
        if (isInWishlist(product._id || product.id)) {
            removeFromWishlist(product._id || product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Media Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-slate-900/50 rounded-3xl border border-slate-800 flex items-center justify-center p-12 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img 
                                src={product.images?.[selectedImage] || '/images/sample.jpg'} 
                                alt={product.name} 
                                className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                        
                        {product.images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-24 h-24 flex-shrink-0 bg-slate-900/50 rounded-xl border p-2 transition-all ${selectedImage === idx ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Meta & Procurement */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-cyan-500 uppercase mb-4">
                                <span>{product.brand}</span>
                                <ChevronRight size={10} />
                                <span>{product.category}</span>
                            </div>
                            
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tighter mb-4">{product.name}</h1>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                                    <Star className="text-yellow-400 fill-current" size={14} />
                                    <span className="text-white font-bold text-sm">{product.averageRating || '4.5'}</span>
                                    <span className="text-slate-500 text-xs">({product.numReviews || '42'} Intel Logs)</span>
                                </div>
                                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${product.stock_quantity > 0 ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                                    {product.stock_quantity > 0 ? 'SYNCED & READY' : 'OFFLINE / OUT OF STOCK'}
                                </div>
                            </div>
                        </div>

                        <div className="mb-10 p-8 bg-slate-900/30 rounded-3xl border border-slate-800 relative overflow-hidden backdrop-blur-sm">
                            <div className="flex items-end gap-3 mb-8">
                                <span className="text-4xl font-black text-white">₹{product.price.toLocaleString()}</span>
                                {product.originalPrice > product.price && (
                                    <span className="text-lg text-slate-500 line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
                                )}
                                {product.discount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md mb-2">-{product.discount}% OFF</span>
                                )}
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                    ><Minus size={16} /></button>
                                    <span className="w-12 text-center text-white font-bold">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                    ><Plus size={16} /></button>
                                </div>
                                <button
                                    onClick={() => addToComparison(product)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${isInComparison(product._id || product.id) ? 'bg-cyan-500 border-cyan-400 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-cyan-500'}`}
                                >
                                    <Scale size={14} /> {isInComparison(product._id || product.id) ? 'Linked' : 'Add to Compare'}
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_quantity <= 0}
                                    className="flex-1 bg-cyan-500 text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase text-sm tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
                                >
                                    <ShoppingCart size={20} /> Deploy to Cart
                                </button>
                                <button
                                    onClick={toggleWishlist}
                                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${isInWishlist(product._id || product.id) ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400'}`}
                                >
                                    <Heart size={20} fill={isInWishlist(product._id || product.id) ? "currentColor" : "none"} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                                <Truck className="text-cyan-500" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase mb-0.5">Rapid Logistics</p>
                                    <p className="text-[8px] text-slate-500 uppercase tracking-tighter">ETA: 2-3 Standard Cycles</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                                <RotateCcw className="text-cyan-500" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase mb-0.5">Return Protocol</p>
                                    <p className="text-[8px] text-slate-500 uppercase tracking-tighter">7 Cycle Sync Policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specs & Reviews */}
                <div className="border-t border-slate-800 pt-16">
                    <div className="flex gap-8 mb-10 border-b border-slate-800 pb-px">
                        {['data', 'intel', 'warranty'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {tab === 'data' ? 'Technical Data' : tab === 'intel' ? 'Strategic Intel' : 'Warranty Shield'}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="bg-slate-900/20 rounded-3xl p-8 border border-slate-800">
                        {activeTab === 'data' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2">Internal Hardware</h4>
                                        <p className="text-slate-400 text-sm font-light leading-relaxed">{product.description}</p>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Manufacturer', value: product.brand },
                                        { label: 'Category Sector', value: product.category },
                                        { label: 'Unit Stock', value: product.stock_quantity },
                                        { label: 'Sync Cycle', value: '7 Days' },
                                        { label: 'Origin', value: 'Global Forge' },
                                        { label: 'Model Protocol', value: 'V.2.4.RC' }
                                    ].map((spec, i) => (
                                        <div key={i} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">{spec.label}</p>
                                            <p className="text-xs text-white font-mono">{spec.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'intel' && (
                            <div className="text-center py-10">
                                <Info className="mx-auto text-slate-600 mb-4" size={32} />
                                <p className="text-slate-400 italic">Accessing classified review logs... (Simulation in progress)</p>
                            </div>
                        )}
                        {activeTab === 'warranty' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-cyan-500" size={20} />
                                    <h4 className="text-white font-bold">Comprehensive Cyber-Shield</h4>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">This unit is covered by a 1-cycle comprehensive shield against hardware malfunctions and firmware glitches induced by non-anomalous usage.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
