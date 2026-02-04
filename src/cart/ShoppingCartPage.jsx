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
    totalPrice,
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

  // Calculate totals
  const subtotal = totalPrice;
  const discount = promoApplied
    ? subtotal * promoCodes[Object.keys(promoCodes)[0]]
    : 0;
  const tax = (subtotal - discount) * 0.08;
  const shipping = subtotal > 5000 ? 0 : 99; // Free shipping over ₹5000
  const total = subtotal - discount + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart size={40} className="text-blue-600" />
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in cart</p>
        </div>

        {/* Main Content */}
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items yet
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2">
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl p-6 mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Have a promo code?
                    </h3>
                    <p className="text-sm opacity-90">
                      Try SAVE10, SAVE20, or WELCOME5
                    </p>
                  </div>
                  <Tag size={32} className="opacity-50" />
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-b-0 p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.brand}
                        </p>
                        <div className="text-sm text-gray-600">
                          {item.color && <p>Color: {item.color}</p>}
                          {item.size && <p>Size: {item.size}</p>}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-green-700 text-sm">
                          <CheckCircle size={16} />
                          In Stock
                        </div>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex flex-col items-end gap-4">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>

                        {/* Quantity Control */}
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1.5 font-semibold text-gray-900 border-l border-r border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              {/* Promo Code Input */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Promo Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoApplied}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {promoApplied ? "✓" : "Apply"}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    Discount applied!
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-4">
                <h3 className="font-bold text-gray-900 text-lg mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6 border-b border-gray-200 pb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount (10%)</span>
                      <span className="font-medium">
                        -₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Tax (8%)</span>
                    <span className="font-medium">₹{tax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <div className="flex items-center gap-2">
                      <Truck size={18} />
                      Shipping
                    </div>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600 text-2xl">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                {/* Free Shipping Notice */}
                {subtotal <= 5000 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-800">
                    <p className="font-semibold mb-1">
                      Free shipping available!
                    </p>
                    <p>
                      Add ₹{(5000 - subtotal).toLocaleString()} more to your
                      order
                    </p>
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
                        "Please login to proceed with checkout",
                        "error",
                      );
                    }
                  }}
                  className="w-full mb-3 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-bold text-gray-900 mb-4">
                  We're here to help
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3 items-start">
                    <CheckCircle
                      size={20}
                      className="text-green-600 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-gray-700">30-day returns on all items</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle
                      size={20}
                      className="text-green-600 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-gray-700">Secure 256-bit encryption</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle
                      size={20}
                      className="text-green-600 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-gray-700">24/7 customer support</p>
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