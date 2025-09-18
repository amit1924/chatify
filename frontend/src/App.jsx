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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center relative overflow-hidden">
      {/* Neon grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Soft glow spots */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-500/30 blur-[120px]" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-400/30 blur-[120px]" />

      {/* Main content container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 min-h-[80vh] flex flex-col">
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
              element={!authUser ? <SignupPage /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </div>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </div>
  );
}

export default App;
