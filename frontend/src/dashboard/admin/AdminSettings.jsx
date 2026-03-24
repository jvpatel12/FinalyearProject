import React, { useState } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        commissionRate: 10,
        taxRate: 18,
        minOrderAmount: 0,
        freeShippingThreshold: 500,
        maintenanceMode: false,
        systemName: 'LogiMart'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would be an API call
        alert('System settings updated successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-gray-700" />
                System Settings
            </h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">

                {/* Financial Settings */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Financial Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Default Commission Rate (%)
                            </label>
                            <input
                                type="number"
                                name="commissionRate"
                                value={settings.commissionRate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Percentage taken from seller sales</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tax Rate (GST %)
                            </label>
                            <input
                                type="number"
                                name="taxRate"
                                value={settings.taxRate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Order Settings */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Order Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Free Shipping Threshold (₹)
                            </label>
                            <input
                                type="number"
                                name="freeShippingThreshold"
                                value={settings.freeShippingThreshold}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Order Amount (₹)
                            </label>
                            <input
                                type="number"
                                name="minOrderAmount"
                                value={settings.minOrderAmount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* System Controls */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">System Controls</h2>
                    <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                        <div className="flex-1">
                            <label className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                Enable Maintenance Mode
                            </label>
                            <p className="text-sm text-gray-600 mt-1">
                                When enabled, only admins can access the site. Customers and sellers will see a maintenance page.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        <Save className="w-5 h-5" />
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
