import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Customer Pages
import Home from '../pages/Customer/Home';
import Menu from '../pages/Customer/Menu';
import ProductDetails from '../pages/Customer/ProductDetails';
import Cart from '../pages/Customer/Cart';
import Checkout from '../pages/Customer/Checkout';
import Tracking from '../pages/Customer/Tracking';
import Login from '../pages/Customer/Login';
import Register from '../pages/Customer/Register';
import Profile from '../pages/Customer/Profile';
import Orders from '../pages/Customer/Orders';
import Favorites from '../pages/Customer/Favorites';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProductsManagement from '../pages/Admin/ProductsManagement';
import OrdersManagement from '../pages/Admin/OrdersManagement';
import UsersManagement from '../pages/Admin/UsersManagement';

// Protection Wrapper
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      
      {/* Customer Routes (Public & Protected) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        
        {/* Auth routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Customer Protected routes */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="tracking/:orderId"
          element={
            <ProtectedRoute>
              <Tracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Panel Routes (Protected Admin-Only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="users" element={<UsersManagement />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};
export default AppRoutes;
