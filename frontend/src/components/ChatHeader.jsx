import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { X } from 'lucide-react'; // ✅ Lucide X icon

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedUser(null);
      }
    };
    window.addEventListener('keydown', handleEscKey);

    //cleanup function
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex items-center bg-slate-800/70 border-b border-slate-700/50 px-6 py-3 max-h-[84px]">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500">
          <img
            src={selectedUser?.profilePic || '/avatar.png'}
            alt={selectedUser?.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <h3 className="text-slate-200 font-medium truncate">
            {selectedUser?.fullName || 'Unknown User'}
          </h3>
          <p className="text-slate-400 text-sm">Online</p>
        </div>
      </div>

      {/* Close chat button */}
      <button onClick={() => setSelectedUser(null)} className="ml-auto">
        <X className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors" />
      </button>
    </div>
  );
};

export default ChatHeader;
