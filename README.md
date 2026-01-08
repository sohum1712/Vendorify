# Vendorify

A modern vendor management platform built with React.js that connects customers with local service providers.

## Features

- **Customer Dashboard**: Browse and book services from local vendors
- **Admin Dashboard**: Manage vendors, services, and platform operations
- **Interactive Maps**: Find vendors near your location
- **Modern UI**: Built with Tailwind CSS and Lucide React icons
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.18.0
- **Styling**: Tailwind CSS 3.3.3
- **Icons**: Lucide React 0.263.1
- **Notifications**: React Toastify 10.0.4
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kum4rX/Vendorify.git
cd Vendorify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   └── common/          # Reusable UI components
├── context/
│   └── AuthContext.js   # Authentication context
├── constants/
│   └── roles.js         # User role definitions
├── pages/
│   ├── AdminDashboard.jsx
│   ├── CustomerDashboard.jsx
│   └── LandingPage.jsx
├── App.js               # Main application component
├── index.css            # Global styles
└── index.js             # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/Kum4rX/Vendorify](https://github.com/Kum4rX/Vendorify)
