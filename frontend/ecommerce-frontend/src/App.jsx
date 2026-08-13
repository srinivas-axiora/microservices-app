import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import api, { getUserId } from './api';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const userId = getUserId();
      const res = await api.get(`/cart/${userId}`);
      const items = res.data?.items || [];
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar cartCount={cartCount} onLogout={fetchCartCount} onSearch={setSearchQuery} />

        <main style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Routes>
            <Route path="/" element={<HomePage onCartChange={fetchCartCount} searchQuery={searchQuery} />} />
            <Route path="/login" element={<AuthPage onAuthSuccess={fetchCartCount} />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/profile" element={<AccountPage />} />

            <Route path="/products/:id" element={<ProductDetailPage onCartChange={fetchCartCount} />} />
            <Route path="/cart" element={<CartPage onCartChange={fetchCartCount} />} />
            <Route path="/checkout" element={<CheckoutPage onCartChange={fetchCartCount} />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}


export default App;
