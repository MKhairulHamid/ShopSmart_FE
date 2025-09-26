# ShopSmart Frontend

A modern, responsive e-commerce frontend application built with React, TypeScript, and Material-UI. This application provides a complete shopping experience with product browsing, cart management, customer profiles, and admin functionality.

## 🚀 Features

### Customer Features
- 🛍️ **Product Browsing** - Browse products by categories with search functionality
- 🛒 **Shopping Cart** - Add/remove items, update quantities, persistent cart storage
- 👤 **Customer Profiles** - User registration, login, and profile management
- 📦 **Order Management** - Order history and order details tracking
- 🔍 **Search & Filter** - Advanced product search and filtering capabilities
- 📱 **Responsive Design** - Mobile-first design that works on all devices

### Admin Features
- 📊 **Admin Dashboard** - Sales metrics and overview
- 📦 **Product Management** - Add, edit, delete products and manage inventory
- 🏷️ **Category Management** - Create and manage product categories
- 👥 **Customer Management** - View and manage customer accounts
- 🧾 **Order Management** - View and update order statuses

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Emotion (CSS-in-JS)
- **Routing**: React Router DOM v6
- **State Management**: React Context API with useReducer
- **Data Fetching**: React Query v3 with Axios
- **Form Handling**: React Hook Form
- **Icons**: Material-UI Icons

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **ShopSmart Backend API** running on `https://localhost:7040`

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/MKhairulHamid/ShopSmart_FE.git
cd ShopSmart_FE
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure backend connection
The application is configured to connect to the backend API at `https://localhost:7040`. If your backend runs on a different port, update the `vite.config.ts` file:

```typescript
export default defineConfig({
  // ... other config
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:YOUR_BACKEND_PORT',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### 4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── layout/         # Layout components (Header, Footer)
├── context/            # React Context providers
│   ├── CartContext.tsx
│   └── CustomerContext.tsx
├── pages/              # Page components
│   ├── admin/          # Admin panel pages
│   ├── CategoryPage.tsx
│   ├── Checkout.tsx
│   ├── CustomerProfile.tsx
│   ├── CustomerRegistration.tsx
│   ├── HomePage.tsx
│   ├── OrderDetails.tsx
│   ├── OrderHistory.tsx
│   ├── ProductCatalog.tsx
│   ├── ProductDetails.tsx
│   └── ShoppingCart.tsx
├── services/           # API service layer
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

The frontend communicates with the ShopSmart backend API through the following endpoints:

- **Products**: `/api/product` - Product CRUD operations
- **Categories**: `/api/category` - Category management
- **Customers**: `/api/customer` - Customer management
- **Orders**: `/api/order` - Order processing

All API calls are handled through the `src/services/api.ts` service layer using Axios with proper error handling and TypeScript types.

## 🎨 Key Features Implementation

### Shopping Cart
- Persistent cart storage using localStorage
- Real-time cart updates across components
- Quantity management and price calculations

### Customer Management
- Simple email-based authentication
- Profile management with shipping addresses
- Order history tracking

### Admin Panel
- Product inventory management
- Order status updates
- Customer and category management
- Sales metrics dashboard

### Responsive Design
- Mobile-first approach using Material-UI breakpoints
- Adaptive navigation (hamburger menu on mobile)
- Touch-friendly interface elements

## 🔐 Environment Configuration

The application uses Vite's proxy configuration for API calls. No additional environment variables are required for basic functionality, but you can add environment-specific configurations as needed.

## 🚀 Deployment

### Building for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Deploy directly from GitHub with build commands
- **GitHub Pages**: Use GitHub Actions for deployment
- **Traditional hosting**: Upload the `dist/` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- Follow TypeScript best practices
- Use Material-UI theme system for consistent styling
- Implement proper error handling for API calls
- Write clean, readable component code with proper prop types

## 🐛 Troubleshooting

### Common Issues

1. **Page shows 404 or blank screen**
   - Check if the backend API is running on the correct port
   - Verify the proxy configuration in `vite.config.ts`

2. **API calls failing**
   - Ensure the backend is accessible at `https://localhost:7040`
   - Check browser console for CORS or network errors

3. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript compilation errors

## 📄 License

This project is part of the ShopSmart e-commerce application suite.

## 👥 Authors

- **MKhairulHamid** - *Initial work* - [GitHub](https://github.com/MKhairulHamid)

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- Vite team for the fast build tool
