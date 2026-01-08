import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const navigate = useNavigate();

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
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-2 z-50 w-full flex justify-center px-4 md:px-0 transition-transform duration-500 ${!isHero && isHidden ? '-translate-y-[150%] hover:translate-y-0' : 'translate-y-0'}`}>
      <div className="bg-white/90 backdrop-blur-md px-8 md:px-12 py-3 md:py-4 flex items-center justify-between w-full max-w-7xl rounded-b-[48px] shadow-lg border-x border-b border-gray-100/50">

        {/* Left Side Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12 flex-1">
          <div className="relative group">
            <button 
              onClick={() => scrollToSection('categories')}
              className="flex items-center gap-1.5 text-gray-800 hover:text-[#1A6950] transition-colors font-bold text-[14px] font-sans uppercase tracking-widest"
            >
              Products
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-gray-100 rounded-2xl shadow-xl py-4 w-64 mt-2 animate-in fade-in slide-in-from-top-2">
              <button onClick={() => scrollToSection('categories')} className="w-full text-left block px-6 py-3 hover:bg-[#FDF9DC] text-gray-800 text-[12px] font-bold uppercase tracking-widest transition-colors">
                Vegetables
              </button>
              <button onClick={() => scrollToSection('categories')} className="w-full text-left block px-6 py-3 hover:bg-[#FDF9DC] text-gray-800 text-[12px] font-bold uppercase tracking-widest transition-colors">
                Fruits
              </button>
            </div>
          </div>
          <Link to="/login/customer" className="text-gray-800 hover:text-[#1A6950] transition-colors font-bold text-[14px] font-sans uppercase tracking-widest">
            Customers
          </Link>
          <Link to="/login/vendor" className="text-gray-800 hover:text-[#1A6950] transition-colors font-bold text-[14px] font-sans uppercase tracking-widest">
            Careers
          </Link>
        </div>

        {/* Logo - Center */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#CDF546] rounded-xl flex items-center justify-center font-black text-gray-900 text-xl shadow-sm">
              V
            </div>
            <span className="text-2xl md:text-3xl font-heading font-black text-gray-900 tracking-tight uppercase">Vendorify</span>
          </div>
        </Link>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
          <Link to="/login/customer" className="text-gray-800 hover:text-[#1A6950] transition-colors font-bold text-[14px] font-sans uppercase tracking-widest">
            Sign in
          </Link>
          <button 
            onClick={() => scrollToSection('hero')}
            className="bg-[#CDF546] hover:bg-[#b8dd3e] text-gray-900 px-8 py-3 rounded-full font-bold transition-all text-[14px] flex items-center justify-center gap-2 font-sans uppercase tracking-widest shadow-sm"
          >
            See a demo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-4 right-4 bg-white rounded-[32px] shadow-2xl p-8 border border-gray-100 md:hidden flex flex-col gap-6 animate-in fade-in slide-in-from-top-4">
          <button onClick={() => scrollToSection('categories')} className="text-left text-gray-800 font-bold text-lg uppercase tracking-widest py-2">Products</button>
          <Link to="/login/customer" className="text-gray-800 font-bold text-lg uppercase tracking-widest py-2">Customers</Link>
          <Link to="/login/vendor" className="text-gray-800 font-bold text-lg uppercase tracking-widest py-2">Careers</Link>
          <hr className="border-gray-100" />
          <Link to="/login/customer" className="text-gray-800 font-bold text-lg uppercase tracking-widest py-2">Sign in</Link>
          <button 
            onClick={() => scrollToSection('hero')}
            className="bg-[#CDF546] text-gray-900 px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            See a demo
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </nav>
  );
}
