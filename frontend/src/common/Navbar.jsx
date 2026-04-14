import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext";

import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  Search,
  User,
  LogOut,
  Package,
  Settings,
  LayoutDashboard
} from "lucide-react";

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch && onSearch(searchQuery);
      navigate("/shop");
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    setShowProfileMenu(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Deals", path: "/deals" },
    { name: "New Arrivals", path: "/new" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
        ? "bg-slate-900/80 backdrop-blur-xl border-slate-700 border-b-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2"
        : "bg-transparent border-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.4)] overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-xl relative z-10">L</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span
              className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? "text-white" : "text-white"
                }`}
            >
              Logi<span className="text-cyan-400 group-hover:text-glow transition-all">Mart</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-sm shadow-cyan-500/5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${scrolled
                  ? "text-slate-300 hover:text-cyan-400 hover:bg-white/10"
                  : "text-white/90 hover:text-cyan-300 hover:bg-white/10 hover:text-glow"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${scrolled
                ? "text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
                : "text-white/80 hover:text-cyan-300 hover:bg-white/10 hover:text-glow"
                }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`p-2 rounded-full relative transition-all duration-300 hover:scale-110 ${scrolled
                ? "text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
                : "text-white/80 hover:text-cyan-300 hover:bg-white/10 hover:text-glow"
                }`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-cyan-500 text-slate-900 border border-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse-slow">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className={`p-2 rounded-full relative transition-all duration-300 hover:scale-110 ${scrolled
                ? "text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
                : "text-white/80 hover:text-cyan-300 hover:bg-white/10 hover:text-glow"
                }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-cyan-500 text-slate-900 border border-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse-slow">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative group">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border transition-all duration-300 ${scrolled
                    ? "border-slate-700 bg-slate-800 hover:border-cyan-500/50"
                    : "border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
                    }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium mr-2 max-w-[80px] truncate ${scrolled ? "text-slate-200" : "text-white"
                      }`}
                  >
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 glass-dark rounded-2xl py-2 overflow-hidden z-50 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/50">
                      <p className="text-sm text-white font-bold truncate">{user.name || "User"}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-xl transition-all"
                      >
                        <Package className="w-4 h-4" /> Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-xl transition-all"
                      >
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded-xl transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      {user.role === "seller" && (
                        <Link
                          to="/seller"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 rounded-xl transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-700/50 my-1 mx-2" />

                    <div className="p-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button
                  className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105 ${scrolled
                    ? "bg-cyan-600 text-white hover:bg-cyan-500"
                    : "bg-white/10 backdrop-blur-sm text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-white"
                    }`}
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-white hover:bg-slate-800" : "text-white hover:bg-white/10"
              }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar Overlay */}
        <div
          className={`absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 origin-top ${showSearch ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
            }`}
        >
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg shadow-inner"
                autoFocus={showSearch}
              />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-2xl md:hidden transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full pt-28 px-6 pb-6 overflow-y-auto">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-2xl font-bold text-white hover:text-cyan-400 hover:pl-2 py-4 border-b border-slate-800 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearchSubmit(e); setIsOpen(false); }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </form>

            {user ? (
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <User className="w-6 h-6 text-cyan-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{user.name}</p>
                    <p className="text-sm text-cyan-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 font-medium hover:border-cyan-500 hover:text-cyan-400 transition-colors">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 font-medium hover:border-cyan-500 hover:text-cyan-400 transition-colors">
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                  <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 font-medium hover:border-cyan-500 hover:text-cyan-400 transition-colors">
                    <Package className="w-4 h-4" /> Orders
                  </Link>
                  <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 font-medium hover:border-cyan-500 hover:text-cyan-400 transition-colors">
                    <ShoppingCart className="w-4 h-4" /> Cart ({cartItems.length})
                  </Link>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-900/30 text-red-500 border border-red-900/50 font-bold rounded-xl hover:bg-red-900/50 transition-colors mt-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="w-full py-4 bg-cyan-600 text-slate-900 text-lg font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-500 transform hover:scale-[1.02] transition-all">
                  Log In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;