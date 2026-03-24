import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Menu,
  X,
  LogOut,
  PlusCircle,
  Store,
  Settings
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';

/**
 * Seller Layout Component
 * Layout for seller panel with sidebar navigation
 */
const SellerLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/seller',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'My Products',
      path: '/seller/products',
      icon: Package,
    },
    {
      name: 'Add Product',
      path: '/seller/add-product',
      icon: PlusCircle,
    },
    {
      name: 'Orders',
      path: '/seller/orders',
      icon: ShoppingCart,
    },
    {
      name: 'Earnings',
      path: '/seller/earnings',
      icon: DollarSign,
    },
    {
      name: 'Settings',
      path: '/seller/settings', // Placeholder if not exists
      icon: Settings,
    }
  ];

  const isActive = (path, exact) => {
    if (exact || path === '/seller') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
            <div className="flex items-center space-x-2">
              <Store className="w-8 h-8 text-emerald-400" />
              <span className="text-xl font-bold tracking-wider">Seller Center</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="mb-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main Menu
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${active
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className={`mr-3 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex items-center mb-4">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Seller'}&background=10b981&color=fff`}
                alt="Seller"
                className="w-10 h-10 rounded-full border-2 border-emerald-500 mr-3"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Seller User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'seller@logimart.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-300 hover:bg-red-900/30 hover:text-red-200 rounded-lg transition-colors border border-transparent hover:border-red-900"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (Mobile only) */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <Menu size={24} />
              </button>
              <span className="ml-3 text-lg font-semibold text-gray-900">Seller Panel</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none text-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;