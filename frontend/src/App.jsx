import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import CreateCropLot from './pages/CreateCropLot';
import MarketAnalysis from './pages/MarketAnalysis';
import BuyerOffers from './pages/BuyerOffers';
import BuyerMarketManagement from './pages/BuyerMarketManagement';
import Transactions from './pages/Transactions';
import PaymentPage from './pages/PaymentPage';
import UnifiedMarketHub from './pages/UnifiedMarketHub';
import Aim from './pages/Aim';

// Component to handle generic /dashboard route based on user role
const DynamicDashboardRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'buyer') return <Navigate to="/buyer/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/farmer/dashboard" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/aim" element={<Aim />} />
          <Route path="/our-aim" element={<Aim />} />
          
          {/* Main Login and Sub-Role Login Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/farmer" element={<Login initialRole="farmer" />} />
          <Route path="/login/buyer" element={<Login initialRole="buyer" />} />
          <Route path="/login/admin" element={<Login initialRole="admin" />} />
          
          {/* Main Registration and Sub-Role Registration Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/register/farmer" element={<Register initialRole="farmer" />} />
          <Route path="/register/buyer" element={<Register initialRole="buyer" />} />

          {/* Role Dashboard Dynamic Router */}
          <Route path="/dashboard" element={<DynamicDashboardRedirect />} />

          {/* Farmer Only Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-lot"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <CreateCropLot />
              </ProtectedRoute>
            }
          />
          <Route path="/market-hub" element={<UnifiedMarketHub />} />
          <Route path="/market-analysis" element={<MarketAnalysis />} />
          <Route path="/farmer/market-analysis" element={<MarketAnalysis />} />
          <Route path="/buyer-markets" element={<UnifiedMarketHub />} />
          <Route path="/buyer/markets" element={<UnifiedMarketHub />} />

          {/* Buyer Only Routes */}
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer-offers"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/offers"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer-profile"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'farmer', 'admin']}>
                <BuyerMarketManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer-requirements"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'farmer', 'admin']}>
                <BuyerMarketManagement />
              </ProtectedRoute>
            }
          />

          {/* Shared Authenticated Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer', 'admin']}>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:transactionId"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer', 'admin']}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </LanguageProvider>
</ErrorBoundary>
  );
}

export default App;


