import React, { useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([
        { id: 1, code: 'WELCOME10', discount: 10, type: 'percentage', expiry: '2024-12-31', status: 'Active' },
        { id: 2, code: 'SUMMER50', discount: 50, type: 'fixed', expiry: '2024-06-30', status: 'Expired' },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        type: 'percentage',
        expiry: ''
    });

    const handleDelete = (id) => {
        if (window.confirm('Delete this coupon?')) {
            setCoupons(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCoupon = {
            id: Date.now(),
            ...formData,
            status: new Date(formData.expiry) > new Date() ? 'Active' : 'Expired',
            discount: parseFloat(formData.discount)
        };
        setCoupons(prev => [...prev, newCoupon]);
        setIsAdding(false);
        setFormData({ code: '', discount: '', type: 'percentage', expiry: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Tag className="w-6 h-6 text-blue-600" />
                    Coupon Management
                </h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Create Coupon
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Add New Coupon</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                            <input
                                type="number"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                type="date"
                                value={formData.expiry}
                                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Coupon
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id}>
                                <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(coupon.expiry).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${coupon.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {coupon.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCoupons;
