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
      <div className="px-4 py-6">
        <UserLoadingSkeleton />
      </div>
    );
  }

  if (!chats?.length) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        <NoChatFound />
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-700 overflow-y-auto">
      {chats.map((chat) => {
        const isOnline = onlineUsers?.includes(chat._id);

        return (
          <button
            key={chat._id}
            type="button"
            onClick={() => setSelectedUser(chat)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-700/50"
          >
            {/* Avatar + Status */}
            <div className="relative">
              <img
                src={chat.profilePic || '/hacker.png'}
                alt={chat.fullName || 'User'}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-cyan-400 shadow"
              />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-800 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
            </div>

            {/* Name */}
            <h4 className="truncate text-sm font-medium text-white">
              {chat.fullName}
            </h4>
          </button>
        );
      })}
    </div>
  );
};

export default ChatsList;
