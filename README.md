# GeoLocator - IP Geolocation Tool

A modern React frontend application for IP geolocation lookup with authentication, search history, and responsive UI design.

## 🌟 Features

- **🔐 Secure Authentication** - JWT-based login/logout with Laravel Sanctum
- **🌍 IP Geolocation** - Real-time IP address lookup using ipinfo.io API
- **📝 Search History** - Persistent search history with management capabilities
- **📱 Responsive Design** - Mobile-first UI built with Tailwind CSS
- **⚡ Modern Stack** - React 19, Vite, and shadcn/ui components
- **🎨 Beautiful UI** - Clean, professional interface with smooth animations
- **🔄 Real-time Updates** - Live data fetching and state management

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** - UI framework with hooks
- **Vite 7.2.4** - Fast build tool and dev server
- **React Router 7.10.1** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Icon library
- **Axios 1.13.2** - HTTP client for API requests
- **React Hot Toast** - Notification system
- **SweetAlert2** - Enhanced alert dialogs

### Backend Integration
- **Laravel API** - Authentication and geolocation services
- **JWT Tokens** - Secure authentication
- **ipinfo.io API** - Geolocation data provider

## 📋 Prerequisites

- Node.js 18+ and npm
- Laravel backend running on `http://localhost:8000`
- Valid API credentials for the backend

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-geo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   │   └── PrivateRoute.jsx
│   ├── geo/            # Geolocation components
│   │   ├── GeoDisplay.jsx
│   │   ├── HistoryList.jsx
│   │   └── IPSearch.jsx
│   └── ui/             # UI components
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       └── LoadingSpinner.jsx
├── context/            # React context
│   └── AuthContext.jsx
├── hooks/              # Custom hooks
│   ├── useGeoLocation.js
│   └── usePagination.js
├── pages/              # Page components
│   ├── HomePage.jsx
│   └── LoginPage.jsx
├── services/           # API services
│   └── api.js
├── utils/              # Utility functions
│   └── sweetAlertConfig.js
├── App.jsx             # Main app component
└── main.jsx            # App entry point
```

## 🔐 Authentication Flow

1. **Login**: Users authenticate via `/api/login` endpoint
2. **Token Storage**: JWT tokens stored in localStorage
3. **Auto-redirect**: Protected routes redirect to login if unauthenticated
4. **Token Management**: Automatic token inclusion in API requests
5. **Logout**: Token invalidation and cleanup on logout

### Test Credentials
- **Email**: `admin@jlabs.com`
- **Password**: `password123`

## 🌍 API Integration

The application integrates with a Laravel backend API. For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Key Endpoints Used
- `POST /api/login` - User authentication
- `GET /api/geo` - IP geolocation lookup
- `GET /api/history` - Search history retrieval
- `POST /api/history/delete` - History deletion

## 🎯 Component Architecture

### Core Components
- **HomePage**: Main dashboard with search and history
- **IPSearch**: IP address input and validation
- **GeoDisplay**: Geolocation data visualization
- **HistoryList**: Search history management
- **PrivateRoute**: Authentication guard component

### Custom Hooks
- **useGeoLocation**: Manages geolocation state and API calls
- **usePagination**: Handles pagination logic
- **useAuth**: Authentication state management

## 🎨 UI Features

- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode Support**: Configurable theme system
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: CSS transitions and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation

## 📱 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🔧 Development

### Code Quality
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting (recommended)
- **Git Hooks**: Pre-commit linting

### Best Practices
- Component-based architecture
- Custom hooks for reusable logic
- Consistent error handling
- Proper loading states
- Responsive design principles

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for `http://localhost:5173`
   - Check `.env` file for correct API URL

2. **Authentication Issues**
   - Verify backend is running on port 8000
   - Check localStorage for valid tokens
   - Confirm API credentials are correct

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version compatibility

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration

## 📚 Additional Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Backend API reference
- [Component Documentation](./src/components/) - Individual component docs
- [Laravel Backend](../backend/) - Backend application setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [ipinfo.io](https://ipinfo.io) - Geolocation data provider
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vite.dev/) - Build tool
