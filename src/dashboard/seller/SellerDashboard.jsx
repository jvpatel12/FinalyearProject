import React, { useEffect, useState } from 'react';
import { ShoppingBag, DollarSign, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../auth/useAuth';
import { Link } from 'react-router-dom';

/**
 * Seller Dashboard Component
 * Overview of seller's sales, products, and orders
 */
const SellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        // 1. Get Seller's Products
        const products = await apiService.products.getAll();
        const sellerProducts = products.filter(p => p.sellerId === user.id);
        const sellerProductIds = sellerProducts.map(p => p.id);

        // 2. Get All Orders and Filter for Seller's Products
        const allOrders = await apiService.orders.getAll();

        // Filter orders that contain at least one item from this seller
        // In a real backend, we'd have a specific endpoint
        const sellerOrders = allOrders.filter(order =>
          order.items.some(item => sellerProductIds.includes(item.productId))
        );

        // Calculate Stats
        const totalSales = sellerOrders.reduce((sum, order) => {
          // Sum only items belonging to this seller
          const sellerItemsTotal = order.items
            .filter(item => sellerProductIds.includes(item.productId))
            .reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
          return sum + sellerItemsTotal;
        }, 0);

        const pendingOrders = sellerOrders.filter(o => o.status === 'processing').length;

        setStats({
          totalSales,
          totalOrders: sellerOrders.length,
          totalProducts: sellerProducts.length,
          pendingOrders
        });

        setRecentOrders(sellerOrders.slice(0, 5));

      } catch (error) {
        console.error("Error loading seller dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const statCards = [
    {
      title: 'Total Earnings',
      value: `₹${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+8% from last month'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: `+${stats.pendingOrders} pending`
    },
    {
      title: 'Active Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-indigo-500',
      change: 'In stock'
    },
    {
      title: 'Performance',
      value: '4.8/5',
      icon: TrendingUp, // Using TrendingUp as a proxy for rating icon
      color: 'bg-orange-500',
      change: 'Top Rated Seller'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/seller/add-product" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm">
          + Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp size={16} className="text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link to="/seller/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.items.length > 1 ? `${order.items[0].name} +${order.items.length - 1} more` : order.items[0]?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No orders yet. Start adding products!
              </div>
            )}
          </div>
        </div>

        {/* Tips / Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Seller Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">Stock Alert</h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    Some items are running low on stock. Check your inventory to avoid missed sales.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-2">Grow Your Business</h3>
              <p className="text-sm text-blue-700 mb-3">
                Adding more high-quality images can increase sales by up to 20%.
              </p>
              <Link to="/seller/add-product" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Add New Product &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;