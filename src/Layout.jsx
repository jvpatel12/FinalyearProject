import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './common/Navbar';
import Footer from './common/Footer';

/**
 * Layout Component
 * Main layout wrapper for all pages with navigation and footer
 * Handles authentication state and navigation
 * Enhanced with modern design elements and smooth transitions
 */
function Layout() {

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Product filtering will be handled by Shop page
  };

  const handleLogout = () => {
    console.log('User logged out successfully');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-main">
      {/* Background Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none opacity-20"></div>

      {/* Navigation Bar with enhanced styling */}
      <div className="relative z-50">
        <NavBar
          onSearch={handleSearch}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content with enhanced container */}
      <main className="flex-1 w-full relative z-10 pt-20">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Footer with enhanced styling */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
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
