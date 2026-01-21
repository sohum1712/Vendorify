import React, { useState } from 'react';
import { X, Save, Store, MapPin, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShopDetailsModal = ({ isOpen, onClose, details, onSave }) => {
    const [formData, setFormData] = useState(details || {
        shopName: '',
        ownerName: '',
        phone: '',
        address: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl"
                >
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#FDF9DC]">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Edit Shop Profile</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Update your business details</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Shop Name</label>
                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl group-focus-within:bg-white group-focus-within:shadow-lg transition-all border border-transparent group-focus-within:border-[#CDF546]">
                                    <Store size={18} className="text-[#1A6950]" />
                                    <input
                                        type="text"
                                        value={formData.shopName}
                                        onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                        className="bg-transparent w-full font-bold text-gray-900 outline-none placeholder:text-gray-300"
                                        placeholder="Enter shop name"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Owner Name</label>
                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl group-focus-within:bg-white group-focus-within:shadow-lg transition-all border border-transparent group-focus-within:border-[#CDF546]">
                                    <User size={18} className="text-[#1A6950]" />
                                    <input
                                        type="text"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        className="bg-transparent w-full font-bold text-gray-900 outline-none placeholder:text-gray-300"
                                        placeholder="Enter owner name"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl group-focus-within:bg-white group-focus-within:shadow-lg transition-all border border-transparent group-focus-within:border-[#CDF546]">
                                    <Phone size={18} className="text-[#1A6950]" />
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-transparent w-full font-bold text-gray-900 outline-none placeholder:text-gray-300"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Base Address</label>
                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl group-focus-within:bg-white group-focus-within:shadow-lg transition-all border border-transparent group-focus-within:border-[#CDF546]">
                                    <MapPin size={18} className="text-[#1A6950]" />
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="bg-transparent w-full font-bold text-gray-900 outline-none placeholder:text-gray-300"
                                        placeholder="Enter base location"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-[#1A6950] text-white py-4 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#155a43] active:scale-95 transition-all shadow-xl shadow-[#1A6950]/20"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ShopDetailsModal;
