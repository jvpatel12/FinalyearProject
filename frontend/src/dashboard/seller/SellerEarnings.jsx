import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../auth/useAuth';

/**
 * Seller Earnings Page Component
 * Track seller revenue and financial stats
 */
const SellerEarnings = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingClearance: 0,
    withdrawable: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    fetchEarnings();
  }, [user]);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= stats.withdrawable) {
      // In a real app, API call to process withdrawal
      setStats(prev => ({
        ...prev,
        withdrawable: prev.withdrawable - amount,
        pendingClearance: prev.pendingClearance // In real logic, might move to a "Processing" status
      }));
      alert(`Withdrawal request for ₹${amount} submitted successfully!`);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    }
  };

  const fetchEarnings = async () => {
    console.log("fetchEarning is running")
    if (!user?.id) return;
    try {
      const products = await apiService.products.getAll();
      const sellerProducts = products.filter(p => p.sellerId === user.id);
      const sellerProductIds = sellerProducts.map(p => p.id);

      const allOrders = await apiService.orders.getAll();

      let total = 0;
      let monthly = 0;
      const currentMonth = new Date().getMonth();

      allOrders.forEach(order => {
        const orderTotal = order.items
          .filter(item => sellerProductIds.includes(item.productId))
          .reduce((sum, item) => sum + (item.price * item.quantity), 0);

        total += orderTotal;

        if (new Date(order.date).getMonth() === currentMonth) {
          monthly += orderTotal;
        }
      });

      setStats({
        totalEarnings: total,
        monthlyEarnings: monthly,
        pendingClearance: total * 0.1, // Simulated 10% pending
        withdrawable: total * 0.9      // Simulated 90% withdrawable
      });

    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h2>
          <p className="text-gray-600">Track your revenue and manage withdrawals</p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium shadow-sm"
        >
          Withdraw Funds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Earnings</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalEarnings.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">This Month</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.monthlyEarnings.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Pending Clearance</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.pendingClearance.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Available to Withdraw</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.withdrawable.toLocaleString()}</h3>
        </div>
      </div>

      {/* Transaction History Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-full mr-4">
                <ArrowDownRight className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Payout to Bank Account (****1234)</p>
                <p className="text-xs text-gray-500">Processed on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-red-600">-₹5,000.00</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Order Revenue (ORD-001)</p>
                <p className="text-xs text-gray-500">Cleared on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-green-600">+₹1,200.00</span>
          </div>
        </div>
      </div>
      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Withdraw Funds</h3>

            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-purple-700 font-medium">Available Balance</p>
              <p className="text-2xl font-bold text-purple-900">₹{stats.withdrawable.toLocaleString()}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Withdraw
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="0.00"
                  max={stats.withdrawable}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > stats.withdrawable}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerEarnings;