import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Shield, Camera } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import AddressManagement from './AddressManagement';

/**
 * User Profile Page Component
 * Displays and allows editing of user profile information with a premium dark theme
 */
const UserProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-4">
            <span className="w-2 h-10 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></span>
            Profile <span className="text-cyan-400">Command Center</span>
          </h1>
          <p className="mt-2 text-slate-400 font-mono text-sm uppercase tracking-widest">Authorized Access Only // User ID: {user?._id?.slice(-8).toUpperCase()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Personal Data */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shadow-[0_0_30px_rgba(6,182,212,0.3)] group cursor-pointer relative">
                    <div className="w-full h-full rounded-[20px] bg-slate-950 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <User className="w-12 h-12 text-slate-700" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-[20px] transition-opacity">
                      <Camera className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{user?.name || 'Operative'}</h2>
                    <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mt-1">{user?.role || 'Customer'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Personal Identification</h3>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        <Edit size={16} />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Save size={16} />
                        </button>
                        <button onClick={handleCancel} className="text-red-400 hover:text-red-300 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
                        />
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/30 border border-slate-800/50 rounded-xl text-slate-300 group-hover:border-slate-700 transition-colors">
                          <User size={16} className="text-cyan-500/50" />
                          <span className="font-semibold">{user?.name || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Secure Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
                        />
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/30 border border-slate-800/50 rounded-xl text-slate-300 group-hover:border-slate-700 transition-colors">
                          <Mail size={16} className="text-cyan-500/50" />
                          <span className="font-semibold">{user?.email || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Comms Frequency</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
                        />
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/30 border border-slate-800/50 rounded-xl text-slate-300 group-hover:border-slate-700 transition-colors">
                          <Phone size={16} className="text-cyan-500/50" />
                          <span className="font-semibold">{user?.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-start gap-4">
                  <Shield size={20} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Security Status</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">Your profile data is encrypted using SHA-256 protocols and stored on decentralized nodes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Address Management */}
          <div className="lg:col-span-7 h-full">
            <AddressManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;