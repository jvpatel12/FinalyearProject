import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer Component
 * Complete footer with links, contact info, and social media
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refund' },
    ],
    Shop: [
      { label: 'Electronics', href: '/shop' },
      { label: 'Deals', href: '/deals' },
      { label: 'New Arrivals', href: '/new' },
      { label: 'Best Sellers', href: '/bestsellers' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2364B5F6%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand & About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-white gradient-text">LogiMart</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Your trusted online marketplace for quality electronics and fast, secure delivery across the globe.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 p-2 hover:bg-white/10 rounded-lg"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4 text-lg">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800/50 mt-12 pt-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-3 group">
              <Mail size={20} className="text-blue-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <a href="mailto:jeel@logimart.com" className="text-white hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  jeel@logimart.com
                </a>
              </div>
            </div>

            <div className="flex gap-3 group">
              <Phone size={20} className="text-blue-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Phone</p>
                <a href="tel:+91972638****" className="text-white hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  +91 972638****
                </a>
              </div>
            </div>

            <div className="flex gap-3 group">
              <MapPin size={20} className="text-blue-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Address</p>
                <p className="text-white hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Guj, India 384151
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800/50 border-t border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p className="mb-2 sm:mb-0">© {currentYear} <span className="gradient-text font-semibold">LogiMart</span>. All rights reserved.</p>
            <p className="text-center sm:text-right">Made with <span className="text-red-400 animate-pulse">❤️</span> for online shoppers worldwide</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;