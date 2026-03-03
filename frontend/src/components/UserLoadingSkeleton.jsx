import React from 'react';

const UserLoadingSkeleton = () => {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 animate-pulse bg-slate-800/40 p-3 rounded-xl"
        >
          {/* Avatar Circle */}
          <div className="w-12 h-12 rounded-full bg-slate-700"></div>

          {/* Text placeholders */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserLoadingSkeleton;
