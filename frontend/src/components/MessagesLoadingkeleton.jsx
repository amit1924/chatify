import React from 'react';

const MessagesLoadingSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className={`flex ${
            i % 4 === 0 ? 'justify-start' : 'justify-end'
          } animate-pulse`}
        >
          <div className="bg-slate-700 rounded-xl h-12 w-48"></div>
        </div>
      ))}
    </div>
  );
};

export default MessagesLoadingSkeleton;
