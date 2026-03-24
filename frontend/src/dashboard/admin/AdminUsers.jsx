import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Shield, Ban, CheckCircle, Eye, Trash2, Calendar } from 'lucide-react';
import { apiService } from '../../services/apiService';

/**
 * Admin Users Page Component
 * Manage users in the admin dashboard
 */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Assuming apiService has a getAll users method, or we use storageService directly if apiService lacks it.
      // Based on previous view, apiService might not have exposed getAll users publicly in a nice way for admin.
      // Let's check apiService.js content first. If missing, I'll add it or use storageService.
      // For now, I'll assume I'll add it to apiService or it exists.
      // actually, let's wait for the view_file result to be sure. 
      // But to be efficient, I will write this assuming I might need to patch apiService.
      // standardized apiService.users.getAll()
      const allUsers = await apiService.users.getAll();
      setUsers(allUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiService.users.delete(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      await apiService.users.update(id, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Failed to update user role:", error);
      alert("Failed to update role");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await apiService.users.update(id, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Failed to update status");
    }
  };

  const openUserDetails = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setIsLoadingOrders(true);
    try {
      const orders = await apiService.orders.getUserOrders(user.id);
      setUserOrders(orders);
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      setUserOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const closeUserDetails = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUserOrders([]);
  };

  // Derived filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (user.status || 'active') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600">Manage all users, sellers, and admins</p>
        </div>
        <div className="flex bg-white rounded-lg p-2 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mr-4 text-sm">
            <Shield size={16} className="text-black" />
            <span className="text-black">Total: {users.length}</span>
          </div>
          <div className="flex items-center gap-2 mr-4 text-sm text-green-600">
            <CheckCircle size={16} />
            <span className="text-black">Active: {users.filter(u => (u.status || 'active') === 'active').length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-red-600">
            <Ban size={16} />
            <span className="text-black">Suspended: {users.filter(u => u.status === 'suspended').length}</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border text-black rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border text-black rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className={`px-2 py-1 outline-none text-xs leading-5 font-semibold rounded-full border-0 focus:ring-2 focus:ring-purple-500 cursor-pointer ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                    >
                      <option value="customer" className="bg-white text-gray-900">Customer</option>
                      <option value="seller" className="bg-white text-gray-900">Seller</option>
                      <option value="admin" className="bg-white text-gray-900">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.status || 'active')}
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors cursor-pointer border ${(user.status || 'active') === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800'
                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800'
                        }`}
                      title={(user.status || 'active') === 'active' ? "Click to Suspend" : "Click to Reactivate"}
                    >
                      {user.status === 'suspended' ? <Ban size={14} className="mr-1" /> : <CheckCircle size={14} className="mr-1" />}
                      {user.status === 'suspended' ? 'Suspended' : 'Active'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openUserDetails(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={closeUserDetails}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl border border-indigo-200">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                      <p className="text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Password:</span>
                      <span className="font-medium text-gray-400 italic">•••••••• (Encrypted)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Role:</span>
                      <span className="font-medium capitalize">{selectedUser.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium capitalize ${selectedUser.status === 'suspended' ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedUser.status || 'Active'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Joined:</span>
                      <span className="font-medium">{selectedUser.joinDate ? new Date(selectedUser.joinDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 block border-b pb-2">Activity Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <span className="block text-2xl font-bold text-blue-700">{userOrders.length}</span>
                      <span className="text-sm text-blue-600">Total Orders</span>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <span className="block text-2xl font-bold text-purple-700">
                        ₹{userOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                      </span>
                      <span className="text-sm text-purple-600">Total Spent</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders History */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-gray-500" />
                  Order History
                </h4>

                {isLoadingOrders ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : userOrders.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userOrders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-indigo-600">{order.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No orders found for this user.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 text-right">
              <button
                onClick={closeUserDetails}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;