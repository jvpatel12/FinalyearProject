import React, { useState, useEffect } from 'react';
import { Package, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { apiService } from '../../services/apiService';

/**
 * Orders Page Component
 * Displays customer's order history and order details
 */
const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          const userOrders = await apiService.orders.getUserOrders(user.id);
          setOrders(userOrders);
        } catch (error) {
          console.error("Failed to load orders", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center border dashed border-gray-300">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">When you place your first order, it will appear here.</p>
            <button
              onClick={() => window.location.href = '/shop'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <div className="flex items-start md:items-center space-x-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">Order #{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1 font-medium"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Order Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="border-t pt-6 mt-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Order Items</h4>
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Delivery Information</h4>
                          <div className="space-y-4 text-sm">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <span className="font-medium text-gray-700 block mb-1">Shipping Address</span>
                              <p className="text-gray-600">
                                {order.shippingAddress?.name}<br />
                                {order.shippingAddress?.address}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
                                Phone: {order.shippingAddress?.phone}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <span className="font-medium text-gray-700 block mb-1">Payment Method</span>
                              <p className="text-gray-600 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
