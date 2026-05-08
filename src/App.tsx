import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { BottomNav } from '@/components/layout/BottomNav';
import { useNotifications } from '@/hooks/useNotifications';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

// Lazy Pages
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const NewSessionPage = lazy(() => import('@/features/session/NewSessionPage'));
const SessionDetailPage = lazy(() => import('@/features/session/SessionDetailPage'));
const HistoryPage = lazy(() => import('@/features/history/HistoryPage'));
const InsightsPage = lazy(() => import('@/features/insights/InsightsPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));

const AppContent: React.FC = () => {
  useNotifications(); // Initialize notification scheduling

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ErrorBoundary>
        <Suspense fallback={<div className="p-4"><DashboardSkeleton /></div>}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/novo" element={<NewSessionPage />} />
            <Route path="/historico" element={<HistoryPage />} />
            <Route path="/historico/:id" element={<SessionDetailPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
          </Router>
        </ToastProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
