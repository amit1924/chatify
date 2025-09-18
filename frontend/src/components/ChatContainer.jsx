// import { useEffect, useRef } from 'react';
// import { useAuthStore } from '../store/useAuthStore';
// import { useChatStore } from '../store/useChatStore';
// import ChatHeader from './ChatHeader';
// import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
// import MessageInput from './MessageInput';
// import MessagesLoadingSkeleton from './MessagesLoadingkeleton';

// function ChatContainer() {
//   const {
//     selectedUser,
//     getMessagesByUserId,
//     messages,
//     isMessagesLoading,
//     // subscribeToMessages,
//     // unsubscribeFromMessages,
//   } = useChatStore();
//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     getMessagesByUserId(selectedUser._id);
//     // subscribeToMessages();

//     // clean up
//     // return () => unsubscribeFromMessages();
//   }, [
//     selectedUser,
//     getMessagesByUserId,
//     // subscribeToMessages,
//     // unsubscribeFromMessages,
//   ]);

//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   return (
//     <>
//       <ChatHeader />
//       <div className="flex-1 px-6 overflow-y-auto py-8">
//         {messages.length > 0 && !isMessagesLoading ? (
//           <div className="max-w-3xl mx-auto space-y-6">
//             {messages.map((msg) => (
//               <div
//                 key={msg._id}
//                 className={`chat ${
//                   msg.senderId === authUser._id ? 'chat-end' : 'chat-start'
//                 }`}
//               >
//                 <div
//                   className={`chat-bubble relative ${
//                     msg.senderId === authUser._id
//                       ? 'bg-cyan-600 text-white'
//                       : 'bg-slate-800 text-slate-200'
//                   }`}
//                 >
//                   {msg.image && (
//                     <img
//                       src={msg.image}
//                       alt="Shared"
//                       className="rounded-lg h-48 object-cover"
//                     />
//                   )}
//                   {msg.text && <p className="mt-2">{msg.text}</p>}
//                   <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
//                     {new Date(msg.createdAt).toLocaleTimeString(undefined, {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}
//             {/* 👇 scroll target */}
//             <div ref={messageEndRef} />
//           </div>
//         ) : isMessagesLoading ? (
//           <MessagesLoadingSkeleton />
//         ) : (
//           <NoChatHistoryPlaceholder name={selectedUser.fullName} />
//         )}
//       </div>

//       <MessageInput />
//     </>
//   );
// }

// export default ChatContainer;

// import { useEffect, useRef } from 'react';
// import { useAuthStore } from '../store/useAuthStore';
// import { useChatStore } from '../store/useChatStore';
// import ChatHeader from './ChatHeader';
// import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
// import MessageInput from './MessageInput';
// import MessagesLoadingSkeleton from './MessagesLoadingkeleton';

// function ChatContainer() {
//   const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } =
//     useChatStore();
//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     if (selectedUser?._id) {
//       getMessagesByUserId(selectedUser._id);
//     }
//   }, [selectedUser, getMessagesByUserId]);

//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   return (
//     <>
//       <ChatHeader />

//       {/* Chat messages container */}
//       <div className="flex-1 px-6 overflow-y-auto overflow-x-hidden py-8">
//         {messages.length > 0 && !isMessagesLoading ? (
//           <div className="max-w-3xl mx-auto space-y-6">
//             {messages.map((msg) => (
//               <div
//                 key={msg._id}
//                 className={`chat ${
//                   msg.senderId === authUser._id ? 'chat-end' : 'chat-start'
//                 }`}
//               >
//                 <div
//                   className={`chat-bubble relative break-words whitespace-pre-wrap max-w-full
//                     ${
//                       msg.senderId === authUser._id
//                         ? 'bg-cyan-600 text-white'
//                         : 'bg-slate-800 text-slate-200'
//                     }`}
//                 >
//                   {msg.image && (
//                     <img
//                       src={msg.image}
//                       alt="Shared"
//                       className="rounded-lg h-48 object-cover"
//                     />
//                   )}

//                   {msg.text && (
//                     <p className="mt-2 break-words whitespace-pre-wrap">
//                       {msg.text}
//                     </p>
//                   )}

//                   <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
//                     {new Date(msg.createdAt).toLocaleTimeString(undefined, {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}
//             {/* 👇 scroll target */}
//             <div ref={messageEndRef} />
//           </div>
//         ) : isMessagesLoading ? (
//           <MessagesLoadingSkeleton />
//         ) : (
//           <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
//         )}
//       </div>

//       <MessageInput />
//     </>
//   );
// }

// export default ChatContainer;

// import React, { useEffect, useRef } from 'react';
// import { useAuthStore } from '../store/useAuthStore';
// import { useChatStore } from '../store/useChatStore';
// import ChatHeader from './ChatHeader';
// import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
// import MessageInput from './MessageInput';
// import MessagesLoadingSkeleton from './MessagesLoadingkeleton';

// const ChatContainer = () => {
//   const {
//     selectedUser,
//     getMessagesByUserId,
//     messages,
//     isMessagesLoading,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//   } = useChatStore();
//   const { authUser, onlineUsers, socket } = useAuthStore();
//   const messageEndRef = useRef(null);

//   // Fetch messages when selectedUser changes
//   useEffect(() => {
//     if (!selectedUser) return;

//     getMessagesByUserId(selectedUser._id); // load past messages
//     subscribeToMessages(); // subscribe to socket events

//     return () => unsubscribeFromMessages(); // cleanup on unselect
//   }, [
//     selectedUser,
//     getMessagesByUserId,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//   ]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   if (!selectedUser) {
//     return (
//       <div className="flex-1 flex items-center justify-center text-slate-400">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <ChatHeader />

//       {/* Chat messages container */}
//       <div className="flex-1 px-6 overflow-y-auto overflow-x-hidden py-8">
//         {isMessagesLoading ? (
//           <MessagesLoadingSkeleton />
//         ) : messages.length === 0 ? (
//           <NoChatHistoryPlaceholder name={selectedUser.fullName} />
//         ) : (
//           <div className="max-w-3xl mx-auto space-y-6">
//             {messages.map((msg) => {
//               const isSender = msg.senderId === authUser._id;
//               const isOnline = onlineUsers.includes(msg.senderId);

//               return (
//                 <div
//                   key={msg._id}
//                   className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}
//                 >
//                   <div
//                     className={`chat-bubble relative break-words whitespace-pre-wrap max-w-full
//                       ${
//                         isSender
//                           ? 'bg-cyan-600 text-white'
//                           : 'bg-slate-800 text-slate-200'
//                       }`}
//                   >
//                     {msg.image && (
//                       <img
//                         src={msg.image}
//                         alt="Shared"
//                         className="rounded-lg h-48 object-cover"
//                       />
//                     )}

//                     {msg.text && (
//                       <p className="mt-2 break-words whitespace-pre-wrap">
//                         {msg.text}
//                       </p>
//                     )}

//                     <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
//                       {new Date(msg.createdAt).toLocaleTimeString(undefined, {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                       {!isSender && (
//                         <span
//                           className={`inline-block w-2 h-2 rounded-full ${
//                             isOnline ? 'bg-green-500' : 'bg-gray-500'
//                           } ml-2`}
//                         ></span>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//             {/* Scroll target */}
//             <div ref={messageEndRef} />
//           </div>
//         )}
//       </div>

//       {/* Message input */}
//       <MessageInput />
//     </div>
//   );
// };

// export default ChatContainer;

import React, { useEffect, useRef } from 'react';
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

  // Fetch messages & subscribe to messages & typing
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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingStatus]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Select a chat to start messaging
      </div>
    );
  }

  const isUserTyping = typingStatus[selectedUser._id];

  return (
    <div className="flex flex-col h-full relative">
      <ChatHeader />

      {/* Messages & typing container */}
      <div className="flex-1 px-6 overflow-y-auto overflow-x-hidden py-8">
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
                    className={`chat-bubble relative break-words whitespace-pre-wrap max-w-full
                      ${
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

      {/* Typing indicator - fixed above input */}
      {isUserTyping && (
        <div className="absolute bottom-20 left-6 z-10">
          <div className="chat-bubble bg-slate-700 text-slate-200 animate-pulse max-w-xs">
            {selectedUser.fullName} is typing...
          </div>
        </div>
      )}

      {/* Message input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
