import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, ExternalLink, MapPin } from 'lucide-react';
import OrderStatusTracker from '../../common/OrderStatusTracker';
import { OrderSkeleton } from '../../common/Skeleton';
import Breadcrumbs from '../../common/Breadcrumbs';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await apiService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchOrders();
    }, []);

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-24 px-4 pb-20">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse mb-8"></div>
                    {[...Array(3)].map((_, i) => <OrderSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <Breadcrumbs />

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Package size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Order History</h1>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Tracking {orders.length} active deployment(s)</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-16 text-center backdrop-blur-sm">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-600 mx-auto mb-6">
                            <Clock size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase">No Logs Found</h3>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">You haven't initiated any product procurement cycles yet.</p>
                        <button className="bg-cyan-500 text-slate-900 font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all">Initialize First Order</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-slate-700 transition-colors">
                                <div className="p-6 cursor-pointer" onClick={() => toggleOrder(order._id)}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Order ID</p>
                                                <p className="text-sm font-mono text-white">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:flex items-center gap-8">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-cyan-500 animate-pulse'} shadow-[0_0_8px_currentColor]`}></div>
                                                    <p className="text-xs font-bold text-white uppercase">{order.status}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Credit Total</p>
                                                <p className="text-sm font-bold text-white">₹{order.totalPrice?.toLocaleString()}</p>
                                            </div>
                                            <div className="hidden md:block">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Deployed At</p>
                                                <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                {expandedOrder === order._id ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                                            </div>
                                        </div>
                                    </div>

                                    <OrderStatusTracker status={order.status} />
                                </div>

                                {expandedOrder === order._id && (
                                    <div className="border-t border-slate-800 p-8 pt-0 animate-in slide-in-from-top-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                                            <div>
                                                <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-6">Payload Units ({order.orderItems?.length})</h4>
                                                <div className="space-y-4">
                                                    {order.orderItems?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                                            <div className="w-16 h-16 bg-slate-900 rounded-xl p-2 flex items-center justify-center">
                                                                <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-contain" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-bold text-white mb-1 line-clamp-1">{item.name}</p>
                                                                <p className="text-[10px] text-slate-500 font-mono">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs font-bold text-white">₹{(item.quantity * item.price)?.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-6">Delivery Coordinates</h4>
                                                <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                                    <div className="flex items-start gap-4">
                                                        <MapPin className="text-slate-600 mt-1" size={18} />
                                                        <div>
                                                            <p className="text-xs font-bold text-white mb-2">{order.shippingAddress?.name || 'Primary Recipient'}</p>
                                                            <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                                                                {order.shippingAddress?.street},<br />
                                                                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}<br />
                                                                {order.shippingAddress?.country || 'India'}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 mt-4 font-mono">Comms: {order.shippingAddress?.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-8 flex gap-4">
                                                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                                                        Export Manifest
                                                    </button>
                                                    <button className="flex-1 flex items-center justify-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-slate-900 transition-all">
                                                        Real-time Telemetry
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
