import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Edit2, Trash2, CheckCircle } from 'lucide-react';

const AddressManagement = ({ onSelectAddress, selectedAddressId, selectable = false }) => {
    const [addresses, setAddresses] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        isDefault: false
    });

    // Load addresses from local storage
    useEffect(() => {
        const savedAddresses = localStorage.getItem('userAddresses');
        if (savedAddresses) {
            setAddresses(JSON.parse(savedAddresses));
        } else {
            // Mock data for demo
            const mockAddresses = [
                { id: 1, name: 'John Doe', street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', zip: '400001', phone: '9876543210', isDefault: true },
                { id: 2, name: 'Office', street: '456 key park', city: 'Pune', state: 'Maharashtra', zip: '411001', phone: '9876543210', isDefault: false }
            ];
            setAddresses(mockAddresses);
            localStorage.setItem('userAddresses', JSON.stringify(mockAddresses));
        }
    }, []);

    // Save addresses to local storage
    useEffect(() => {
        if (addresses.length > 0) {
            localStorage.setItem('userAddresses', JSON.stringify(addresses));
        }
    }, [addresses]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            // Update existing
            setAddresses(prev => prev.map(addr =>
                addr.id === editingId ? { ...formData, id: editingId } : addr
            ));
            setEditingId(null);
        } else {
            // Add new
            const newAddress = {
                ...formData,
                id: Date.now()
            };

            if (newAddress.isDefault) {
                setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddress));
            } else {
                setAddresses(prev => [...prev, newAddress]);
            }
        }

        setIsAdding(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            isDefault: false
        });
    };

    const handleEdit = (address) => {
        setFormData(address);
        setEditingId(address.id);
        setIsAdding(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
        }
    };

    return (
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
                    <MapPin className="w-5 h-5 text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    Coordinate Directory
                </h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                    >
                        <Plus className="w-4 h-4" />
                        Add Node
                    </button>
                )}
            </div>

            {isAdding ? (
                <form onSubmit={handleSubmit} className="space-y-5 mb-8 bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-[inset_0_2px_15px_rgba(0,0,0,0.2)]">
                    <h3 className="font-bold text-cyan-500 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        {editingId ? 'Reconfigure Coordinates' : 'Establish New Coordinates'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input
                            type="text"
                            name="name"
                            placeholder="Designation (e.g., Home Base)"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Comms Frequency (Phone)"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm"
                        />
                        <input
                            type="text"
                            name="street"
                            placeholder="Sector / Street Routing"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                            className="col-span-1 md:col-span-2 w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm"
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="Hub / City"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm"
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="Region / State"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm"
                        />
                        <input
                            type="text"
                            name="zip"
                            placeholder="Cipher Code (ZIP)"
                            value={formData.zip}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3 mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 w-fit">
                        <input
                            type="checkbox"
                            name="isDefault"
                            id="isDefault"
                            checked={formData.isDefault}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-cyan-500 rounded border-slate-600 bg-slate-900 focus:ring-cyan-500 focus:ring-offset-slate-900"
                        />
                        <label htmlFor="isDefault" className="text-sm font-semibold text-slate-300 uppercase tracking-wider cursor-pointer">Set as Primary Node</label>
                    </div>
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}
                            className="px-6 py-2.5 text-slate-400 font-semibold hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-cyan-500 text-slate-900 font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2"
                        >
                            <CheckCircle size={18} />
                            Save Profile
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {addresses.map(addr => (
                        <div
                            key={addr.id}
                            className={`rounded-2xl p-6 relative transition-all duration-300 border ${selectable
                                ? (selectedAddressId === addr.id ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30' : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/60 cursor-pointer')
                                : 'border-slate-700/50 bg-slate-900/40'
                                }`}
                            onClick={() => selectable && onSelectAddress && onSelectAddress(addr)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-white text-lg flex items-center gap-3 tracking-tight">
                                        {addr.name}
                                        {addr.isDefault && <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Primary</span>}
                                    </h3>
                                    <div className="mt-3 space-y-1">
                                        <p className="text-sm text-slate-400 font-mono tracking-wide">{addr.street}</p>
                                        <p className="text-sm text-slate-400 font-mono tracking-wide">{addr.city}, {addr.state} {addr.zip}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-4 uppercase tracking-widest flex items-center gap-1.5 border-t border-slate-700/50 pt-3 inline-flex">
                                        <MapPin size={12} className="text-cyan-500" /> COMMS: <span className="text-slate-300 font-mono">{addr.phone}</span>
                                    </p>
                                </div>
                                {selectable && selectedAddressId === addr.id && (
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                        <CheckCircle className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                                    </div>
                                )}
                            </div>

                            {!selectable && (
                                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/50">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                                        className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 bg-slate-800/50 hover:text-cyan-400 py-2.5 rounded-xl hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-cyan-500/30"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" /> Reconfigure
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                                        className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 bg-slate-800/50 hover:text-red-400 py-2.5 rounded-xl hover:bg-red-500/10 transition-all border border-slate-700/50 hover:border-red-500/30"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Terminate
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressManagement;
