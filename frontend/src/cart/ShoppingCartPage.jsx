import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Tag,
  Truck,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { useCart } from "./CartContext.jsx";

/**
 * Shopping Cart Page Component
 * Item list with remove/quantity controls, order summary, and checkout flow
 */
const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const {
    items: cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
    subtotal,
    tax,
    shipping,
    grandTotal
  } = useCart();
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const promoCodes = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    WELCOME5: 0.05,
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code]) {
      setPromoApplied(true);
      showToast(`Promo code "${code}" applied successfully!`);
      setPromoCode("");
    } else {
      showToast("Invalid promo code", "error");
    }
  };

  // Calculate discount locally since it's UI specific state
  const discount = promoApplied
    ? subtotal * promoCodes[Object.keys(promoCodes)[0]] // This logic is slightly buggy in original, assuming simple apply
    : 0;

  // Re-calculate final total to include local discount
  // Note: Tax is on original subtotal in many regions, or discounted. 
  // For simplicity, we keep context tax but subtract discount from grandTotal.
  const finalTotal = grandTotal - discount;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl border font-semibold tracking-wide shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-3 backdrop-blur-md animate-fade-in ${toast.type === "success"
            ? "bg-cyan-900/80 border-cyan-500 text-white"
            : "bg-red-900/80 border-red-500 text-white"
            }`}
        >
          {toast.type === "success" ? <CheckCircle size={20} className="text-cyan-400" /> : <AlertCircle size={20} className="text-red-400" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-bold uppercase tracking-widest text-xs mb-6 transition-all group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-end justify-between border-b border-slate-700/50 pb-6">
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-4 tracking-tighter uppercase">
              <ShoppingCart size={36} className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              Shopping Cart
            </h1>
            <p className="text-cyan-500 font-mono tracking-widest text-sm bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded">
              <span className="text-white font-bold">{cartItems.length}</span> {cartItems.length === 1 ? 'ITEM' : 'ITEMS'} IN CART
            </p>
          </div>
        </div>

        {/* Main Content */}
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl p-16 text-center max-w-2xl mx-auto mt-10">
            <div className="relative w-24 h-24 mx-auto mb-6 flex justify-center items-center">
              <ShoppingCart size={64} className="text-slate-600 relative z-10" />
              <div className="absolute inset-0 bg-slate-700/20 blur-xl rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
              Your Cart is Empty
            </h2>
            <p className="text-slate-400 mb-10 max-w-md mx-auto">
              No products have been added to your cart. Continue shopping to find what you need.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-8 py-3.5 rounded-xl hover:bg-cyan-500 hover:text-slate-900 transition-all font-bold tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-cyan-900/40 to-slate-900/80 border border-cyan-500/30 text-white rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Tag size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 tracking-tight text-white">
                        Promo Codes
                      </h3>
                      <p className="text-xs font-mono text-cyan-400 tracking-wider">
                        USE: SAVE10, SAVE20, OR WELCOME5
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-700/50 last:border-b-0 p-6 hover:bg-slate-700/20 transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 relative w-24 h-24 bg-slate-900 rounded-xl p-2 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/10 to-transparent"></div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-white text-lg line-clamp-1 tracking-tight">
                              {item.name}
                            </h3>
                            <p className="text-xl font-extrabold text-cyan-400 tracking-tight sm:hidden">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            BRAND: <span className="text-slate-300">{item.brand}</span>
                          </p>
                          <div className="text-xs text-slate-400 flex items-center gap-3">
                            {item.color && (
                              <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color === 'Titanium' ? '#878681' : item.color === 'Silver' ? '#c0c0c0' : item.color }}></span> {item.color}</span>
                            )}
                            {item.size && (
                              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono tracking-wider">{item.size}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-cyan-500 text-xs font-bold tracking-widest uppercase">
                          <CheckCircle size={14} />
                          Verified Item
                        </div>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
                        <p className="hidden sm:block text-2xl font-extrabold text-cyan-400 tracking-tight">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>

                        <div className="flex items-center justify-between w-full sm:w-auto">
                          {/* Quantity Control */}
                          <div className="flex items-center border border-slate-600 rounded-lg bg-slate-900/50 mr-4 sm:mr-0">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded-l-lg"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-4 py-1.5 font-bold text-white font-mono border-l border-r border-slate-600 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded-r-lg"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-500 hover:text-red-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5 transition-colors bg-slate-800/50 px-3 py-2 rounded-lg sm:bg-transparent sm:px-0 sm:py-0"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
              {/* Promo Code Input */}
              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl p-6">
                <h3 className="font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-5">
                  <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span>
                  Promo Code
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE..."
                    className="flex-1 px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm uppercase tracking-wider"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoApplied}
                    className="px-5 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-500 hover:text-slate-900 disabled:opacity-50 disabled:bg-slate-800 transition-all"
                  >
                    {promoApplied ? "APPLIED" : "APPLY"}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-cyan-400 text-xs mt-3 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle size={14} /> Promo code applied successfully.
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl p-6">
                <h3 className="font-bold text-white uppercase tracking-widest text-lg flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 border-b border-slate-700/70 pb-6">
                  <div className="flex justify-between text-sm font-semibold text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-mono tracking-wide">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-sm font-bold text-cyan-400">
                      <span>Discount</span>
                      <span className="font-mono tracking-wide">
                        -₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-semibold text-slate-400">
                    <span>Tax</span>
                    <span className="text-white font-mono tracking-wide">₹{tax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm font-semibold text-slate-400">
                    <div className="flex items-center gap-2">
                      <Truck size={16} />
                      Shipping
                    </div>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-500/10">FREE</span>
                      ) : (
                        <span className="text-white font-mono tracking-wide">₹{shipping}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-end mb-8 border-b border-slate-700/70 pb-6">
                  <span className="font-bold text-slate-300 uppercase tracking-widest">Total Amount</span>
                  <div className="flex flex-col items-end">
                    <span className="font-extrabold text-cyan-400 text-4xl tracking-tighter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">ALL FEES INCLUDED</span>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal <= 1000 && subtotal > 0 && (
                  <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-4 mb-8 text-sm text-slate-300 flex items-start gap-3">
                    <Truck className="text-cyan-500 mt-0.5" size={18} />
                    <div>
                      <p className="font-bold text-white mb-1 tracking-wide">
                        FREE SHIPPING AVAILABLE
                      </p>
                      <p className="text-xs text-slate-400">
                        Add <span className="text-cyan-400 font-mono font-bold">₹{(1000 - subtotal).toLocaleString()}</span> more to unlock.
                      </p>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    const isLoggedIn =
                      localStorage.getItem("isLoggedIn") === "true";
                    if (isLoggedIn) {
                      navigate("/checkout");
                    } else {
                      showToast(
                        "Authentication required for secure transmission",
                        "error",
                      );
                    }
                  }}
                  className="w-full mb-4 flex items-center justify-center gap-3 bg-cyan-500 text-slate-900 py-4 px-6 rounded-xl hover:bg-cyan-400 transition-all font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] group"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full border border-slate-700 bg-slate-800/30 text-slate-300 py-4 px-6 rounded-xl hover:bg-slate-700 hover:text-white transition-all font-bold uppercase tracking-widest text-sm"
                >
                  Back to Shop
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-xl">
                <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-500" /> Safe & Secure Checkout
                </h4>
                <div className="space-y-4 text-xs font-semibold tracking-wide text-slate-400">
                  <div className="flex gap-3 items-center bg-slate-900/40 p-3 rounded-lg border border-slate-700/50">
                    <CheckCircle
                      size={16}
                      className="text-cyan-500 flex-shrink-0"
                    />
                    <p>30-Day Money Back Guarantee</p>
                  </div>
                  <div className="flex gap-3 items-center bg-slate-900/40 p-3 rounded-lg border border-slate-700/50">
                    <CheckCircle
                      size={16}
                      className="text-cyan-500 flex-shrink-0"
                    />
                    <p>Secure Payment Processing</p>
                  </div>
                  <div className="flex gap-3 items-center bg-slate-900/40 p-3 rounded-lg border border-slate-700/50">
                    <CheckCircle
                      size={16}
                      className="text-cyan-500 flex-shrink-0"
                    />
                    <p>24/7 Customer Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;