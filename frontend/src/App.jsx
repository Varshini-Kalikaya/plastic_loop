import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Components & Layouts
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import RequestPickupPage from './pages/user/RequestPickupPage';
import MyPickupsPage from './pages/user/MyPickupsPage';
import RecyclingHistoryPage from './pages/user/RecyclingHistoryPage';
import RewardsPage from './pages/user/RewardsPage';
import RedemptionHistoryPage from './pages/user/RedemptionHistoryPage';
import LeaderboardPage from './pages/user/LeaderboardPage';
import ImpactDashboardPage from './pages/user/ImpactDashboardPage';
import ProfilePage from './pages/user/ProfilePage';

// Collector Pages
import CollectorDashboard from './pages/collector/CollectorDashboard';
import CollectorPickupsPage from './pages/collector/CollectorPickupsPage';
import CollectorHistoryPage from './pages/collector/CollectorHistoryPage';

// Recycler Pages
import RecyclerDashboard from './pages/recycler/RecyclerDashboard';
import RecyclerMaterialsPage from './pages/recycler/RecyclerMaterialsPage';
import RecyclerHistoryPage from './pages/recycler/RecyclerHistoryPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CollectorAssignmentPage from './pages/admin/CollectorAssignmentPage';
import UsersManagementPage from './pages/admin/UsersManagementPage';
import PlasticTypesPage from './pages/admin/PlasticTypesPage';
import PickupsManagementPage from './pages/admin/PickupsManagementPage';
import RewardsManagementPage from './pages/admin/RewardsManagementPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden">
        {user && !isAuthPage && location.pathname !== '/' && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected User Routes */}
            <Route element={<RoleRoute allowedRoles={['USER']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/request-pickup" element={<RequestPickupPage />} />
              <Route path="/my-pickups" element={<MyPickupsPage />} />
              <Route path="/recycling-history" element={<RecyclingHistoryPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/rewards/history" element={<RedemptionHistoryPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/impact" element={<ImpactDashboardPage />} />
            </Route>

            {/* Protected Collector Routes */}
            <Route element={<RoleRoute allowedRoles={['COLLECTOR']} />}>
              <Route path="/collector/dashboard" element={<CollectorDashboard />} />
              <Route path="/collector/pickups" element={<CollectorPickupsPage />} />
              <Route path="/collector/history" element={<CollectorHistoryPage />} />
            </Route>

            {/* Protected Recycler Routes */}
            <Route element={<RoleRoute allowedRoles={['RECYCLER']} />}>
              <Route path="/recycler/dashboard" element={<RecyclerDashboard />} />
              <Route path="/recycler/materials" element={<RecyclerMaterialsPage />} />
              <Route path="/recycler/history" element={<RecyclerHistoryPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/assign-collectors" element={<CollectorAssignmentPage />} />
              <Route path="/admin/users" element={<UsersManagementPage />} />
              <Route path="/admin/plastic-types" element={<PlasticTypesPage />} />
              <Route path="/admin/pickups" element={<PickupsManagementPage />} />
              <Route path="/admin/rewards" element={<RewardsManagementPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            </Route>

            {/* Common Protected Profile Route */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
};

export default App;
