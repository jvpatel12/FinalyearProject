import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from './useAuth';

/**
 * Signup Page Component
 * User registration with validation
 */
const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // Use register from AuthContext

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // Default role
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.length < 2) newErrors.fullName = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!passwordRegex.test(formData.password)) newErrors.password = 'Password must contain uppercase, lowercase, and number';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    return newErrors;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Call register from AuthContext
    const result = await register({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (result.success) {
      showToast('Account created successfully! Redirecting...', 'success');
      setTimeout(() => {
        // Redirect based on role
        if (formData.role === 'seller') navigate('/seller');
        else navigate('/customer');
      }, 1500);
    } else {
      showToast(result.message, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glowing effects */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Toast Notification */}
      {toast.show && (
         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium animate-fade-in shadow-[0_0_20px_rgba(0,0,0,0.5)] border ${toast.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
          }`}>
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
           <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-cyan-400/20">
              <span className="text-white font-bold text-3xl tracking-tighter">L</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">LogiMart</h1>
          <p className="text-slate-400 font-light text-sm">Create your clearance profile</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 space-y-6">

          {/* Account Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-3">
              Requesting profile class:
            </label>
            <div className="grid grid-cols-2 gap-4">
               <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 ${formData.role === 'customer'
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'border-slate-700/50 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}>
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === 'customer'}
                  onChange={handleChange}
                  className="hidden"
                />
                <User size={24} className="mb-2" />
                <span className="font-semibold text-sm">Consumer</span>
              </label>

              <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 ${formData.role === 'seller'
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'border-slate-700/50 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={formData.role === 'seller'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="mb-2 text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">🛍️</span>
                <span className="font-semibold text-sm">Merchant</span>
              </label>
            </div>
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
              Designation
            </label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-600 outline-none transition-all duration-300 font-mono text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${errors.fullName
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 bg-red-500/5 text-red-400'
                  : 'border-slate-700/50 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50'
                  }`}
              />
              {errors.fullName && (
                <AlertCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
              )}
            </div>
            {errors.fullName && <p className="text-red-400 text-xs mt-2 font-medium">{errors.fullName}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
              Data Routing Address
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-12 pr-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-600 outline-none transition-all duration-300 font-mono text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${errors.email
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 bg-red-500/5 text-red-400'
                  : 'border-slate-700/50 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50'
                  }`}
              />
              {errors.email && (
                <AlertCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
              )}
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-2 font-medium">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
              Encryption Key
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-600 outline-none transition-all duration-300 font-mono text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${errors.password
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 bg-red-500/5 text-red-400'
                  : 'border-slate-700/50 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-2 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
              Verify Key
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-600 outline-none transition-all duration-300 font-mono text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] ${errors.confirmPassword
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 bg-red-500/5 text-red-400'
                  : 'border-slate-700/50 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-2 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="peer appearance-none w-4 h-4 rounded border border-slate-600 bg-slate-900/50 checked:bg-cyan-500/20 checked:border-cyan-500 cursor-pointer transition-all"
                />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 leading-snug">
                I agree to the{' '}
                <a href="/terms" className="text-cyan-500 hover:text-cyan-400 font-medium hover:underline transition-colors">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-cyan-500 hover:text-cyan-400 font-medium hover:underline transition-colors">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.termsAccepted && <p className="text-red-400 text-xs mt-2 font-medium">{errors.termsAccepted}</p>}
          </div>

          {/* Sign Up Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold border-none shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all rounded-xl py-3.5"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Initializing...' : 'Initialize Clearance'}
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-slate-400 text-sm">
            Already verified?{' '}
            <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors">
              Access portal
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;