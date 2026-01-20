import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/useAuth";
import NotFound from "pages/NotFound";
import PartnerManagement from './pages/partner-management';
import InventoryManagement from './pages/inventory-management';
import ComplianceTracking from './pages/compliance-tracking';
import Login from './pages/login';
import AnalyticsAndReporting from './pages/analytics-and-reporting';
import ExecutiveDashboard from './pages/executive-dashboard';
import PartnerPortal from './pages/partner-portal';
import QuoteGeneration from './pages/quote-generation';
import DealManagement from './pages/deal-management';
import Profile from './pages/profile';
import Settings from './pages/settings';
import DistributorRegistration from './pages/distributor-registration';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Routes = () => {
  return (
    <BrowserRouter basename="/Disti-Supper-App">
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<DistributorRegistration />} />
            <Route
              path="/partner-management"
              element={
                <ProtectedRoute>
                  <PartnerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory-management"
              element={
                <ProtectedRoute>
                  <InventoryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compliance-tracking"
              element={
                <ProtectedRoute>
                  <ComplianceTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics-and-reporting"
              element={
                <ProtectedRoute>
                  <AnalyticsAndReporting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/executive-dashboard"
              element={
                <ProtectedRoute>
                  <ExecutiveDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner-portal"
              element={
                <ProtectedRoute>
                  <PartnerPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quote-generation"
              element={
                <ProtectedRoute>
                  <QuoteGeneration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deal-management"
              element={
                <ProtectedRoute>
                  <DealManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
