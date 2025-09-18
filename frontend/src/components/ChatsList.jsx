import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import NoChatFound from './NoChatFound';

const ChatsList = () => {
  const { getMyChatPartners, chats, isUserLoading, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUserLoading) {
    return (
      <div className="p-3 sm:p-4 bg-gray-900/80 rounded-xl shadow-md">
        <UserLoadingSkeleton />
      </div>
    );
  }

  if (!chats?.length) {
    return <NoChatFound />;
  }

  return (
    <div className="flex flex-col gap-2 p-2 sm:p-3">
      {chats.map((chat) => {
        const isOnline = onlineUsers?.includes(chat._id);

        return (
          <button
            key={chat._id}
            type="button"
            onClick={() => setSelectedUser(chat)}
            className="flex items-center gap-3 w-full rounded-xl p-3 sm:p-4 bg-gray-800/70 backdrop-blur-sm shadow hover:bg-gray-700/70 transition-colors"
          >
            {/* Avatar with status */}
            <div className="relative shrink-0">
              <img
                src={chat.profilePic || '/hacker.png'}
                alt={chat.fullName || 'User'}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-cyan-400"
              />
              <span
                className={`absolute bottom-0 right-0 block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ring-2 ring-gray-900 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <h4 className="text-gray-100 text-sm sm:text-base font-medium truncate">
                {chat.fullName}
              </h4>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChatsList;
