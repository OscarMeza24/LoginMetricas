import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './services/graphqlClient';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPage from './pages/ForgotPage';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import UsersPage from './pages/UsersPage';

function PrivateRoute({ children }) {
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  return isSignedIn ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  return isSignedIn ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Cargando LoginMetricas…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot"
        element={
          <PublicRoute>
            <ForgotPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ApolloProvider>
  );
}
