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
    <footer className="bg-background text-text-muted relative overflow-hidden border-t border-slate-800/50">
      {/* Background Tech Accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand & About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-white tracking-wider group-hover:text-glow transition-all">
                Logi<span className="text-cyan-400">Mart</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Equipping the future, today. Browse our selection of premium futuristic hardware.
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
                    className="text-slate-500 hover:text-cyan-400 transition-colors duration-200 p-2 hover:bg-slate-800/80 rounded-lg border border-transparent hover:border-slate-700"
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
              <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 inline-block relative group text-sm"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Input (Replacing pure contact info to match tech store vibe) */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Newsletter</h3>
            <p className="text-sm text-slate-400 mb-4">Get the latest updates on future tech.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-full" />
              <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-900/50 border-t border-slate-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 tracking-wider">
            <p className="mb-2 sm:mb-0">© {currentYear} <span className="text-cyan-500 font-semibold">CyberStore Technologies</span>. All rights reserved.</p>
            <p className="text-center sm:text-right">Built for the future.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;