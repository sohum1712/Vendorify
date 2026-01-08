export const ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CUSTOMER: 'customer'
};

export const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'Store' },
  { id: 'food', name: 'Street Food', icon: 'Utensils' },
  { id: 'veg', name: 'Vegetables', icon: 'Carrot' },
  { id: 'tea', name: 'Tea Stalls', icon: 'Coffee' },
  { id: 'kiosk', name: 'Kiosks', icon: 'ShoppingBag' },
];

export const INITIAL_VENDORS = [
  {
    id: 1,
    name: "Raju's Pani Puri",
    category: "food",
    rating: 4.8,
    distance: "0.2 km",
    isRoaming: true,
    location: { lat: 30, lng: 40 },
    address: "Roaming near Main Market",
    status: "Open",
    image: "https://images.unsplash.com/photo-1593560708920-63984be368ad?auto=format&fit=crop&q=80&w=400",
    menu: [
      { id: 101, name: "Pani Puri (6pcs)", price: 30, type: "veg", icon: "Circle" },
      { id: 102, name: "Dahi Puri", price: 50, type: "veg", icon: "Circle" },
      { id: 103, name: "Masala Puri", price: 40, type: "veg", icon: "Circle" },
    ]
  },
  {
    id: 2,
    name: "Sangeetha Tea Stall",
    category: "tea",
    rating: 4.6,
    distance: "0.5 km",
    isRoaming: false,
    location: { lat: 40, lng: 50 },
    address: "Near Bus Stand",
    status: "Open",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cda9?auto=format&fit=crop&q=80&w=400",
    menu: [
      { id: 201, name: "Masala Chai", price: 15, type: "veg", icon: "Coffee" },
      { id: 202, name: "Ginger Tea", price: 12, type: "veg", icon: "Coffee" },
      { id: 203, name: "Samosa", price: 20, type: "veg", icon: "Triangle" },
    ]
  },
  {
    id: 3,
    name: "Fresh Veggie Cart",
    category: "veg",
    rating: 4.4,
    distance: "0.8 km",
    isRoaming: true,
    location: { lat: 50, lng: 60 },
    address: "Moving around Residential Area",
    status: "Open",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
    menu: [
      { id: 301, name: "Tomatoes (1kg)", price: 40, type: "veg", icon: "Circle" },
      { id: 302, name: "Onions (1kg)", price: 35, type: "veg", icon: "Circle" },
      { id: 303, name: "Potatoes (1kg)", price: 30, type: "veg", icon: "Circle" },
    ]
  },
  {
    id: 4,
    name: "Quick Snacks Kiosk",
    category: "kiosk",
    rating: 4.2,
    distance: "1.2 km",
    isRoaming: false,
    location: { lat: 60, lng: 70 },
    address: "Near School",
    status: "Open",
    image: "https://images.unsplash.com/photo-1550563734-0a3e0e40be36?auto=format&fit=crop&q=80&w=400",
    menu: [
      { id: 401, name: "Biscuit Packet", price: 25, type: "veg", icon: "Square" },
      { id: 402, name: "Chips", price: 20, type: "veg", icon: "Square" },
      { id: 403, name: "Cold Drink", price: 30, type: "veg", icon: "Square" },
    ]
  },
];

export const AI_WELCOME_MSG = "Hello! I'm your Vendorify Assistant. You can ask me to find 'Spicy Pani Puri' or 'Cheap Vegetables' nearby. You can also use voice search!";
