import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield, Globe, Users, Briefcase, FileText, HelpCircle, Lock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

const INFO_CONTENT = {
  '/security': {
    title: 'Security & Compliance',
    description: 'The world\'s most trusted vendor verification and compliance monitoring platform.',
    icon: Shield,
    sections: [
      { title: 'Data Encryption', text: 'All data is encrypted at rest and in transit using industry-standard AES-256 encryption.' },
      { title: 'Compliance', text: 'We comply with GDPR, CCPA, and local Indian regulations for vendor verification.' },
      { title: 'Identity Verification', text: 'Aadhaar-based verification for all street vendors to ensure trust and reliability.' }
    ]
  },
  '/integrations': {
    title: 'Integrations',
    description: 'Connect Vendorify with your favorite tools and platforms.',
    icon: Globe,
    sections: [
      { title: 'WhatsApp Integration', text: 'Share order status and confirmation directly to your customers via WhatsApp.' },
      { title: 'Payment Gateways', text: 'Integrated with UPI, Razorpay, and Stripe for seamless digital transactions.' },
      { title: 'MapBox API', text: 'Real-time location tracking using high-precision MapBox mapping services.' }
    ]
  },
  '/about': {
    title: 'About Vendorify',
    description: 'Empowering local street vendors with digital infrastructure.',
    icon: Users,
    sections: [
      { title: 'Our Mission', text: 'To bridge the gap between street vendors and digital-first customers.' },
      { title: 'The Vision', text: 'A world where every local business has the tools to thrive in the digital economy.' },
      { title: 'Our Values', text: 'Trust, Transparency, and Community-driven growth.' }
    ]
  },
  '/careers': {
    title: 'Join Our Team',
    description: 'Build the future of local commerce with us.',
    icon: Briefcase,
    sections: [
      { title: 'Engineering', text: 'Help us build scalable infrastructure for millions of vendors.' },
      { title: 'Design', text: 'Create beautiful, intuitive experiences for both vendors and customers.' },
      { title: 'Operations', text: 'Scale our impact across cities and empower local communities.' }
    ]
  }
};

const InfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const content = INFO_CONTENT[location.pathname] || {
    title: 'Information',
    description: 'Details about Vendorify services.',
    icon: FileText,
    sections: [{ title: 'Overview', text: 'This section is currently being updated. Check back soon!' }]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FDF9DC] font-sans selection:bg-[#CDF546]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center gap-6 mb-16">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-xl transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-heading font-black text-gray-900 uppercase tracking-tight">{content.title}</h1>
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.3em] mt-1">{content.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {content.sections.map((section, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#CDF546] transition-colors duration-500">
                <content.icon size={28} className="text-[#1A6950]" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-4">{section.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        {/* Feature Section */}
        <div className="bg-gray-900 rounded-[56px] p-12 md:p-20 text-white relative overflow-hidden mb-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CDF546] rounded-full blur-[150px] opacity-10 translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-xl">
              <h2 className="text-5xl md:text-7xl font-heading font-black uppercase leading-[0.9] tracking-tighter">
                Trust is our <br />
                <span className="text-[#CDF546]">Foundation</span>
              </h2>
              <p className="text-white/60 text-lg font-medium">
                We believe in a secure ecosystem where every transaction is safe and every vendor is verified.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 text-center">
                <h4 className="text-4xl font-black mb-1">100%</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Encryption</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 text-center">
                <h4 className="text-4xl font-black mb-1">24/7</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InfoPage;
