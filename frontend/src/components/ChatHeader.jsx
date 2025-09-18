import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore'; // ✅ get onlineUsers
import { X } from 'lucide-react';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') setSelectedUser(null);
    };
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [setSelectedUser]);

  const isOnline = selectedUser && onlineUsers?.includes(selectedUser._id);

  return (
    <header className="flex items-center w-full bg-[#0e0e0e]/80 backdrop-blur-md border-b border-cyan-400/30 px-3 sm:px-5 py-2 sm:py-3">
      {/* Avatar + Status */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-cyan-400">
          <img
            src={selectedUser?.profilePic || '/avatar.png'}
            alt={selectedUser?.fullName || 'User'}
            className="w-full h-full object-cover"
          />
          {/* Online / offline dot */}
          <span
            className={`absolute bottom-1 right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ring-2 ring-[#0e0e0e] ${
              isOnline ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
        </div>

        {/* Name & Status */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-gray-100 font-medium text-sm sm:text-base truncate">
            {selectedUser?.fullName || 'Unknown User'}
          </h3>
          <span
            className={`text-xs sm:text-sm ${
              isOnline ? 'text-green-400' : 'text-gray-400'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="ml-auto p-1.5 sm:p-2 rounded-md hover:bg-white/5 transition-colors"
        aria-label="Close chat"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-gray-200" />
      </button>
    </header>
  );
};

export default ChatHeader;
