# Vendorify

A modern marketplace platform connecting customers with local vendors through real-time location services and interactive maps.

## 🚀 Production Ready Features

- **Secure Authentication** - JWT-based auth with role management
- **Real-time Updates** - Socket.io powered live vendor tracking
- **Interactive Maps** - Leaflet-based location services
- **File Uploads** - Secure image handling for vendor profiles
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Performance Optimized** - Smart caching and compression
- **Production Security** - Helmet, CORS, rate limiting

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

### Development Setup

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
# Copy environment templates
cp server/.env.example server/.env
cp client/.env.example client/.env

# Configure your environment variables in both .env files
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

### Production Deployment

1. **Quick Deploy**
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh && ./deploy.sh
```

2. **Manual Deploy**
```bash
# Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit both .env files with production values

# Install and build
cd server && npm ci --only=production
cd ../client && npm ci && npm run build

# Initialize database
cd ../server && npm run init-db && npm run verify

# Start production server
npm start
```

3. **Process Management (Recommended)**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit
```

## Production Checklist

See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for complete deployment guide.

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
| GET | `/api/health` | Health check |

## Features

- 🗺️ **Interactive Maps** - Real-time vendor locations with Leaflet
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based auth with role management
- 💬 **Real-time Chat** - Socket.io powered messaging
- 📍 **Geolocation** - Location-based vendor discovery
- 🛒 **Order Management** - Complete order lifecycle
- 📊 **Vendor Dashboard** - Analytics and management tools
- 🎨 **Modern UI** - Smooth animations with Framer Motion
- ⚡ **Performance** - Smart caching and optimization
- 🔒 **Security** - Production-ready security measures

## Architecture

```
vendorify/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── constants/     # App constants
│   └── build/             # Production build (generated)
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── scripts/          # Database scripts
│   └── uploads/          # File uploads
├── logs/                  # Application logs
├── ecosystem.config.js    # PM2 configuration
├── nginx.conf.example     # Nginx configuration
└── PRODUCTION_CHECKLIST.md
```

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.