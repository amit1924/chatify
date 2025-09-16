import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import NoChatFound from './NoChatFound';

const ChatList = () => {
  const { getMyChatPartners, chats, isUserLoading, setSelectedUser } =
    useChatStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUserLoading) {
    return (
      <div className="p-4 bg-slate-900 shadow-lg rounded-xl">
        <UserLoadingSkeleton />
      </div>
    );
  }

  if (chats.length === 0) {
    return <NoChatFound />;
  }

  return (
    <div className="space-y-3 p-2">
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
          className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl shadow-md hover:bg-slate-700 cursor-pointer transition-all duration-200"
        >
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500">
            <img
              src={chat.profilePic || '/hacker.png'}
              alt={chat.fullName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Chat Info */}
          <div className="flex-1">
            <h4 className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
