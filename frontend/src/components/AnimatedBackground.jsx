// import React from 'react';

// const AnimatedBackground = ({ children }) => {
//   return (
//     <div className="relative flex items-center justify-center h-[55rem] w-full overflow-hidden p-4">
//       {/* Gradient BG */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 animate-gradient-x"></div>

//       {/* Floating particles */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full animate-float"
//             style={{
//               width: Math.floor(Math.random() * 20 + 5) + 'px',
//               height: Math.floor(Math.random() * 20 + 5) + 'px',
//               top: Math.random() * 100 + '%',
//               left: Math.random() * 100 + '%',
//               background: 'rgba(255,255,255,0.1)',
//               animationDuration: `${Math.random() * 10 + 10}s`,
//               animationDelay: `${Math.random() * 5}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Glowing Orbs */}
//       <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
//       <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

//       {/* Page Content */}
//       {children}
//     </div>
//   );
// };

// export default AnimatedBackground;

import React from 'react';

const AnimatedBackground = ({ children }) => {
  return (
    <div className="relative flex items-center justify-center h-screen w-full overflow-hidden p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 animate-gradient-x"></div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.floor(Math.random() * 20 + 5) + 'px',
              height: Math.floor(Math.random() * 20 + 5) + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              background: 'rgba(255,255,255,0.1)',
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

      {children}
    </div>
  );
};

export default AnimatedBackground;
