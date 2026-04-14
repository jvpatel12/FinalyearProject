import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/apiService';
import { Shield, Search, UserCheck, UserX } from 'lucide-react';
const AdminSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const data = await apiService.users.getSellerStats();
            setSellers(data);
        } catch (error) {
            toast.error('Failed to fetch sellers');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSellers();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await apiService.users.update(id, { status: newStatus });
            toast.success(`Seller status updated to ${newStatus}`);
            fetchSellers(); // Refresh
        } catch (error) {
            toast.error('Failed to update status');
        }
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
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-10">Loading sellers...</td></tr>
                        ) : sellers.map((seller) => (
                            <tr key={seller.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                            {seller.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{seller.storeName || seller.name}</div>
                                            <div className="text-sm text-gray-500">{seller.name} ({seller.email})</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${seller.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                                            seller.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {seller.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{(seller.totalSales || 0).toLocaleString()} <br/>
                                    <span className="text-xs text-gray-400">{seller.totalOrders || 0} orders</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400">★</span> 
                                        <span>{seller.averageRating || 'N/A'}</span>
                                        <span className="text-xs text-gray-400">({seller.productCount} prods)</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {seller.role !== 'admin' && (
                                        <>
                                            {(seller.status.toLowerCase() === 'pending' || seller.status.toLowerCase() === 'suspended') && (
                                                <button
                                                    onClick={() => handleStatusChange(seller.id, 'active')}
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                    title="Approve/Reactivate"
                                                >
                                                    <UserCheck className="w-5 h-5" />
                                                </button>
                                            )}
                                            {seller.status.toLowerCase() === 'active' && (
                                                <button
                                                    onClick={() => handleStatusChange(seller.id, 'suspended')}
                                                    className="text-red-600 hover:text-red-900 mr-4"
                                                    title="Suspend"
                                                >
                                                    <UserX className="w-5 h-5" />
                                                </button>
                                            )}
                                        </>
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
