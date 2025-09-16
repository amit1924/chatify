import React from 'react';

const AnimatedCard = ({ children }) => {
  return (
    <div className="relative z-10 w-full max-w-md p-[2px] rounded-3xl overflow-hidden">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-[conic-gradient(var(--tw-gradient-stops))] from-purple-500 via-indigo-500 to-purple-500 animate-spin-slow"></div>

      {/* Inner Card */}
      <div className="relative bg-slate-900/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-slate-700/50">
        {children}
      </div>
    </div>
  );
};

export default AnimatedCard;
