import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlacholder from './NoChatHistoryPlacholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingkeleton';

const ChatContainer = () => {
  const { getMessagesByUserId, messages, selectedUser, isMessagesLoading } =
    useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-900/70">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.senderId === authUser._id
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`chat-bubble relative rounded-xl p-3 max-w-xs md:max-w-md ${
                    msg.senderId === authUser._id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && (
                    <p className="mt-2 flex flex-col">
                      {msg.text}
                      <span className="text-xs text-slate-400 mt-1 self-end">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoChatHistoryPlacholder name={selectedUser?.fullName} />
        )}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
