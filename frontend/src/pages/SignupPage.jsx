// // import React, { useState } from 'react';
// // import { useAuthStore } from '../store/useAuthStore';
// // import { Loader2, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
// // import AnimatedBackground from '../components/AnimatedBackground';
// // import AnimatedCard from '../components/AnimatedCard';
// // import { Link, useNavigate } from 'react-router';
// // import toast from 'react-hot-toast';

// // const SignupPage = () => {
// //   const [formData, setFormData] = useState({
// //     fullName: '',
// //     email: '',
// //     password: '',
// //   });
// //   const [showPassword, setShowPassword] = useState(false);

// //   const { signup, isSigningUp } = useAuthStore();
// //   const navigate = useNavigate(); // for redirect

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const success = await signup(formData); // assume signup returns true/false
// //     if (success) {
// //       toast.success('Account created! Please login.');
// //       navigate('/login'); // redirect to login page
// //     }
// //   };

// //   return (
// //     <AnimatedBackground>
// //       <AnimatedCard>
// //         <div className="text-center mb-6">
// //           <h2 className="text-3xl font-bold text-white mb-2">Chatify</h2>
// //           <p className="text-gray-300">
// //             Create your account to start chatting with friends!
// //           </p>
// //         </div>

// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           {/* Full Name */}
// //           <div>
// //             <label className="block text-gray-300 mb-1">Full Name</label>
// //             <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
// //               <User className="text-gray-400 w-5 h-5 mr-2" />
// //               <input
// //                 type="text"
// //                 name="fullName"
// //                 value={formData.fullName}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="John Doe"
// //                 className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Email */}
// //           <div>
// //             <label className="block text-gray-300 mb-1">Email</label>
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
// //           <div>
// //             <label className="block text-gray-300 mb-1">Password</label>
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
// //             disabled={isSigningUp}
// //             className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
// //           >
// //             {isSigningUp && <Loader2 className="w-5 h-5 animate-spin" />}
// //             {isSigningUp ? 'Creating Account...' : 'Create Account'}
// //           </button>
// //         </form>

// //         {/* Footer */}
// //         <div className="text-center text-gray-400 mt-4">
// //           Already have an account?{' '}
// //           <Link
// //             to="/login"
// //             className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
// //           >
// //             Sign in
// //           </Link>
// //         </div>
// //       </AnimatedCard>
// //     </AnimatedBackground>
// //   );
// // };

// // export default SignupPage;

// import React, { useState } from 'react';
// import { useAuthStore } from '../store/useAuthStore';
// import { Loader2, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
// import AnimatedBackground from '../components/AnimatedBackground';
// import AnimatedCard from '../components/AnimatedCard';
// import { Link, useNavigate } from 'react-router';
// import toast from 'react-hot-toast';

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);

//   const { signup, isSigningUp } = useAuthStore();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await signup(formData);
//     if (success) {
//       toast.success('Account created! Please login.');
//       navigate('/login');
//     }
//   };

//   return (
//     <AnimatedBackground>
//       <AnimatedCard>
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-white mb-2">Chatify</h2>
//           <p className="text-gray-300">
//             Create your account to start chatting with friends!
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Full Name */}
//           <div>
//             <label className="block text-gray-300 mb-1">Full Name</label>
//             <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
//               <User className="text-gray-400 w-5 h-5 mr-2" />
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 required
//                 placeholder="John Doe"
//                 className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
//               />
//             </div>
//           </div>

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
//                 onClick={() => setShowPassword(!showPassword)}
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

//           <button
//             type="submit"
//             disabled={isSigningUp}
//             className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
//           >
//             {isSigningUp && <Loader2 className="w-5 h-5 animate-spin" />}
//             {isSigningUp ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>

//         <div className="text-center text-gray-400 mt-4">
//           Already have an account?{' '}
//           <Link
//             to="/login"
//             className="text-purple-400 hover:text-purple-300 font-medium"
//           >
//             Sign in
//           </Link>
//         </div>
//       </AnimatedCard>
//     </AnimatedBackground>
//   );
// };

// export default SignupPage;
import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(formData);
    if (success) {
      toast.success('Account created successfully! Welcome to Chatify.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden">
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

      {/* Left side - Branding and preview */}
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
            CHAT <span className="text-purple-300">APPLICATION</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Experience real-time conversations with a sleek, futuristic
            interface. Dive into a whole new way of chatting with friends and
            colleagues.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold shadow-lg"
          >
            <Link to="/login">Get Started</Link>{' '}
            <span className="text-xl">→</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button className="text-gray-300 hover:text-white transition-colors text-sm">
            Save
          </button>
          <button className="text-gray-300 hover:text-white transition-colors text-sm">
            Delete
          </button>
        </motion.div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-9 lg:p-12 ">
        <motion.div
          className="w-full max-w-sm md:max-w-md  bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-900/30"
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
            <h1 className="text-3xl font-bold text-white mb-2">Chatify</h1>
            <p className="text-gray-400">
              Create your account and start chatting instantly!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Full Name
              </label>
              <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 border border-gray-700/50 transition-all">
                <User className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
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
              transition={{ duration: 0.4, delay: 0.5 }}
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
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSigningUp}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all disabled:opacity-60 mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {isSigningUp && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSigningUp ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <motion.p
            className="text-center text-gray-400 mt-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
