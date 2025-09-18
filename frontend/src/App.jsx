import { Navigate, Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useAuthStore } from './store/useAuthStore';
import PageLoader from './components/PageLoader';

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Neon grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse pointer-events-none" />

      {/* Soft glow spots */}
      <div className="absolute top-10 left-20 w-32 h-32 rounded-full bg-cyan-500/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-16 w-40 h-40 rounded-full bg-pink-500/30 blur-3xl pointer-events-none" />

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Routes>
          <Route
            path="/"
            element={authUser ? <ChatPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>

      {/* Toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
