// // import React, { useState } from 'react';
// // import { useAuthStore } from '../store/useAuthStore';
// // import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
// // import AnimatedBackground from '../components/AnimatedBackground';
// // import AnimatedCard from '../components/AnimatedCard';
// // import { Link } from 'react-router';

// // const LoginPage = () => {
// //   const [formData, setFormData] = useState({
// //     email: '',
// //     password: '',
// //   });
// //   const [showPassword, setShowPassword] = useState(false);

// //   const { login, isLoggingIn } = useAuthStore();

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     await login(formData);
// //   };

// //   return (
// //     <AnimatedBackground>
// //       <AnimatedCard className="max-w-md w-full p-6 sm:p-8 space-y-6">
// //         {/* Header */}
// //         <div className="text-center">
// //           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
// //           <p className="text-gray-300">
// //             Sign in to continue chatting with your friends!
// //           </p>
// //         </div>

// //         {/* Form */}
// //         <form onSubmit={handleSubmit} className="space-y-5">
// //           {/* Email */}
// //           <div className="flex flex-col">
// //             <label className="text-gray-300 mb-1">Email</label>
// //             <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
// //               <Mail className="text-gray-400 w-5 h-5 mr-2" />
// //               <input
// //                 type="email"
// //                 name="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="john@example.com"
// //                 className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Password */}
// //           <div className="flex flex-col">
// //             <label className="text-gray-300 mb-1">Password</label>
// //             <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
// //               <Lock className="text-gray-400 w-5 h-5 mr-2" />
// //               <input
// //                 type={showPassword ? 'text' : 'password'}
// //                 name="password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="********"
// //                 className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => setShowPassword(!showPassword)}
// //                 className="ml-2 text-gray-400 hover:text-white transition-colors"
// //               >
// //                 {showPassword ? (
// //                   <EyeOff className="w-5 h-5" />
// //                 ) : (
// //                   <Eye className="w-5 h-5" />
// //                 )}
// //               </button>
// //             </div>
// //           </div>

// //           {/* Submit Button */}
// //           <button
// //             type="submit"
// //             disabled={isLoggingIn}
// //             className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
// //           >
// //             {isLoggingIn && <Loader2 className="w-5 h-5 animate-spin" />}
// //             {isLoggingIn ? 'Signing In...' : 'Sign In'}
// //           </button>
// //         </form>

// //         {/* Footer */}
// //         <div className="text-center text-gray-400">
// //           Don’t have an account?{' '}
// //           <Link
// //             to="/signup"
// //             className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
// //           >
// //             Create one
// //           </Link>
// //         </div>
// //       </AnimatedCard>
// //     </AnimatedBackground>
// //   );
// // };

// // export default LoginPage;

// import React, { useState } from 'react';
// import { useAuthStore } from '../store/useAuthStore';
// import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import AnimatedBackground from '../components/AnimatedBackground';
// import AnimatedCard from '../components/AnimatedCard';
// import { Link } from 'react-router';

// const LoginPage = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const { login, isLoggingIn } = useAuthStore();

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await login(formData);
//   };

//   return (
//     <AnimatedBackground>
//       <AnimatedCard>
//         {/* Header */}
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//           <p className="text-gray-300">
//             Sign in to continue chatting with your friends!
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Email */}
//           <div>
//             <label className="block text-gray-300 mb-1">Email</label>
//             <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
//               <Mail className="text-gray-400 w-5 h-5 mr-2" />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="john@example.com"
//                 className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-gray-300 mb-1">Password</label>
//             <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
//               <Lock className="text-gray-400 w-5 h-5 mr-2" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="********"
//                 className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((p) => !p)}
//                 className="ml-2 text-gray-400 hover:text-white transition-colors"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isLoggingIn}
//             className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
//           >
//             {isLoggingIn && <Loader2 className="w-5 h-5 animate-spin" />}
//             {isLoggingIn ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="text-center text-gray-400 mt-4">
//           Don’t have an account?{' '}
//           <Link
//             to="/signup"
//             className="text-purple-400 hover:text-purple-300 font-medium"
//           >
//             Create one
//           </Link>
//         </div>
//       </AnimatedCard>
//     </AnimatedBackground>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-700 opacity-20"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Left side - Branding and illustration */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative">
        <motion.div
          className="flex items-center gap-2 text-white text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MessageCircle className="h-8 w-8 text-purple-300" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
            Chatify
          </span>
        </motion.div>

        <motion.div
          className="max-w-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            WELCOME <span className="text-purple-300">BACK</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            We're thrilled to have you back! Continue your conversations and
            stay connected with your friends and community.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              'Instant messaging with real-time updates',
              'Secure end-to-end encryption',
              'Group chats and media sharing',
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex gap-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <span>© 2025 Chatify</span>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
        </motion.div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-900/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              <div className="relative">
                <MessageCircle className="h-12 w-12 text-purple-400" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-5 w-5 text-pink-400" />
                </motion.div>
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in to continue your conversations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Email
              </label>
              <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 border border-gray-700/50 transition-all">
                <Mail className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Password
              </label>
              <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 border border-gray-700/50 transition-all">
                <Lock className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="text-right mt-2">
                <a
                  href="#"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all disabled:opacity-60 mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {isLoggingIn && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            className="flex items-center my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <div className="flex-1 h-px bg-gray-700"></div>

            <div className="flex-1 h-px bg-gray-700"></div>
          </motion.div>

          {/* Social login options */}
          {/* <motion.div
            className="grid grid-cols-2 gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.984 1.819-.631l.388.726c-2.591 2.927-6.466 2.085-4.25-1.779zm6.586-4.863c-1.819-1.825-2.53-1.648-3.59-.963l.734.867c.603-.484 1.244-.889 1.935-1.176-1.265.736-2.011 1.786-2.011 2.991 0 1.175.779 2.169 1.802 2.414.646.124 1.725-.083 2.536-.82l.734.865c-1.063.685-2.487 1.077-3.744.958-2.342-.218-3.954-2.142-3.734-4.434.219-2.292 2.18-3.957 4.522-3.739 1.257.118 2.462.61 3.387 1.422l-.751-.885z" />
              </svg>
              Google
            </button>
          </motion.div> */}

          <motion.p
            className="text-center text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
