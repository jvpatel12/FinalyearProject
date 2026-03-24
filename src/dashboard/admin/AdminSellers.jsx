import React, { useState } from 'react';
import { Search, UserCheck, UserX, MoreVertical, Shield } from 'lucide-react';

const AdminSellers = () => {
    // Mock data for sellers
    const [sellers, setSellers] = useState([
        { id: 1, name: 'TechWorld', owner: 'Jeel Patel', email: 'jeel@techworld.com', status: 'Active', sales: 120, rating: 4.5 },
        { id: 2, name: 'FashionHub', owner: 'Patel', email: 'patel@fashionhub.com', status: 'Pending', sales: 0, rating: 0 },
        { id: 3, name: 'HomeDecor', owner: 'Amit', email: 'amit@homedecor.com', status: 'Suspended', sales: 45, rating: 3.8 },
    ]);

    const handleStatusChange = (id, newStatus) => {
        setSellers(prev => prev.map(seller => seller.id === id ? { ...seller, status: newStatus } : seller));
        alert(`Seller status updated to ${newStatus}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    Seller Management
                </h1>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search sellers..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store / Owner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sellers.map((seller) => (
                            <tr key={seller.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                            {seller.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                                            <div className="text-sm text-gray-500">{seller.owner}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${seller.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            seller.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {seller.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {seller.sales}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex text-yellow-400">
                                        ★ {seller.rating || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {seller.status === 'Pending' && (
                                        <button
                                            onClick={() => handleStatusChange(seller.id, 'Active')}
                                            className="text-green-600 hover:text-green-900 mr-4"
                                            title="Approve"
                                        >
                                            <UserCheck className="w-5 h-5" />
                                        </button>
                                    )}
                                    {seller.status === 'Active' && (
                                        <button
                                            onClick={() => handleStatusChange(seller.id, 'Suspended')}
                                            className="text-red-600 hover:text-red-900 mr-4"
                                            title="Suspend"
                                        >
                                            <UserX className="w-5 h-5" />
                                        </button>
                                    )}
                                    {seller.status === 'Suspended' && (
                                        <button
                                            onClick={() => handleStatusChange(seller.id, 'Active')}
                                            className="text-green-600 hover:text-green-900 mr-4"
                                            title="Reactivate"
                                        >
                                            <UserCheck className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSellers;
