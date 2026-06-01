import { useEffect } from 'react';
import { trackPageView } from './utils/analytics';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth Pages
import { LoginController as LoginPage } from './pages/auth/Login/LoginController';
import StudentRegisterPage from './pages/auth/StudentRegister/StudentRegisterController';
import SenderRegisterPage from './pages/auth/SenderRegister/SenderRegisterController';
import { RegisterSuccessPage } from './pages/auth/RegisterSuccessPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentHistoryPage } from './pages/student/StudentHistoryPage';

// Sender Pages
import { SenderDashboard } from './pages/sender/SenderDashboard';
import { SenderHistoryPage } from './pages/sender/SenderHistoryPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminDeliveriesPage } from './pages/admin/AdminDeliveriesPage';
import { AdminSendersPage } from './pages/admin/AdminSendersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSupportPage } from './pages/admin/AdminSupportPage';

// Common Pages
import { ProfilePage } from './components/common/ProfilePage';
import { SupportPage } from './components/common/SupportPage';

import PaymentSuccess from './pages/home/payment/PaymentSuccess';
import PaymentFailed from './pages/home/payment/PaymentFailed';


//Home Pages
import Home from './pages/home/index'
import { KurumsalPage } from './pages/home/kurumsal';

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/hesap-olustur/ogrenci" element={<StudentRegisterPage />} />
      <Route path="/hesap-olustur/gonderici" element={<SenderRegisterPage />} />
      <Route path="/register/success" element={<RegisterSuccessPage />} />
      <Route path='/' element={<Home />} />
      <Route path="/kurumsal" element={<KurumsalPage />} />

      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failed" element={<PaymentFailed />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
      } />
      <Route path="/student/history" element={
        <ProtectedRoute allowedRoles={['student']}><StudentHistoryPage /></ProtectedRoute>
      } />
      <Route path="/student/support" element={
        <ProtectedRoute allowedRoles={['student']}><SupportPage /></ProtectedRoute>
      } />

      {/* Sender Routes */}
      <Route path="/sender/dashboard" element={
        <ProtectedRoute allowedRoles={['sender']}><SenderDashboard /></ProtectedRoute>
      } />
      <Route path="/sender/history" element={
        <ProtectedRoute allowedRoles={['sender']}><SenderHistoryPage /></ProtectedRoute>
      } />
      <Route path="/sender/support" element={
        <ProtectedRoute allowedRoles={['sender']}><SupportPage /></ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminStudentsPage /></ProtectedRoute>
      } />
      <Route path="/admin/deliveries" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminDeliveriesPage /></ProtectedRoute>
      } />
      <Route path="/admin/senders" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminSendersPage /></ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminReportsPage /></ProtectedRoute>
      } />
      <Route path="/admin/support" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminSupportPage /></ProtectedRoute>
      } />

      {/* Common Routes */}
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['student', 'sender', 'admin']}><ProfilePage /></ProtectedRoute>
      } />

      {/* Default Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;