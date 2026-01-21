# Vendorify Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

The `.env` files are already created with default values. Update them as needed:

**Server (.env):**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Strong secret key for JWT tokens
- `PORT`: Server port (default: 5001)

**Client (.env):**
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5001/api)

### 3. Database Setup

```bash
cd server

# Verify your setup
npm run verify

# Initialize database with test users
npm run init-db
```

### 4. Start the Application

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm start
```

## 🔐 Test Users

After running `npm run init-db`, you'll have these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vendorify.com | admin123456 |
| Customer | customer@test.com | customer123 |
| Vendor | vendor@test.com | vendor123 |

## 🧪 Testing Authentication

1. Visit `http://localhost:3000`
2. Click "Login" or "Sign Up"
3. Use test credentials or create new account
4. Test role-based access to different dashboards

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Health Check
- `GET /api/health` - Server health status

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB service
brew services start mongodb/brew/mongodb-community
# or
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### JWT Issues
- Ensure `JWT_SECRET` is set in server/.env
- Check that the secret is long and complex

## 🏗️ Architecture

```
Vendorify/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth, etc.)
│   │   └── utils/         # Utilities (API client, etc.)
│   └── .env              # Frontend environment variables
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── scripts/          # Utility scripts
│   └── .env             # Backend environment variables
└── SETUP.md             # This file
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Role-based access control

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in server/.env
2. Update `MONGODB_URI` to production database
3. Set strong `JWT_SECRET`
4. Update `FRONTEND_URL` to production domain
5. Build client: `npm run build`
6. Deploy server with process manager (PM2, etc.)

## 📞 Support

If you encounter issues:
1. Run `npm run verify` in server directory
2. Check console logs for errors
3. Ensure MongoDB is running
4. Verify environment variables are set correctly