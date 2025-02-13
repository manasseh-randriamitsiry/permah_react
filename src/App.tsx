import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/header';
import { LoginForm } from './components/auth/login-form';
import { SignupForm } from './components/auth/signup-form';
import { ProfileEditForm } from './components/auth/profile-edit-form';
import { EventList } from './components/events/event-list';
import { EventForm } from './components/events/event-form';
import { useAuthStore } from './store/auth-store';
import type { EventData } from './types';
import { EventService } from './services/event.service';
import { Dashboard } from './components/dashboard/dashboard';
import { EditEvent } from './components/events/edit-event';
import { useNavigate } from 'react-router-dom';

// Protected Route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
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
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            
            {/* Protected Routes */}
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/new"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <ProfileEditForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Manage Your Events with Ease
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Create, manage, and join events seamlessly with our platform. Perfect for organizers and attendees alike.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/events"
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Browse Events
        </a>
        <a href="/events/new" className="text-sm font-semibold leading-6 text-gray-900">
          Create Event <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

function CreateEvent() {
  const navigate = useNavigate();
  
  const handleSubmit = async (eventData: Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>) => {
    try {
      await EventService.createEvent(eventData);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  return <EventForm onSubmit={handleSubmit} />;
}

export default App;