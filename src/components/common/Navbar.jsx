import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, ShoppingBag, User, LogOut, Search, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ role = "landing" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Hero detection
      if (scrollY > 100) {
        setIsHero(false);
      } else {
        setIsHero(true);
      }

      // Hide/Show on scroll logic
      if (scrollY > lastScrollY && scrollY > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (role !== 'landing') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setIsOpen(false);
  };

  const navLinks = {
    landing: [
      { name: 'Categories', action: () => scrollToSection('categories') },
      { name: 'How it Works', action: () => scrollToSection('how-it-works') },
      { name: 'About', action: () => scrollToSection('about') },
    ],
    customer: [
      { name: 'Dashboard', to: '/customer' },
      { name: 'Orders', to: '/customer/orders' },
      { name: 'Cart', to: '/customer/cart' },
    ],
    vendor: [
      { name: 'Stats', to: '/vendor' },
      { name: 'Orders', to: '/vendor/orders' },
      { name: 'Shop Menu', to: '/vendor' },
    ]
  };

  const currentLinks = navLinks[role] || navLinks.landing;

  return (
    <nav 
      className={`fixed top-4 z-50 w-full flex justify-center px-4 md:px-0 transition-all duration-700 ease-in-out ${
        isHidden ? '-translate-y-[150%]' : 'translate-y-0'
      }`}
    >
      <div className={`relative flex items-center justify-between w-full max-w-7xl px-8 md:px-12 py-4 rounded-[40px] transition-all duration-500 border border-white/20 shadow-2xl ${
        isHero && role === 'landing' 
          ? 'bg-transparent border-transparent shadow-none' 
          : 'bg-white/80 backdrop-blur-2xl'
      }`}>
        
        {/* Left Side: Navigation Links */}
        <div className="hidden md:flex items-center gap-10 flex-1">
          {currentLinks.map((link, idx) => (
            <div key={idx} className="relative group">
              {link.action ? (
                <button 
                  onClick={link.action}
                  className="text-gray-900 hover:text-[#1A6950] transition-colors font-black text-[11px] uppercase tracking-[0.2em]"
                >
                  {link.name}
                </button>
              ) : (
                <Link 
                  to={link.to} 
                  className="text-gray-900 hover:text-[#1A6950] transition-colors font-black text-[11px] uppercase tracking-[0.2em]"
                >
                  {link.name}
                </Link>
              )}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CDF546] transition-all group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Center: Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 group"
        >
          <div className="w-12 h-12 bg-[#1A6950] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
            <span className="text-[#CDF546] font-black text-2xl">V</span>
          </div>
          <span className={`text-2xl md:text-3xl font-heading font-black tracking-tighter uppercase transition-colors ${
            isHero && role === 'landing' ? 'text-gray-900' : 'text-gray-900'
          }`}>
            Vendorify
          </span>
        </Link>

        {/* Right Side: Actions */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
          {role === 'landing' ? (
            <>
              <Link 
                to="/login/customer" 
                className="text-gray-900 hover:text-[#1A6950] transition-colors font-black text-[11px] uppercase tracking-[0.2em]"
              >
                Sign in
              </Link>
              <button 
                onClick={() => navigate('/login/vendor')}
                className="bg-[#1A6950] hover:bg-[#145a44] text-white px-8 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-[#1A6950]/20 active:scale-95 flex items-center gap-2"
              >
                Join as Vendor
                <ArrowRight size={16} className="text-[#CDF546]" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button className="p-3 text-gray-400 hover:text-[#1A6950] transition-colors">
                <Bell size={20} />
              </button>
              <button 
                onClick={logout}
                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center gap-2"
              >
                Log Out
                <LogOut size={16} className="text-[#CDF546]" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`md:hidden p-3 rounded-2xl transition-colors ${
            isHero && role === 'landing' ? 'bg-white/10 text-gray-900' : 'bg-gray-100 text-gray-900'
          }`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-[calc(100%+16px)] left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-2xl p-10 border border-gray-100 md:hidden flex flex-col gap-8 z-50"
          >
            <div className="space-y-6">
              {currentLinks.map((link, idx) => (
                <div key={idx}>
                  {link.action ? (
                    <button 
                      onClick={link.action}
                      className="text-left w-full text-gray-900 font-black text-xl uppercase tracking-tight py-2 border-b border-gray-50 flex justify-between items-center group"
                    >
                      {link.name}
                      <ArrowRight size={20} className="text-[#CDF546] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ) : (
                    <Link 
                      to={link.to} 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-900 font-black text-xl uppercase tracking-tight py-2 border-b border-gray-50 block flex justify-between items-center group"
                    >
                      {link.name}
                      <ArrowRight size={20} className="text-[#CDF546] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            <div className="pt-4 space-y-4">
              {role === 'landing' ? (
                <>
                  <Link 
                    to="/login/customer" 
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-[#1A6950] text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-center shadow-xl flex items-center justify-center gap-3"
                  >
                    Get Started
                    <ArrowRight size={20} className="text-[#CDF546]" />
                  </Link>
                  <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Want to sell? <Link to="/login/vendor" className="text-[#1A6950]">Join as Vendor</Link>
                  </p>
                </>
              ) : (
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full bg-gray-900 text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-center shadow-xl flex items-center justify-center gap-3"
                >
                  Log Out
                  <LogOut size={20} className="text-[#CDF546]" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
