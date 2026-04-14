import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './common/Navbar';
import Footer from './common/Footer';
import { useAuth } from './auth/useAuth';
import socket from './utils/socket';
import { toast } from 'react-hot-toast';

/**
 * Layout Component
 * Main layout wrapper for all pages with navigation and footer
 * Handles authentication state and navigation
 * Enhanced with modern design elements and smooth transitions
 */
function Layout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      // Connect socket if not connected
      if (!socket.connected) {
        socket.connect();
      }

      // Join user-specific room for notifications
      socket.emit('joinRoom', `user_${user.id}`);

      // Listen for order status updates
      socket.on('orderStatusUpdated', (data) => {
        toast.success(`Order #${data.orderId.substring(data.orderId.length - 8).toUpperCase()} is now ${data.status.toUpperCase()}!`, {
          duration: 6000,
          icon: '📦',
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #1e293b'
          },
        });
      });

      return () => {
        socket.off('orderStatusUpdated');
        socket.emit('leaveRoom', `user_${user.id}`);
      };
    } else {
      // Disconnect if user logs out
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [user]);

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Product filtering will be handled by Shop page
  };

  const handleLogout = () => {
    console.log('User logged out successfully');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-main custom-scrollbar">
      {/* Background Pattern Overlay - Subtle dot grid for tech vibe */}
      <div className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavBar
          onSearch={handleSearch}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full relative z-10 pt-20">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-cyan-600/80 hover:bg-cyan-500 text-white p-3 rounded-full border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transform hover:scale-110 transition-all duration-300 z-40 backdrop-blur-sm"
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}

export default Layout;
