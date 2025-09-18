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

  // Fetch messages & subscribe to updates
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

  // Scroll to bottom on new messages without losing focus
  useEffect(() => {
    if (!messageEndRef.current) return;

    const isNewMessage = messages.length > prevLength;
    const behavior = isNewMessage ? 'smooth' : 'auto';

    const activeElement = document.activeElement;

    const timeout = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ block: 'end', behavior });
      // Restore focus if input was active
      if (activeElement && activeElement.tagName === 'INPUT') {
        activeElement.focus({ preventScroll: true });
      }
    }, 50);

    setPrevLength(messages.length);
    return () => clearTimeout(timeout);
  }, [messages, prevLength]);

  if (!selectedUser) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  const isUserTyping = typingStatus[selectedUser._id];

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isSender = msg.senderId === authUser._id;
              const isOnline = onlineUsers.includes(msg.senderId);

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isSender ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`relative max-w-xs rounded-2xl px-4 py-2 shadow-lg break-words whitespace-pre-wrap ${
                      isSender
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="mb-2 max-h-60 w-full rounded-lg object-cover"
                      />
                    )}
                    {msg.text && (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}

                    <p className="mt-1 text-xs text-gray-300 flex items-center gap-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {!isSender && (
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            isOnline ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        />
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Typing indicator */}
      {isUserTyping && (
        <div className="px-4 py-2 text-sm text-gray-400">
          {selectedUser.fullName} is typing…
        </div>
      )}

      {/* Message input */}
      <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
