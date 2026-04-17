import { toast } from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import { useCart } from './CartContext';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Shield, ArrowLeft, CreditCard, Truck, CheckCircle, ChevronRight, MapPin, Receipt, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../common/Breadcrumbs';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items: cartItems, clearCart, subtotal, tax, shipping, grandTotal } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment & Coupon, 3: Review
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

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await apiService.addresses.getAll();
        setAddresses(data);
        const defaultAddr = data.find(a => a.isDefault);
        if (defaultAddr) {
          handleAddressSelect(defaultAddr);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };
    if (user) fetchAddresses();
  }, [user]);

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr._id || addr.id);
    setFormData(prev => ({
      ...prev,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode || addr.zip,
      phone: addr.phone
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const data = await apiService.coupons.validate({ code: couponCode, orderAmount: subtotal });
      setAppliedCoupon(data);
      toast.success(`Coupon Applied: ${data.discountType === 'percentage' ? data.discountAmount + '%' : '₹' + data.discountAmount} off!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const finalTotal = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' 
        ? grandTotal - (subtotal * appliedCoupon.discountAmount / 100)
        : grandTotal - appliedCoupon.discountAmount)
    : grandTotal;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        userId: user?.id || user?.userId,
        userName: `${formData.firstName} ${formData.lastName}`,
        userEmail: formData.email,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          sellerId: item.sellerId || 1
        })),
        totalPrice: finalTotal,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: formData.state || 'IN',
        },
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon?.code
      };

      const resData = await apiService.orders.placeOrder(orderData);
      const createdOrder = resData.order || resData;
      const orderId = createdOrder._id || createdOrder.id;

      if (formData.paymentMethod === 'cod') {
        toast.success('Order placed successfully (Cash on Delivery)!');
        clearCart();
        navigate('/orders');
        return;
      }

      // Razorpay implementation...
      toast.loading('Initializing Payment Securely...', { id: 'checkout' });
      const scriptRes = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!scriptRes) {
        toast.error('Razorpay SDK failed to load.', { id: 'checkout' });
        setIsProcessing(false);
        return;
      }

      const rpOrder = await apiService.orders.createRazorpayOrder(orderId);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: "CyberStore",
        description: `Order #${orderId}`,
        order_id: rpOrder.id,
        handler: async function (response) {
          try {
            toast.loading('Verifying Payment...', { id: 'checkout' });
            await apiService.orders.verifyRazorpayPayment(orderId, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            toast.success('Payment Verified!', { id: 'checkout' });
            clearCart();
            setTimeout(() => navigate('/orders'), 2000);
          } catch (err) {
            toast.error('Verification Failed!', { id: 'checkout' });
            navigate('/orders');
          }
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#06b6d4" },
        modal: { ondismiss: () => setIsProcessing(false) }
      };

      const paymentObject = new window.Razorpay(options);
      toast.dismiss('checkout');
      paymentObject.open();

    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order.');
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto overflow-hidden">
      {[
        { step: 1, label: 'Shipping', icon: Truck },
        { step: 2, label: 'Payment', icon: CreditCard },
        { step: 3, label: 'Review', icon: CheckCircle }
      ].map((s, idx) => (
        <div key={s.step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
              currentStep === s.step ? 'bg-cyan-500 border-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 
              currentStep > s.step ? 'bg-slate-800 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}>
              <s.icon size={20} />
            </div>
            <span className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-widest ${
              currentStep === s.step ? 'text-cyan-400' : 'text-slate-500'
            }`}>{s.label}</span>
          </div>
          {idx < 2 && (
            <div className={`h-0.5 flex-1 mx-4 transition-all duration-700 ${
              currentStep > s.step ? 'bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-slate-800'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center bg-slate-800/20 backdrop-blur-md p-12 rounded-3xl border border-slate-700/50 shadow-2xl">
          <Shield className="w-20 h-20 text-slate-600 mx-auto mb-8" />
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Your Cart is Empty</h2>
          <p className="text-slate-400 mb-10 max-w-sm mx-auto">Initializing checkout protocol requires at least one active payload. Return to the shop to continue.</p>
          <button onClick={() => navigate('/shop')} className="w-full bg-cyan-500 text-slate-900 font-black py-4 rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase tracking-widest">Back to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 relative px-4">
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto py-8 relative z-10">
        <Breadcrumbs />
        
        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key="step1"
                  className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
                    Shipping Logistics
                  </h2>

                  {/* Saved Addresses */}
                  {addresses.length > 0 && (
                    <div className="mb-10 space-y-4">
                      <label className="text-xs font-bold text-cyan-500 uppercase tracking-widest block mb-4">Select Uplink Node</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                          <div 
                            key={addr._id} 
                            onClick={() => handleAddressSelect(addr)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              selectedAddressId === addr._id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-white text-sm">{addr.name}</h4>
                                <p className="text-xs text-slate-400 mt-1 font-mono">{addr.street}, {addr.city}</p>
                              </div>
                              {selectedAddressId === addr._id && <CheckCircle size={16} className="text-cyan-400" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="checkout-input" />
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="checkout-input" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Vector" className="checkout-input" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Comms Link (Phone)" className="checkout-input" />
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street / Sector" className="checkout-input" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Node Hub (City)" className="checkout-input" />
                      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="Neural Code (ZIP)" className="checkout-input" />
                    </div>
                    <button type="button" onClick={() => setCurrentStep(2)} className="w-full primary-btn mt-6">Secure Comms & Continue <ChevronRight size={18} className="ml-2" /></button>
                  </form>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key="step2"
                  className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
                    Payment Authentication
                  </h2>

                  <div className="space-y-4 mb-10">
                    <label className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
                      <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="hidden" />
                      <CreditCard className="mr-4 text-cyan-400" />
                      <span className="font-bold text-white">Encrypted Credit/Debit Card</span>
                    </label>
                    <label className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="hidden" />
                      <Truck className="mr-4 text-cyan-400" />
                      <span className="font-bold text-white">Tactical Cash on Delivery</span>
                    </label>
                  </div>

                  {/* Coupon Component */}
                  <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-4 text-cyan-400">
                      <Gift size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-widest">Apply Discount Voucher</h3>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="ENTER CODE..."
                        className="flex-1 checkout-input"
                      />
                      <button 
                        onClick={validateCoupon}
                        disabled={isValidatingCoupon || !couponCode}
                        className="bg-slate-700 px-6 rounded-lg text-white font-bold hover:bg-slate-600 disabled:opacity-50 transition-colors"
                      >
                        {isValidatingCoupon ? 'Validating...' : 'Apply'}
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="mt-3 flex items-center justify-between bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/30">
                        <span className="text-xs font-mono text-cyan-400 tracking-tighter">SUCCESS: {appliedCoupon.code} ACTIVATED!</span>
                        <button onClick={() => setAppliedCoupon(null)} className="text-xs text-red-400 underline">Remove</button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-10">
                    <button onClick={() => setCurrentStep(1)} className="secondary-btn flex items-center justify-center"><ArrowLeft size={18} className="mr-2" /> Logistics</button>
                    <button onClick={() => setCurrentStep(3)} className="primary-btn">Review Order <ChevronRight size={18} className="ml-2" /></button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key="step3"
                  className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
                    Final Protocol Review
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <MapPin size={14} /> Shipping Node
                      </h3>
                      <p className="text-white font-bold">{formData.firstName} {formData.lastName}</p>
                      <p className="text-slate-400 text-sm mt-1">{formData.address}</p>
                      <p className="text-slate-400 text-sm">{formData.city}, {formData.zipCode}</p>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Receipt size={14} /> Payment Method
                      </h3>
                      <p className="text-white font-bold uppercase tracking-widest">{formData.paymentMethod === 'card' ? 'Encrypted Terminal' : 'Cash Extraction'}</p>
                      <p className="text-slate-400 text-sm mt-1">Status: Pending Verification</p>
                    </div>
                  </div>

                  <div className="mt-10 p-6 border-t border-slate-700/50">
                    <div className="flex items-start gap-4 text-slate-400 text-xs">
                      <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400"><Shield size={16} /></div>
                      <p>By initializing this protocol, you agree to our 256-bit encrypted transaction terms and verify the payload destinations listed above.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-10">
                    <button onClick={() => setCurrentStep(2)} className="secondary-btn flex items-center justify-center"><ArrowLeft size={18} className="mr-2" /> Alter Method</button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={isProcessing}
                      className="primary-btn relative overflow-hidden group"
                    >
                      {isProcessing ? 'SYNCHRONIZING...' : 'PLACE ORDER'}
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkout Summary - Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 sticky top-24 shadow-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <span className="w-1 h-3 bg-cyan-500"></span> PAYLOAD SUMMARY
              </h3>

              <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-2 rounded-xl bg-slate-800/20 border border-slate-800">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-slate-900 rounded-lg p-1 border border-slate-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">QTY: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 font-mono text-xs border-t border-slate-700/50 pt-6">
                <div className="flex justify-between text-slate-400 uppercase">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 uppercase">
                  <span>Tax (15%)</span>
                  <span className="text-white">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 uppercase">
                  <span>Shipping</span>
                  <span className="text-white">₹{shipping.toLocaleString()}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-cyan-400 font-bold uppercase animate-pulse">
                    <span>Discount [ {appliedCoupon.code} ]</span>
                    <span>-₹{(appliedCoupon.discountType === 'percentage' ? (subtotal * appliedCoupon.discountAmount / 100) : appliedCoupon.discountAmount).toLocaleString()}</span>
                  </div>
                )}

                <div className="h-px bg-slate-700 my-4 shadow-[0_0_10px_rgba(6,182,212,0.2)]"></div>
                
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-white uppercase tracking-widest">Grand Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-cyan-400 tracking-tighter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">₹{finalTotal.toLocaleString()}</p>
                    <p className="text-[8px] text-slate-600 uppercase mt-1">Verified Encrypted Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(226, 232, 240, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          transition: all 0.3s ease;
        }
        .checkout-input:focus {
          outline: none;
          border-color: rgba(6, 182, 212, 0.5);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
          background: rgba(15, 23, 42, 0.8);
        }
        .primary-btn {
          background: #06b6d4;
          color: #0f172a;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 16px;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-size: 14px;
        }
        .primary-btn:hover {
          background: #22d3ee;
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);
          transform: translateY(-2px);
        }
        .secondary-btn {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(226, 232, 240, 0.1);
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 16px;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        .secondary-btn:hover {
          background: rgba(30, 41, 59, 0.8);
          color: white;
          border-color: rgba(148, 163, 184, 0.4);
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;

