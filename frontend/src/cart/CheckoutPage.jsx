import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useCart } from './CartContext.jsx';
import { apiService } from '../services/apiService';
import AddressManagement from '../dashboard/customer/AddressManagement';

/**
 * Checkout Page Component
 * Handles order placement with customer details and payment
 */
const CheckoutPage = () => {
  const { user } = useAuth();
  const { items: cartItems, clearCart, subtotal, tax, shipping, grandTotal } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        userId: user?.id || user?.userId, // Handle difference in mock data structure
        userName: `${formData.firstName} ${formData.lastName}`,
        userEmail: formData.email,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          sellerId: item.sellerId || 1 // Default to admin/seller 1 if missing
        })),
        total: grandTotal,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: formData.state || 'IN', // Backend requires country, using state as fallback or default
        },
        paymentMethod: formData.paymentMethod
      };

      await apiService.orders.placeOrder(orderData);

      alert('Order placed successfully!');
      clearCart();
      // Use window.location as force refresh might be good to see new orders, but navigate is better SPA
      // navigate('/orders') is fine if Orders page fetches data on mount
      navigate('/orders');

    } catch (error) {
      console.error('Checkout failed:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center bg-slate-800/20 backdrop-blur-md p-10 rounded-2xl border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <Shield className="w-16 h-16 text-slate-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Your Cart is Empty</h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">You have no items added to your cart. Return to the shop to find your perfect products.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold tracking-widest uppercase text-sm px-8 py-3 rounded-xl hover:bg-cyan-500 hover:text-slate-900 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 relative">
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-slate-400 hover:text-cyan-400 font-semibold tracking-wide uppercase text-xs transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Checkout Form */}
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8">
            <h2 className="text-3xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
              Checkout Details
            </h2>

            {/* Address Selection */}
            <div className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-slate-700/50 shadow-[inset_0_2px_15px_rgba(0,0,0,0.2)]">
              <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-6">Saved Addresses</h3>
              <AddressManagement
                selectable={true}
                onSelectAddress={(addr) => {
                  setFormData(prev => ({
                    ...prev,
                    address: addr.street,
                    city: addr.city,
                    state: addr.state,
                    zipCode: addr.zip,
                    phone: addr.phone
                  }));
                }}
              />
              <div className="flex items-center mt-6">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span className="text-xs text-slate-500 font-mono tracking-widest px-4">OR ENTER NEW ADDRESS</span>
                <div className="h-px bg-slate-700 flex-1"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                  />
                </div>
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4">Shipping Address</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'}`}>
                    <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded-full checked:border-cyan-400 focus:outline-none transition-all cursor-pointer"
                      />
                      <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-cyan-400 scale-0 peer-checked:scale-100 transition-transform pointer-events-none drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div>
                    </div>
                    <CreditCard className={`w-5 h-5 mr-3 ${formData.paymentMethod === 'card' ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className={`font-semibold ${formData.paymentMethod === 'card' ? 'text-white' : 'text-slate-300'}`}>Credit / Debit Card</span>
                  </label>
                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'}`}>
                    <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded-full checked:border-cyan-400 focus:outline-none transition-all cursor-pointer"
                      />
                      <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-cyan-400 scale-0 peer-checked:scale-100 transition-transform pointer-events-none drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div>
                    </div>
                    <Truck className={`w-5 h-5 mr-3 ${formData.paymentMethod === 'cod' ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className={`font-semibold ${formData.paymentMethod === 'cod' ? 'text-white' : 'text-slate-300'}`}>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-cyan-500 text-slate-900 py-4 px-6 rounded-xl hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 border-none transition-all font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center tracking-wide uppercase"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900 mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-3" />
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-6 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
              Order Summary
            </h3>

            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                  <div className="relative w-16 h-16 rounded-lg bg-slate-900 flex items-center justify-center p-2 border border-slate-700/50 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/10 to-transparent"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-cyan-500 font-mono mt-1">QTY: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white tracking-tight">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 mt-8 pt-6 space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-mono">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-400">Shipping</span>
                <span className="text-white font-mono">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-400">Tax (10%)</span>
                <span className="text-white font-mono">₹{tax.toLocaleString()}</span>
              </div>

              <div className="h-px bg-slate-700 shadow-[0_1px_5px_rgba(6,182,212,0.2)] my-4"></div>

              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-white uppercase tracking-widest">Order Total</span>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-extrabold text-cyan-400 tracking-tighter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Includes all fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
