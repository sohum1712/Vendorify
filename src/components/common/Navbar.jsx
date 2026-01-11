import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, Bell, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ role = "landing" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight - 100;

      if (scrollY > heroHeight) {
        setIsHero(false);
        setIsHidden(true);
      } else {
        setIsHero(true);
        setIsHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav className={`fixed top-2 z-50 w-full flex justify-center px-4 md:px-0 transition-transform duration-500 ${!isHero && isHidden ? '-translate-y-[150%] hover:translate-y-0' : 'translate-y-0'}`}>
      <div className="bg-white/90 backdrop-blur-md px-8 md:px-12 py-3 md:py-4 flex items-center justify-between w-full max-w-7xl rounded-b-[48px] shadow-lg border-x border-b border-gray-100/50">

        {/* Left Side Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12 flex-1">
          {role === 'landing' && (
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-gray-800 hover:text-[#1A6950] transition-colors font-bold text-[14px] font-sans uppercase tracking-widest">
                Products
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-gray-100 rounded-2xl shadow-xl py-4 w-64 mt-2 animate-in fade-in slide-in-from-top-2">
                <button onClick={() => scrollToSection('categories')} className="block w-full text-left px-6 py-3 hover:bg-[#FDF9DC] text-gray-800 text-[12px] font-bold uppercase tracking-widest transition-colors">
                  Categories
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-6 py-3 hover:bg-[#FDF9DC] text-gray-800 text-[12px] font-bold uppercase tracking-widest transition-colors">
                  How it Works
                </button>
              </div>
            </div>
          )}
          {currentLinks.map((link, idx) => (
            <div key={idx}>
              {link.action ? (
                <button 
                  onClick={link.action}
                  className="text-gray-800 hover:text-[#1A6950] transition-colors font-bold text-[14px] font-sans uppercase tracking-widest"
                >
                  {link.name}
                </button>
              ) : (
                <Link 
                  to={link.to} 
                  className="text-gray-800 hover:text-[#1A6950] transition-colors font-bold text-[14px] font-sans uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Logo - Center */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1A6950] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-[#CDF546] font-black text-2xl md:text-3xl">V</span>
            </div>
            <span className="text-2xl md:text-3xl font-heading font-black text-gray-900 tracking-tight uppercase">Vendorify</span>
          </div>
        </Link>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
          {role === 'landing' ? (
            <>
              <Link to="/login/customer" className="text-gray-800 hover:text-[#1A6950] transition-colors font-bold text-[14px] font-sans uppercase tracking-widest">
                Sign in
              </Link>
              <button 
                onClick={() => navigate('/login/vendor')}
                className="bg-[#CDF546] hover:bg-[#b8dd3e] text-gray-900 px-8 py-3 rounded-full font-bold transition-all text-[14px] flex items-center justify-center gap-2 font-sans uppercase tracking-widest shadow-sm"
              >
                See a demo
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button className="p-3 text-gray-400 hover:text-[#1A6950] transition-colors">
                <Bell size={20} />
              </button>
              <button 
                onClick={logout}
                className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[14px] transition-all shadow-sm flex items-center gap-2"
              >
                Log Out
                <LogOut size={16} className="text-[#CDF546]" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[calc(100%+8px)] left-4 right-4 bg-white rounded-[32px] shadow-2xl p-8 border border-gray-100 md:hidden flex flex-col gap-6"
          >
            {currentLinks.map((link, idx) => (
              <div key={idx}>
                {link.action ? (
                  <button 
                    onClick={link.action}
                    className="text-gray-800 font-bold text-lg uppercase tracking-widest py-2 w-full text-left"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link 
                    to={link.to} 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-800 font-bold text-lg uppercase tracking-widest py-2 block"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <hr className="border-gray-100" />
            {role === 'landing' ? (
              <>
                <Link to="/login/customer" onClick={() => setIsOpen(false)} className="text-gray-800 font-bold text-lg uppercase tracking-widest py-2">
                  Sign in
                </Link>
                <button 
                  onClick={() => { navigate('/login/vendor'); setIsOpen(false); }}
                  className="bg-[#CDF546] text-gray-900 px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  See a demo
                  <ArrowRight className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="bg-gray-900 text-white px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                Log Out
                <LogOut className="h-5 w-5 text-[#CDF546]" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
