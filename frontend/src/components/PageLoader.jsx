import React from 'react';
import { Loader2 } from 'lucide-react'; // Lucide spinner icon

const PageLoader = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Spinner */}
      <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mb-6" />

      {/* Text with glow */}
      <h2 className="text-2xl font-semibold text-slate-100 animate-pulse tracking-wide">
        Loading, please wait...
      </h2>

      {/* Subtle glowing dot loader */}
      <div className="flex mt-6 space-x-2">
        <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default PageLoader;
