import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAuth } from '../auth/useAuth';

const OrderHistoryPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const userOrders = await apiService.orders.getUserOrders(user.id);
            // Sort by date desc
            userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrders(userOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />;
            case 'processing': return <Clock className="w-5 h-5 text-orange-500" />;
            case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 relative">
            <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center mb-10 pb-6 border-b border-slate-700/50">
                    <button
                        onClick={() => navigate('/shop')}
                        className="mr-6 p-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 hover:border-cyan-500/30 rounded-full transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transform group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase flex items-center gap-4">
                        <span className="w-2 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                        Transmission Logs
                    </h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl shadow-xl p-16 text-center border border-slate-700/50 max-w-2xl mx-auto mt-10">
                        <div className="relative w-24 h-24 mx-auto mb-6 flex justify-center items-center">
                            <Package className="w-16 h-16 text-slate-600 relative z-10" />
                            <div className="absolute inset-0 bg-slate-700/20 blur-xl rounded-full"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">No Archives Found</h3>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto tracking-wide">Looks like you haven't authorized any acquisitions yet.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold tracking-widest uppercase text-sm px-8 py-3.5 rounded-xl hover:bg-cyan-500 hover:text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
                        >
                            Browse Armory
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all group">
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-6">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                                <span className="font-bold text-xl text-white tracking-tight flex items-center gap-2">
                                                    <span className="text-cyan-500 font-mono">#</span>
                                                    {order.id}
                                                </span>
                                                <span className="h-4 w-px bg-slate-700 hidden sm:block"></span>
                                                <span className={`px-3 py-1 rounded border text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 ${order.status === 'delivered' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                        order.status === 'shipped' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                                                            order.status === 'processing' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                                order.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                                    'bg-slate-700/50 border-slate-600 text-slate-300'
                                                    }`}>
                                                    {order.status === 'delivered' ? <CheckCircle className="w-3.5 h-3.5" /> :
                                                        order.status === 'shipped' ? <Truck className="w-3.5 h-3.5" /> :
                                                            order.status === 'processing' ? <Clock className="w-3.5 h-3.5" /> :
                                                                order.status === 'cancelled' ? <XCircle className="w-3.5 h-3.5" /> :
                                                                    <Package className="w-3.5 h-3.5" />}
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                                                INITIALIZED {new Date(order.date).toLocaleDateString()} // {new Date(order.date).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="md:text-right bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 w-full md:w-auto">
                                            <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">Net Exchange</p>
                                            <p className="text-3xl font-extrabold text-cyan-400 tracking-tighter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                                                ₹{order.total.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-700/50 pt-8">
                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-700/30 hover:border-cyan-500/20 transition-colors">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 bg-slate-900 rounded-xl border border-slate-700/50 p-1 flex-shrink-0 relative overflow-hidden">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain relative z-10" />
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/10 to-transparent"></div>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white line-clamp-1 tracking-wide mb-1 flex items-center gap-2">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs font-mono text-slate-400 tracking-widest">
                                                                QTY: <span className="text-cyan-400">{item.quantity}</span><span className="mx-2 text-slate-600">|</span>RATE: <span className="text-white">₹{item.price.toLocaleString()}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="font-extrabold text-white text-lg tracking-tight self-end sm:self-auto ml-21 sm:ml-0">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-700/50 mt-8 pt-6 flex justify-between items-center">
                                        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/30">
                                            PAYLOAD SIZE: <span className="text-cyan-400 font-bold">{order.items.length}</span> {order.items.length === 1 ? 'UNIT' : 'UNITS'}
                                        </span>
                                        <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                                            Analyze Data <ChevronRight className="w-4 h-4" />
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

export default OrderHistoryPage;
