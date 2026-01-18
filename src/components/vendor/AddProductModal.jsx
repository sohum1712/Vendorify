import React, { useState } from 'react';
import { X, DollarSign, Tag, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'food',
        description: '',
        image: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: Number(formData.price),
            available: true
        });
        onClose();
        setFormData({ name: '', price: '', category: 'food', description: '', image: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Add New Item</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Item Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Masala Dosa"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#1A6950] transition-colors font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price (₹)</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-9 focus:outline-none focus:border-[#1A6950] transition-colors font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                            <div className="relative">
                                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-9 focus:outline-none focus:border-[#1A6950] transition-colors font-medium appearance-none"
                                >
                                    <option value="food">Food</option>
                                    <option value="beverage">Beverage</option>
                                    <option value="dessert">Dessert</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the item..."
                            rows="3"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#1A6950] transition-colors font-medium resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Image URL</label>
                        <div className="relative">
                            <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-9 focus:outline-none focus:border-[#1A6950] transition-colors font-medium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1A6950] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#145240] transition-colors shadow-lg shadow-[#1A6950]/20"
                    >
                        Add Item
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddProductModal;
