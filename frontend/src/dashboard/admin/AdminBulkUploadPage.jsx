import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import BulkProductUpload from '../../components/common/BulkProductUpload';

const AdminBulkUploadPage = () => {
    const navigate = useNavigate();
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleUploadSuccess = () => {
        setUploadSuccess(true);
        setTimeout(() => {
            navigate('/admin/products');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-3">
                            <Upload className="text-cyan-400" size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Bulk Product Upload</h1>
                            <p className="text-slate-400 mt-1">
                                Upload multiple products at once using JSON, CSV, Excel, or ZIP files
                            </p>
                        </div>
                    </div>
                </div>

                {uploadSuccess && (
                    <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-8 text-green-400">
                        ✓ Products uploaded successfully! Redirecting...
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
                    <BulkProductUpload onSuccess={handleUploadSuccess} />
                </div>

                {/* Sample Files Section */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm my-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Download className="text-cyan-400" size={24} />
                        Download Sample Files
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href="/sample-products.json"
                            download
                            className="bg-cyan-500/20 border border-cyan-500/50 hover:bg-cyan-500/30 rounded-lg p-4 flex items-center gap-4 transition-colors"
                        >
                            <div className="bg-cyan-500/30 p-3 rounded-lg">
                                <Download className="text-cyan-400" size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Sample JSON</p>
                                <p className="text-sm text-slate-400">5 products example</p>
                            </div>
                        </a>
                        <a
                            href="/sample-products.csv"
                            download
                            className="bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 rounded-lg p-4 flex items-center gap-4 transition-colors"
                        >
                            <div className="bg-emerald-500/30 p-3 rounded-lg">
                                <Download className="text-emerald-400" size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Sample CSV</p>
                                <p className="text-sm text-slate-400">10 products example</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Guide Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">📋 Required Fields</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>name</strong> - Product name</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>description</strong> - Product description</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>price</strong> - Selling price (number)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>stock_quantity</strong> - Available stock (number)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>category</strong> - Product category</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">✨ Optional Fields</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>originalPrice</strong> - Original/MRP price</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>discount</strong> - Discount percentage (0-100)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>images</strong> - Image URLs (separated by |)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>brand</strong> - Brand name</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span><strong>sku</strong> - Stock keeping unit</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">📁 Valid Categories</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'Electronics',
                                'Clothing',
                                'Sports',
                                'Smartphones',
                                'Laptops',
                                'Headphones',
                                'Tablets',
                                'Accessories',
                                'Cameras',
                                'Gaming',
                                'Wearables',
                                'Other'
                            ].map((cat) => (
                                <div key={cat} className="text-cyan-400 text-sm">
                                    • {cat}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">💡 Tips & Best Practices</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li>✓ Max file size: 10MB</li>
                            <li>✓ For CSV, use comma separators</li>
                            <li>✓ For images in CSV, separate URLs with pipe (|)</li>
                            <li>✓ ZIP files can contain multiple data files</li>
                            <li>✓ Invalid rows won't be inserted</li>
                            <li>✓ Download error report to fix issues</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBulkUploadPage;
