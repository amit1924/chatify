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

  if (!selectedUser) return null;

  return (
    <header className="flex items-center justify-between border-b border-gray-700 bg-gray-800/90 px-4 py-3 shadow-md">
      {/* Avatar + Status */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.profilePic || '/avatar.png'}
            alt={selectedUser.fullName || 'User'}
            className="h-10 w-10 rounded-full object-cover shadow"
          />
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-800 ${
              isOnline ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
        </div>

        {/* Name & Status */}
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-white">
            {selectedUser.fullName || 'Unknown User'}
          </h3>
          <span
            className={`text-sm ${
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
        aria-label="Close chat"
        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
      >
        <X className="h-5 w-5" />
      </button>
    </header>
  );
};

export default ChatHeader;
