import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white animate-fade-in ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LogiMart</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg 
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email
                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
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
            <label className="block text-sm font-semibold text-black-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-black-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg 
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-2 transition-all duration-300 ${errors.password
                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Social Login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => showToast('Google login not yet configured')}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Facebook login not yet configured')}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <span>Facebook</span>
            </button>
          </div> */}

          {/* Sign Up Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </a>
          </p>

          {/* Demo Credentials Helper */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Customer:</strong> customer@example.com / customer123</p>
              <p><strong>Admin:</strong> admin@logimart.com / admin123</p>
              <p><strong>Seller:</strong> seller@techstore.com / seller123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;