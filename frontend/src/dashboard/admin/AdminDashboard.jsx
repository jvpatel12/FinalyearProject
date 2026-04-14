import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { apiService } from '../../services/apiService';

/**
 * Admin Dashboard Component
 * Overview of key metrics and recent activity
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch Admin Stats
        const adminStats = await apiService.users.getAdminStats();

        // Fetch All Orders for Recent Orders section
        const allOrders = await apiService.orders.getAll();
        const sortedOrders = [...allOrders]
          .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
          .slice(0, 5);

        // Map stats to display format
        const statsData = [
          {
            title: 'Total Revenue',
            value: `₹${(adminStats.revenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-500',
            change: '+12.5%',
            changeType: 'positive'
          },
          {
            title: 'Total Orders',
            value: (adminStats.orders || 0).toLocaleString(),
            icon: ShoppingCart,
            color: 'bg-blue-500',
            change: '+8.2%',
            changeType: 'positive'
          },
          {
            title: 'Total Users',
            value: (adminStats.users || 0).toLocaleString(),
            icon: Users,
            color: 'bg-purple-500',
            change: '+15.3%',
            changeType: 'positive'
          },
          {
            title: 'Active Products',
            value: (adminStats.products || 0).toLocaleString(),
            icon: Package,
            color: 'bg-orange-500',
            change: '+5.1%',
            changeType: 'positive'
          }
        ];

        setStats(statsData);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard 👑
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage your e-commerce platform.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp size={14} className="text-green-500 mr-1" />
                    ) : (
                      <TrendingDown size={14} className="text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.substring(order.id.length - 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user?.name || 'Guest User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {(order.status || 'unknown').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date || order.createdAt)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No orders recorded in the matrix yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/products/add')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Package size={24} className="text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add New Product</h4>
            <p className="text-sm text-gray-600">Create a new product listing</p>
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Users size={24} className="text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Users</h4>
            <p className="text-sm text-gray-600">View and manage user accounts</p>
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <ShoppingCart size={24} className="text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900">Process Orders</h4>
            <p className="text-sm text-gray-600">Handle pending orders</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
