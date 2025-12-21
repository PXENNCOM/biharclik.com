import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { StudentRegisterPage } from './pages/auth/StudentRegisterPage';
import { SenderRegisterPage } from './pages/auth/SenderRegisterPage';
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
import { AdminSupportPage } from './pages/admin/AdminSupportPage'; // ✨ YENİ

// Common Pages
import { ProfilePage } from './pages/common/ProfilePage';
import { SupportPage } from './pages/common/SupportPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/student" element={<StudentRegisterPage />} />
          <Route path="/register/sender" element={<SenderRegisterPage />} />
          <Route path="/register/success" element={<RegisterSuccessPage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/history"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/support"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SupportPage />
              </ProtectedRoute>
            }
          />

          {/* Sender Routes */}
          <Route
            path="/sender/dashboard"
            element={
              <ProtectedRoute allowedRoles={['sender']}>
                <SenderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sender/history"
            element={
              <ProtectedRoute allowedRoles={['sender']}>
                <SenderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sender/support"
            element={
              <ProtectedRoute allowedRoles={['sender']}>
                <SupportPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminStudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/deliveries"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDeliveriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/senders"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSendersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          {/* ✨ YENİ: Admin Support */}
          <Route
            path="/admin/support"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSupportPage />
              </ProtectedRoute>
            }
          />

          {/* Common Routes (All roles) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['student', 'sender', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;