# Vendorify

A modern marketplace platform connecting customers with local vendors through real-time location services and interactive maps.

## Tech Stack

**Frontend:** React 18 + Tailwind CSS + Framer Motion  
**Backend:** Node.js/Express + MongoDB + Socket.io  
**Maps:** Leaflet + React Leaflet  
**Authentication:** JWT + bcrypt  
**Real-time:** Socket.io for live updates  

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vendorify
```

2. **Install dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies  
cd ../server
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp server/.env.example server/.env

# Configure your environment variables
# - MONGODB_URI
# - JWT_SECRET  
# - PORT
# - FRONTEND_URL
```

4. **Initialize Database**
```bash
cd server
npm run init-db
npm run verify
```

5. **Start Development Servers**
```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend  
cd client
npm start
```

## Folder Structure

```
vendorify/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── common/    # Shared UI components
│   │   │   ├── map/       # Map-related components
│   │   │   ├── chat/      # Chat/messaging components
│   │   │   └── vendor/    # Vendor-specific components
│   │   ├── pages/         # Page components
│   │   │   ├── customer/  # Customer pages
│   │   │   ├── vendor/    # Vendor pages
│   │   │   └── admin/     # Admin pages
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── constants/     # App constants
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── scripts/          # Database scripts
│   ├── uploads/          # File uploads
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/vendors/nearby` | Get nearby vendors |
| POST | `/api/vendors/profile` | Update vendor profile |
| GET | `/api/orders` | Get user orders |
| POST | `/api/orders` | Create new order |

## Features

- 🗺️ **Interactive Maps** - Real-time vendor locations with Leaflet
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based auth with role management
- 💬 **Real-time Chat** - Socket.io powered messaging
- 📍 **Geolocation** - Location-based vendor discovery
- 🛒 **Order Management** - Complete order lifecycle
- 📊 **Vendor Dashboard** - Analytics and management tools
- 🎨 **Modern UI** - Smooth animations with Framer Motion

## Development

### Code Style
- ESLint configuration included
- Prettier for code formatting
- Consistent naming: camelCase for functions, PascalCase for components

### Testing
```bash
# Run client tests
cd client
npm test

# Run server tests (when implemented)
cd server  
npm test
```

### Build for Production
```bash
# Build client
cd client
npm run build

# Start production server
cd server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.