import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DoctorLogin from './pages/login/DoctorLogin';
import PatientLogin from './pages/login/PatientLogin';
import AdminLogin from './pages/login/AdminLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />

          {/* Explicit Login Routes */}
          <Route path="/login/doctor" element={<DoctorLogin />} />
          <Route path="/login/patient" element={<PatientLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          <Route path="/dashboard/doctor" element={
            <ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/patient" element={
            <ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}
