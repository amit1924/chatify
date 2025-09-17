import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useAuthStore } from './store/useAuthStore';
import PageLoader from './components/PageLoader';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
      {/* Glowing background blobs */}
      <div className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-300px] right-[-250px] w-[700px] h-[700px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
      <div className="absolute top-[25%] left-[35%] w-[500px] h-[500px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full md:h-[90vh] md:max-w-7xl p-0 md:p-6 rounded-none md:rounded-3xl shadow-2xl bg-slate-800/80 backdrop-blur-xl border-0 md:border border-slate-700 flex">
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
        <Toaster />
      </div>
    </div>
  );
};

export default App;
