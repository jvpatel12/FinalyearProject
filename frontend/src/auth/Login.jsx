import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from './useAuth';

/**
 * Login Page Component
 * Professional login with email/password authentication, validation, and role-based redirect
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, getRedirectPath } = useAuth();

  const [formData, setFormData] = useState(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    return {
      email: rememberedEmail || '',
      password: '',
      rememberMe: !!rememberedEmail,
    };
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const redirectPath = location.state?.from?.pathname || getRedirectPath();
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location, getRedirectPath]);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
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

    // Use AuthContext login function
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Save remembered email if checked
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      showToast('Login successful! Redirecting...', 'success');

      // Redirect based on role after short delay
      setTimeout(() => {
        const user = result.user;
        let defaultPath = '/';

        if (user?.role === 'admin') defaultPath = '/admin';
        else if (user?.role === 'seller') defaultPath = '/seller';
        else if (user?.role === 'customer') defaultPath = '/customer';

        const redirectPath = location.state?.from?.pathname || defaultPath;
        navigate(redirectPath, { replace: true });
      }, 1000);
    } else {
      showToast(result.message || 'Invalid email or password', 'error');
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

      <div className="w-full max-w-sm relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-cyan-400/20">
              <span className="text-white font-bold text-3xl tracking-tighter">L</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">LogiMart</h1>
          <p className="text-slate-400 font-light text-sm">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
              Email Address
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
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
              Password
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="peer appearance-none w-4 h-4 rounded border border-slate-600 bg-slate-900/50 checked:bg-cyan-500/20 checked:border-cyan-500 cursor-pointer transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-xs text-cyan-500 hover:text-cyan-400 hover:underline font-medium transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold border-none shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all rounded-xl py-3.5"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#0f172a] text-slate-500 font-medium tracking-wide uppercase">or connection</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-400 text-sm">
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors">
              no account? sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;