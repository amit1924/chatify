// import { Navigate, Route, Routes } from 'react-router';
// import ChatPage from './pages/ChatPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import { useAuthStore } from './store/useAuthStore';
// import { useEffect } from 'react';
// import PageLoader from './components/PageLoader';

// import { Toaster } from 'react-hot-toast';

// function App() {
//   const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   if (isCheckingAuth) return <PageLoader />;

//   return (
//     <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
//       {/* DECORATORS - GRID BG & GLOW SHAPES */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
//       <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
//       <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

//       <Routes>
//         <Route
//           path="/"
//           element={authUser ? <ChatPage /> : <Navigate to={'/login'} />}
//         />
//         <Route
//           path="/login"
//           element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}
//         />
//         <Route
//           path="/signup"
//           element={!authUser ? <SignupPage /> : <Navigate to={'/'} />}
//         />
//       </Routes>

//       <Toaster />
//     </div>
//   );
// }
// export default App;

import { Navigate, Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import PageLoader from './components/PageLoader';
import { Toaster } from 'react-hot-toast';

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-4 overflow-hidden">
      {/* NEON GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff1a_1px,transparent_1px),linear-gradient(to_bottom,#ff00ff1a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* NEON GLOW SHAPES */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-pink-500 opacity-30 blur-[120px]" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-cyan-400 opacity-30 blur-[120px]" />

      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to={'/'} />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
