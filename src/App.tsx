import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { LoginForm } from './components/auth/login-form';
import { SignupForm } from './components/auth/signup-form';
import { ProfileEditForm } from './components/auth/profile-edit-form';
import { EventList } from './components/events/event-list';
import { Dashboard } from './components/dashboard/Dashboard';
import { EditEvent } from './components/events/edit-event';
import { useAuthStore } from './store/auth-store';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Home } from './components/home/Home';
import { CreateEvent } from './components/events/CreateEvent';
import { ModalProvider } from './contexts/modal-context';
import { LoadingState } from './components/common/LoadingState';

function App() {
  const { t } = useTranslation();
  const { initialize, isInitialized } = useAuthStore();

  React.useEffect(() => {
    console.log('App mounting...');
    try {
      initialize();
      console.log('Initialization complete');
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }, [initialize]);

  if (!isInitialized) {
    return <LoadingState type="auth" />;
  }

  return (
    <ModalProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              
              {/* Protected Routes */}
              <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
              <Route path="/events/new" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditForm /></ProtectedRoute>} />
              <Route path="/events/:id/edit" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('errors.notFound.title')}</h2>
                  <p className="text-gray-600">{t('errors.notFound.message')}</p>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ModalProvider>
  );
}

export default App;