import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { CartProvider } from './context/CartContext';
import { FavoriteProvider } from './context/FavoriteContext';
import { OrderProvider } from './context/OrderContext';
import { AntiGravityProvider } from './context/AntiGravityContext';
import AppRoutes from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <CartProvider>
              <FavoriteProvider>
                <OrderProvider>
                  <AntiGravityProvider>
                    <AppRoutes />
                  </AntiGravityProvider>
                </OrderProvider>
              </FavoriteProvider>
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
