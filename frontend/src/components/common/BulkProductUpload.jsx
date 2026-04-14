import React, { useState, useRef } from 'react';
import { Upload, FileJson, FileText, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/apiService';

const BulkProductUpload = ({ onSuccess }) => {
    const [file, setFile] = useState(null);
    const [validationData, setValidationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('upload'); // upload, preview, confirm
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleFileSelect = (selectedFile) => {
        const allowedExtensions = ['.json', '.csv', '.xlsx', '.xls', '.zip'];
        const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            toast.error(`Invalid file format. Allowed: ${allowedExtensions.join(', ')}`);
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
            toast.error('File size must be less than 10MB');
            return;
        }

        setFile(selectedFile);
        setValidationData(null);
    };

    const handleFileInputChange = (e) => {
        if (e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const validateFile = async () => {
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.bulkProducts.validate(file);

            if (response && response.success) {
                setValidationData(response.data);
                setStep('preview');
                toast.success('File validated successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Validation failed');
            console.error('Validation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const insertProducts = async () => {
        if (!validationData || !validationData.validProducts || validationData.validProducts.length === 0) {
            toast.error('No valid products to insert');
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.bulkProducts.insert(validationData.validProducts);

            if (response && response.success) {
                toast.success(`Successfully inserted ${response.data.inserted} products`);
                resetForm();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Insertion failed');
            console.error('Insertion error:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadErrorReport = () => {
        if (!validationData || !validationData.invalidProducts) {
            toast.error('No errors to download');
            return;
        }

        const errorData = validationData.invalidProducts.map(item => ({
            'Row Number': item.rowNumber,
            'Errors': item.errors.join('; '),
            'Product Name': item.product.name || 'N/A'
        }));

        const csv = [
            Object.keys(errorData[0]).join(','),
            ...errorData.map(row => Object.values(row).map(v => `"${v}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bulk-upload-errors.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success('Error report downloaded');
    };

    const resetForm = () => {
        setFile(null);
        setValidationData(null);
        setStep('upload');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Step Indicator */}
            <div className="flex gap-4 mb-8">
                {['upload', 'preview', 'confirm'].map((s, idx) => (
                    <div key={s} className="flex items-center gap-2">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                step === s
                                    ? 'bg-cyan-500 text-white'
                                    : validationData && ['preview', 'confirm'].includes(s)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-700 text-slate-400'
                            }`}
                        >
                            {idx + 1}
                        </div>
                        <span
                            className={`text-sm font-semibold ${
                                step === s ? 'text-cyan-400' : 'text-slate-400'
                            }`}
                        >
                            {s === 'upload' ? 'Upload' : s === 'preview' ? 'Preview' : 'Confirm'}
                        </span>
                        {idx < 2 && <div className="w-8 h-0.5 bg-slate-700 mx-2"></div>}
                    </div>
                ))}
            </div>

            {/* Upload Step */}
            {step === 'upload' && (
                <div className="space-y-4">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                            isDragging
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-slate-700 bg-slate-900/50 hover:border-cyan-500/50'
                        }`}
                    >
                        <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Drag & Drop File Here</h3>
                        <p className="text-slate-400 mb-6">or click to browse</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Select File
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.csv,.xlsx,.xls,.zip"
                            onChange={handleFileInputChange}
                            className="hidden"
                        />
                    </div>

                    {file && (
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">{file.name}</p>
                                    <p className="text-sm text-slate-400">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-slate-400 hover:text-red-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <button
                                onClick={validateFile}
                                disabled={loading}
                                className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 text-white py-2 rounded-lg font-semibold transition-colors"
                            >
                                {loading ? 'Validating...' : 'Validate File'}
                            </button>
                        </div>
                    )}

                    {/* File Format Guide */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                            <FileJson size={18} /> Supported Formats
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="text-slate-300">
                                <p className="font-semibold text-cyan-400">JSON</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Array of objects with product fields
                                </p>
                            </div>
                            <div className="text-slate-300">
                                <p className="font-semibold text-cyan-400">CSV</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Comma-separated values with headers
                                </p>
                            </div>
                            <div className="text-slate-300">
                                <p className="font-semibold text-cyan-400">Excel (.xlsx)</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    First row as headers, data rows below
                                </p>
                            </div>
                            <div className="text-slate-300">
                                <p className="font-semibold text-cyan-400">ZIP</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Archive containing JSON/CSV/Excel files
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Step */}
            {step === 'preview' && validationData && (
                <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                            <p className="text-slate-400 text-sm">Total Records</p>
                            <p className="text-3xl font-bold text-white">
                                {validationData.summary.total}
                            </p>
                        </div>
                        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                            <p className="text-green-400 text-sm flex items-center gap-2">
                                <CheckCircle size={16} /> Valid
                            </p>
                            <p className="text-3xl font-bold text-green-400">
                                {validationData.summary.valid}
                            </p>
                        </div>
                        <div
                            className={`${
                                validationData.summary.invalid > 0
                                    ? 'bg-red-900/30 border border-red-700/50'
                                    : 'bg-slate-800/50 border border-slate-700'
                            } rounded-lg p-4`}
                        >
                            <p
                                className={`text-sm flex items-center gap-2 ${
                                    validationData.summary.invalid > 0
                                        ? 'text-red-400'
                                        : 'text-slate-400'
                                }`}
                            >
                                <AlertCircle size={16} /> Invalid
                            </p>
                            <p
                                className={`text-3xl font-bold ${
                                    validationData.summary.invalid > 0
                                        ? 'text-red-400'
                                        : 'text-slate-400'
                                }`}
                            >
                                {validationData.summary.invalid}
                            </p>
                        </div>
                    </div>

                    {/* Valid Records Table */}
                    {validationData.validProducts.length > 0 && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-slate-700">
                                <h4 className="font-semibold text-white flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-400" />
                                    Valid Records ({validationData.validProducts.length})
                                </h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-900 text-slate-300 border-b border-slate-700">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Category</th>
                                            <th className="px-4 py-2 text-right">Price</th>
                                            <th className="px-4 py-2 text-right">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {validationData.validProducts.slice(0, 5).map((product, idx) => (
                                            <tr key={idx} className="hover:bg-slate-700/50">
                                                <td className="px-4 py-2 text-white">{product.name}</td>
                                                <td className="px-4 py-2 text-slate-400">
                                                    {product.category}
                                                </td>
                                                <td className="px-4 py-2 text-right text-white">
                                                    ₹{product.price}
                                                </td>
                                                <td className="px-4 py-2 text-right text-slate-400">
                                                    {product.stock_quantity}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {validationData.validProducts.length > 5 && (
                                <div className="p-4 text-center text-slate-400 text-sm border-t border-slate-700">
                                    +{validationData.validProducts.length - 5} more records
                                </div>
                            )}
                        </div>
                    )}

                    {/* Invalid Records Table */}
                    {validationData.invalidProducts.length > 0 && (
                        <div className="bg-red-900/10 border border-red-700/50 rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-red-700/50">
                                <h4 className="font-semibold text-red-400 flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    Invalid Records ({validationData.invalidProducts.length})
                                </h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-red-900/20 text-red-300 border-b border-red-700/50">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Row</th>
                                            <th className="px-4 py-2 text-left">Product Name</th>
                                            <th className="px-4 py-2 text-left">Errors</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-700/30">
                                        {validationData.invalidProducts.slice(0, 5).map((item, idx) => (
                                            <tr key={idx} className="hover:bg-red-900/20">
                                                <td className="px-4 py-2 text-red-400 font-semibold">
                                                    {item.rowNumber}
                                                </td>
                                                <td className="px-4 py-2 text-slate-300">
                                                    {item.product.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-2 text-red-300 text-xs">
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {item.errors.map((error, i) => (
                                                            <li key={i}>{error}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {validationData.invalidProducts.length > 5 && (
                                <div className="p-4 text-center text-red-400/60 text-sm border-t border-red-700/50">
                                    +{validationData.invalidProducts.length - 5} more errors
                                </div>
                            )}
                            <div className="p-4 border-t border-red-700/50 flex gap-2">
                                <button
                                    onClick={downloadErrorReport}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download size={16} />
                                    Download Error Report
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStep('upload')}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep('confirm')}
                            disabled={validationData.validProducts.length === 0}
                            className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Confirm Step */}
            {step === 'confirm' && validationData && (
                <div className="space-y-4">
                    <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4">
                        <p className="text-cyan-400 font-semibold mb-2">Ready to Insert</p>
                        <p className="text-slate-300">
                            This action will insert {validationData.validProducts.length} valid
                            products into your catalog. This cannot be undone.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setStep('preview')}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={insertProducts}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                    Inserting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Insert All Valid Products
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkProductUpload;
