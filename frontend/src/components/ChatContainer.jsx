import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingkeleton';

const ChatContainer = () => {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
    typingStatus,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();

  const messageEndRef = useRef(null);
  const [prevLength, setPrevLength] = useState(0);

  // Fetch & subscribe when user changes
  useEffect(() => {
    if (!selectedUser) return;

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    subscribeToTyping();

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromTyping();
    };
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
  ]);

  // Scroll to bottom on messages change
  useEffect(() => {
    if (!messageEndRef.current) return;

    const isNewMessage = messages.length > prevLength;
    const behavior = isNewMessage ? 'smooth' : 'auto';

    const timeout = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ block: 'end', behavior });
    }, 0);

    setPrevLength(messages.length);
    return () => clearTimeout(timeout);
  }, [messages, prevLength]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Select a chat to start messaging
      </div>
    );
  }

  const isUserTyping = typingStatus[selectedUser._id];

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      {/* Messages */}
      <div
        id="messages"
        className="flex-1 px-6 py-8 overflow-y-auto overflow-x-hidden"
      >
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isSender = msg.senderId === authUser._id;
              const isOnline = onlineUsers.includes(msg.senderId);

              return (
                <div
                  key={msg._id}
                  className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}
                >
                  <div
                    className={`chat-bubble relative break-words whitespace-pre-wrap max-w-full ${
                      isSender
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
                      <p className="mt-2 break-words whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}
                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {!isSender && (
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            isOnline ? 'bg-green-500' : 'bg-gray-500'
                          } ml-2`}
                        />
                      )}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Scroll target */}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Typing indicator */}
      {isUserTyping && (
        <div className="px-6 py-2">
          <div className="chat-bubble bg-slate-700 text-slate-200 animate-pulse max-w-xs">
            {selectedUser.fullName} is typing...
          </div>
        </div>
      )}

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
