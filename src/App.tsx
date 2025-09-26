import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { useState } from 'react'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Page Components
import HomePage from './pages/HomePage'
import ProductCatalog from './pages/ProductCatalog'
import ProductDetails from './pages/ProductDetails'
import CategoryPage from './pages/CategoryPage'
import ShoppingCart from './pages/ShoppingCart'
import Checkout from './pages/Checkout'
import CustomerProfile from './pages/CustomerProfile'
import OrderHistory from './pages/OrderHistory'
import OrderDetails from './pages/OrderDetails'
import CustomerRegistration from './pages/CustomerRegistration'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'

// Context
import { CartProvider } from './context/CartContext'
import { CustomerProvider } from './context/CustomerContext'

import './App.css'

function App() {
  return (
    <CustomerProvider>
      <CartProvider>
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'background.default'
        }}>
          <Header />
          
          <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductCatalog />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/register" element={<CustomerRegistration />} />
              
              {/* Customer Routes */}
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </CartProvider>
    </CustomerProvider>
  )
}

export default App
