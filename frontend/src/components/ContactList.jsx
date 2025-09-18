import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import NoChatFound from './NoChatFound';

const ContactList = () => {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) {
    return (
      <div className="px-4 py-6">
        <UserLoadingSkeleton />
      </div>
    );
  }

  if (!allContacts?.length) {
    return <NoChatFound message="No contacts found 😢" />;
  }

  return (
    <div className="flex flex-col divide-y divide-gray-700 overflow-y-auto">
      {allContacts.map((user) => {
        const isOnline = onlineUsers?.includes(user._id);

        return (
          <button
            key={user._id}
            type="button"
            onClick={() => setSelectedUser(user)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-700/50"
          >
            {/* Avatar with online/offline dot */}
            <div className="relative">
              <img
                src={user.profilePic || '/avatar.png'}
                alt={user.fullName || 'User'}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-cyan-400 shadow"
              />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-800 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
            </div>

            {/* Contact Info */}
            <h4 className="truncate text-sm font-medium text-white">
              {user.fullName}
            </h4>
          </button>
        );
      })}
    </div>
  );
};

export default ContactList;
