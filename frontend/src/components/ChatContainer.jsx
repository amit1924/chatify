// import React, { useEffect, useRef, useState } from 'react';
// import { useAuthStore } from '../store/useAuthStore';
// import { useChatStore } from '../store/useChatStore';
// import ChatHeader from './ChatHeader';
// import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
// import MessageInput from './MessageInput';
// import MessagesLoadingSkeleton from './MessagesLoadingkeleton';
// // eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';

// const ChatContainer = () => {
//   const {
//     selectedUser,
//     getMessagesByUserId,
//     messages,
//     isMessagesLoading,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//     subscribeToTyping,
//     unsubscribeFromTyping,
//     typingStatus,
//     deleteMessage,
//     editMessage,
//     markAllMessagesFromSelectedAsSeen,
//   } = useChatStore();

//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);

//   const [prevLength, setPrevLength] = useState(0);
//   const [activeMsgId, setActiveMsgId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const [replyTo, setReplyTo] = useState(null);

//   // Create refs for all messages to enable "jump to message"
//   const messageRefs = useRef({});

//   // Load messages & subscribe
//   useEffect(() => {
//     if (!selectedUser) return;

//     (async () => {
//       await getMessagesByUserId(selectedUser._id);
//       await markAllMessagesFromSelectedAsSeen();
//     })();

//     subscribeToMessages();
//     subscribeToTyping();

//     return () => {
//       unsubscribeFromMessages();
//       unsubscribeFromTyping();
//     };
//   }, [
//     selectedUser,
//     getMessagesByUserId,
//     subscribeToMessages,
//     subscribeToTyping,
//     unsubscribeFromMessages,
//     unsubscribeFromTyping,
//     markAllMessagesFromSelectedAsSeen,
//   ]);

//   // Auto-scroll
//   useEffect(() => {
//     if (!messageEndRef.current) return;
//     const isNew = messages.length > prevLength;
//     const t = setTimeout(() => {
//       messageEndRef.current?.scrollIntoView({
//         block: 'end',
//         behavior: isNew ? 'smooth' : 'auto',
//       });
//     }, 40);
//     setPrevLength(messages.length);
//     return () => clearTimeout(t);
//   }, [messages, prevLength]);

//   const isUserTyping = typingStatus[selectedUser?._id];

//   const handleDelete = async (id) => {
//     try {
//       await deleteMessage(id);
//       toast.success('Message deleted');
//       setActiveMsgId(null);
//     } catch {
//       toast.error('Failed to delete');
//     }
//   };

//   const handleEditConfirm = async (id) => {
//     if (!editText.trim()) return setEditingId(null);
//     try {
//       await editMessage(id, editText.trim());
//       toast.success('Message updated');
//       setEditingId(null);
//       setActiveMsgId(null);
//     } catch {
//       toast.error('Failed to edit');
//     }
//   };

//   const parseLink = (text) => {
//     const urlRegex = /(https?:\/\/[^\s]+)/i;
//     const match = text?.match(urlRegex);
//     return match ? match[0] : null;
//   };

//   const renderMessageContent = (msg) => {
//     if (msg.text) {
//       const youtubeMatch = msg.text.match(
//         /(https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11}))/i,
//       );
//       if (youtubeMatch) {
//         const youtubeUrl = youtubeMatch[1];
//         const videoId = youtubeMatch[2];
//         return (
//           <div className="mt-2 flex flex-col gap-1">
//             <iframe
//               width="300"
//               height="170"
//               src={`https://www.youtube.com/embed/${videoId}`}
//               title="YouTube video player"
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               className="rounded-lg"
//             />
//             <a
//               href={youtubeUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-cyan-400 hover:underline"
//             >
//               ▶️ Watch on YouTube
//             </a>
//           </div>
//         );
//       }
//     }

//     const link = parseLink(msg.text);
//     if (link) {
//       return (
//         <a
//           href={link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="block mt-2 p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
//         >
//           <p className="text-sm text-cyan-300 break-all">{link}</p>
//           <p className="text-xs text-gray-400">🌍 External Link</p>
//         </a>
//       );
//     }

//     if (msg.image) {
//       return (
//         <img
//           src={msg.image}
//           alt="sent"
//           className="mt-2 rounded-lg max-w-[200px] object-cover"
//         />
//       );
//     }

//     return <p>{msg.text}</p>;
//   };

//   const renderReadReceipt = (msg) => {
//     if (msg.senderId !== authUser._id) return null;
//     if (msg.seenBy?.length > 0)
//       return <span className="text-xs text-cyan-400 ml-2">✓✓</span>;
//     if (msg.deliveredTo?.length > 0)
//       return <span className="text-xs text-gray-400 ml-2">✓</span>;
//     return null;
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   // Scroll to message function
//   const scrollToMessage = (msgId) => {
//     if (messageRefs.current[msgId]) {
//       messageRefs.current[msgId].scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });
//       messageRefs.current[msgId].classList.add('ring-2', 'ring-cyan-400');
//       setTimeout(() => {
//         messageRefs.current[msgId]?.classList.remove('ring-2', 'ring-cyan-400');
//       }, 1500);
//     }
//   };

//   return (
//     <div className="relative flex h-full flex-col bg-gray-900 text-white">
//       <ChatHeader />

//       <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4 relative">
//         {isMessagesLoading ? (
//           <MessagesLoadingSkeleton />
//         ) : messages.length === 0 ? (
//           <NoChatHistoryPlaceholder name={selectedUser.fullName} />
//         ) : (
//           <div className="space-y-4">
//             {messages.map((msg) => {
//               const isSender = msg.senderId === authUser._id;
//               const replyMsg = msg.replyTo; // populated reply message

//               return (
//                 <AnimatePresence key={msg._id}>
//                   <motion.div
//                     ref={(el) => (messageRefs.current[msg._id] = el)}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className={`flex ${
//                       isSender ? 'justify-end' : 'justify-start'
//                     }`}
//                     onMouseEnter={() => setActiveMsgId(msg._id)}
//                     onMouseLeave={() => setActiveMsgId(null)}
//                   >
//                     <div
//                       className={`relative max-w-xs break-words rounded-2xl px-4 py-2 shadow-lg whitespace-pre-wrap ${
//                         isSender
//                           ? 'bg-cyan-800 text-white'
//                           : 'bg-slate-800 text-slate-200'
//                       }`}
//                     >
//                       {/* Reply preview */}
//                       {replyMsg && (
//                         <div
//                           onClick={() => scrollToMessage(replyMsg._id)}
//                           className="mb-1 p-2 border-l-4 border-cyan-400 bg-gray-700 text-xs text-gray-300 rounded cursor-pointer hover:bg-gray-600"
//                         >
//                           ↩️ {replyMsg.text || 'Media'}
//                         </div>
//                       )}

//                       {/* Edit mode */}
//                       {editingId === msg._id ? (
//                         <div className="flex items-center gap-2">
//                           <input
//                             value={editText}
//                             onChange={(e) => setEditText(e.target.value)}
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter') handleEditConfirm(msg._id);
//                               if (e.key === 'Escape') setEditingId(null);
//                             }}
//                             autoFocus
//                             className="w-full rounded-md bg-gray-700 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                           />
//                           <button
//                             onClick={() => handleEditConfirm(msg._id)}
//                             className="ml-2 rounded px-2 py-1 text-sm bg-cyan-700"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={() => setEditingId(null)}
//                             className="ml-1 rounded px-2 py-1 text-sm bg-gray-600"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <>{renderMessageContent(msg)}</>
//                       )}

//                       {/* Timestamp + Read receipts */}
//                       <p className="mt-1 text-xs text-gray-300 flex items-center justify-end">
//                         {new Date(msg.createdAt).toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
//                         {renderReadReceipt(msg)}
//                       </p>

//                       {/* Toolbar */}
//                       <AnimatePresence>
//                         {activeMsgId === msg._id && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.9 }}
//                             transition={{ duration: 0.15 }}
//                             className="absolute -top-8 right-0 flex gap-2"
//                           >
//                             {/* Sender can edit/delete */}
//                             {isSender && (
//                               <>
//                                 <button
//                                   className="px-2 py-1 text-xs bg-cyan-600 rounded text-white"
//                                   onClick={() => {
//                                     setEditingId(msg._id);
//                                     setEditText(msg.text || '');
//                                     setActiveMsgId(null);
//                                   }}
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   className="px-2 py-1 text-xs bg-red-600 rounded text-white"
//                                   onClick={() => handleDelete(msg._id)}
//                                 >
//                                   Delete
//                                 </button>
//                               </>
//                             )}

//                             {/* Only incoming messages can be replied to */}
//                             {!isSender && (
//                               <button
//                                 className="px-2 py-1 text-xs bg-blue-600 rounded text-white"
//                                 onClick={() => {
//                                   setReplyTo(msg);
//                                   setActiveMsgId(null);
//                                 }}
//                               >
//                                 Reply
//                               </button>
//                             )}
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   </motion.div>
//                 </AnimatePresence>
//               );
//             })}
//             <div ref={messageEndRef} />
//           </div>
//         )}
//       </div>

//       {isUserTyping && (
//         <div className="px-4 py-2 text-sm text-gray-400">
//           {selectedUser.fullName} is typing…
//         </div>
//       )}

//       <div className="border-t border-gray-700 bg-gray-800 px-4 py-3 relative">
//         <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useAuthStore } from '../store/useAuthStore';
// import { useChatStore } from '../store/useChatStore';
// import ChatHeader from './ChatHeader';
// import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
// import MessageInput from './MessageInput';
// import MessagesLoadingSkeleton from './MessagesLoadingkeleton';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';

// const ChatContainer = () => {
//   const {
//     selectedUser,
//     getMessagesByUserId,
//     messages,
//     isMessagesLoading,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//     subscribeToTyping,
//     unsubscribeFromTyping,
//     typingStatus,
//     deleteMessage,
//     editMessage,
//     markAllMessagesFromSelectedAsSeen,
//     connectionStatus,
//     reconnectWebSocket,
//   } = useChatStore();

//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);
//   const messageContainerRef = useRef(null);

//   const [prevLength, setPrevLength] = useState(0);
//   const [activeMsgId, setActiveMsgId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
//   const [isAtBottom, setIsAtBottom] = useState(true);
//   const [connectionAlert, setConnectionAlert] = useState(false);

//   const messageRefs = useRef({});
//   const scrollTimeoutRef = useRef(null);
//   const typingDebounceRef = useRef(null);

//   // Monitor connection status
//   useEffect(() => {
//     if (connectionStatus === 'disconnected') {
//       setConnectionAlert(true);
//       // Try to reconnect after 3 seconds
//       const timer = setTimeout(() => {
//         reconnectWebSocket();
//       }, 3000);

//       return () => clearTimeout(timer);
//     } else if (connectionStatus === 'connected') {
//       setConnectionAlert(false);
//     }
//   }, [connectionStatus, reconnectWebSocket]);

//   useEffect(() => {
//     if (!selectedUser) return;

//     (async () => {
//       try {
//         await getMessagesByUserId(selectedUser._id);
//         await markAllMessagesFromSelectedAsSeen();
//       } catch (error) {
//         console.error('Error loading messages:', error);
//         toast.error('Failed to load messages');
//       }
//     })();

//     // Subscribe to real-time events with error handling
//     try {
//       subscribeToMessages();
//       subscribeToTyping();
//     } catch (error) {
//       console.error('Error subscribing to events:', error);
//       toast.error('Connection issue. Trying to reconnect...');
//       setTimeout(() => reconnectWebSocket(), 2000);
//     }

//     return () => {
//       unsubscribeFromMessages();
//       unsubscribeFromTyping();
//       if (scrollTimeoutRef.current) {
//         clearTimeout(scrollTimeoutRef.current);
//       }
//       if (typingDebounceRef.current) {
//         clearTimeout(typingDebounceRef.current);
//       }
//     };
//   }, [
//     selectedUser,
//     getMessagesByUserId,
//     subscribeToMessages,
//     subscribeToTyping,
//     unsubscribeFromMessages,
//     unsubscribeFromTyping,
//     markAllMessagesFromSelectedAsSeen,
//     reconnectWebSocket,
//   ]);

//   // Track scroll position
//   const handleScroll = useCallback(() => {
//     if (!messageContainerRef.current) return;

//     const { scrollTop, scrollHeight, clientHeight } =
//       messageContainerRef.current;
//     const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
//     setIsAtBottom(distanceFromBottom <= 100);
//   }, []);

//   // Add scroll event listener
//   useEffect(() => {
//     const container = messageContainerRef.current;
//     if (container) {
//       container.addEventListener('scroll', handleScroll);
//       // Initial check
//       handleScroll();
//       return () => container.removeEventListener('scroll', handleScroll);
//     }
//   }, [handleScroll]);

//   // Mobile-friendly scroll to bottom function
//   const scrollToBottom = useCallback((behavior = 'smooth') => {
//     if (!messageEndRef.current || !messageContainerRef.current) return;

//     // For mobile devices, use a more reliable approach
//     if ('ontouchstart' in window) {
//       if (scrollTimeoutRef.current) {
//         clearTimeout(scrollTimeoutRef.current);
//       }

//       scrollTimeoutRef.current = setTimeout(() => {
//         if (messageContainerRef.current) {
//           messageContainerRef.current.scrollTo({
//             top: messageContainerRef.current.scrollHeight,
//             behavior: behavior,
//           });
//         }
//       }, 100);
//     } else {
//       messageEndRef.current.scrollIntoView({
//         behavior: behavior,
//         block: 'nearest',
//       });
//     }
//   }, []);

//   // Fixed scrolling logic
//   useEffect(() => {
//     if (!messages.length) return;

//     const isNewMessage = messages.length > prevLength;
//     const lastMessage = messages[messages.length - 1];
//     const isFromMe = lastMessage.senderId === authUser._id;

//     // Only auto-scroll if:
//     // 1. New messages were added, AND
//     // 2. Either the message is from me, or I'm already near the bottom
//     if (isNewMessage && (isFromMe || isAtBottom)) {
//       const delay = 'ontouchstart' in window ? 150 : 0;

//       setTimeout(() => {
//         scrollToBottom('smooth');
//       }, delay);
//     }

//     setPrevLength(messages.length);
//   }, [messages, authUser, isAtBottom, prevLength, scrollToBottom]);

//   // Initial scroll to bottom when messages load
//   useEffect(() => {
//     if (messages.length > 0 && !isMessagesLoading) {
//       const delay = 'ontouchstart' in window ? 200 : 50;

//       setTimeout(() => {
//         scrollToBottom('auto');
//       }, delay);
//     }
//   }, [isMessagesLoading, messages.length, scrollToBottom]);

//   // Improved typing status with better debouncing
//   const isUserTyping = typingStatus[selectedUser?._id];
//   const [showTypingIndicator, setShowTypingIndicator] = useState(false);
//   // const typingTimeoutRef = useRef(null);

//   // useEffect(() => {
//   //   if (isUserTyping) {
//   //     setShowTypingIndicator(true);

//   //     if (typingTimeoutRef.current) {
//   //       clearTimeout(typingTimeoutRef.current);
//   //     }

//   //     typingTimeoutRef.current = setTimeout(() => {
//   //       setShowTypingIndicator(false);
//   //     }, 2000);
//   //   } else {
//   //     setShowTypingIndicator(false);
//   //   }

//   //   return () => {
//   //     if (typingTimeoutRef.current) {
//   //       clearTimeout(typingTimeoutRef.current);
//   //     }
//   //   };
//   // }, [isUserTyping]);

//   useEffect(() => {
//     // If user is typing, show indicator
//     if (isUserTyping) {
//       setShowTypingIndicator(true);
//     } else {
//       // Only hide when they actually stop typing
//       setShowTypingIndicator(false);
//     }
//   }, [isUserTyping]);
//   const handleDelete = async (id) => {
//     try {
//       await deleteMessage(id);
//       toast.success('Message deleted');
//       setActiveMsgId(null);
//     } catch {
//       toast.error('Failed to delete');
//     }
//   };

//   const handleEditConfirm = async (id) => {
//     if (!editText.trim()) return setEditingId(null);
//     try {
//       await editMessage(id, editText.trim());
//       toast.success('Message updated');
//       setEditingId(null);
//       setActiveMsgId(null);
//     } catch {
//       toast.error('Failed to edit');
//     }
//   };

//   const parseLink = (text) => {
//     const urlRegex = /(https?:\/\/[^\s]+)/i;
//     const match = text?.match(urlRegex);
//     return match ? match[0] : null;
//   };

//   const renderMessageContent = (msg) => {
//     if (msg.text) {
//       const youtubeMatch = msg.text.match(
//         /(https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11}))/i,
//       );
//       if (youtubeMatch) {
//         const youtubeUrl = youtubeMatch[1];
//         const videoId = youtubeMatch[2];
//         return (
//           <div className="max-w-xs">
//             <iframe
//               className="w-full rounded-lg"
//               height="170"
//               src={`https://www.youtube.com/embed/${videoId}`}
//               title="YouTube video player"
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             />
//             <a
//               href={youtubeUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-400 hover:underline text-sm mt-1 block"
//             >
//               ▶️ Watch on YouTube
//             </a>
//           </div>
//         );
//       }
//     }

//     const link = parseLink(msg.text);
//     if (link) {
//       return (
//         <a
//           href={link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-400 hover:underline"
//         >
//           <p>{link}</p>
//           <p className="text-xs">🌍 External Link</p>
//         </a>
//       );
//     }

//     if (msg.image) {
//       return <img src={msg.image} alt="sent" className="max-w-xs rounded-lg" />;
//     }

//     return <p className="break-words">{msg.text}</p>;
//   };

//   const renderReadReceipt = (msg) => {
//     if (msg.senderId !== authUser._id) return null;
//     if (msg.seenBy?.length > 0)
//       return <span className="ml-1 text-blue-400">✓✓</span>;
//     if (msg.deliveredTo?.length > 0) return <span className="ml-1">✓</span>;
//     return null;
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-900 text-gray-300">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   const scrollToMessage = (msgId) => {
//     if (messageRefs.current[msgId]) {
//       messageRefs.current[msgId].scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-gray-900 relative">
//       {/* Connection status alert */}
//       {connectionAlert && (
//         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
//           <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
//             <svg
//               className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             Connection issue. Reconnecting...
//           </div>
//         </div>
//       )}

//       <ChatHeader />

//       <div
//         ref={messageContainerRef}
//         className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 bg-gray-900 bg-opacity-95"
//       >
//         {isMessagesLoading ? (
//           <MessagesLoadingSkeleton />
//         ) : messages.length === 0 ? (
//           <NoChatHistoryPlaceholder name={selectedUser.fullName} />
//         ) : (
//           <div className="space-y-1 py-2">
//             {messages.map((msg) => {
//               const isSender = msg.senderId === authUser._id;
//               const replyMsg = msg.replyTo;

//               return (
//                 <AnimatePresence key={msg._id}>
//                   <motion.div
//                     ref={(el) => (messageRefs.current[msg._id] = el)}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     onMouseEnter={() => setActiveMsgId(msg._id)}
//                     onMouseLeave={() => setActiveMsgId(null)}
//                     className={`flex ${
//                       isSender ? 'justify-end' : 'justify-start'
//                     }`}
//                   >
//                     <div
//                       className={`relative max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
//                         isSender ? 'bg-green-800' : 'bg-gray-800'
//                       }`}
//                     >
//                       {replyMsg && (
//                         <div
//                           onClick={() => scrollToMessage(replyMsg._id)}
//                           className="text-xs p-2 mb-1 bg-black bg-opacity-30 rounded cursor-pointer border-l-2 border-gray-500"
//                         >
//                           <div className="font-semibold">
//                             {replyMsg.senderId === authUser._id
//                               ? 'You'
//                               : selectedUser.fullName}
//                           </div>
//                           <div className="truncate">
//                             {replyMsg.text || 'Media'}
//                           </div>
//                         </div>
//                       )}

//                       {editingId === msg._id ? (
//                         <div className="flex flex-col space-y-2">
//                           <input
//                             className="bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
//                             value={editText}
//                             onChange={(e) => setEditText(e.target.value)}
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter') handleEditConfirm(msg._id);
//                               if (e.key === 'Escape') setEditingId(null);
//                             }}
//                             autoFocus
//                           />
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleEditConfirm(msg._id)}
//                               className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
//                             >
//                               Save
//                             </button>
//                             <button
//                               onClick={() => setEditingId(null)}
//                               className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>{renderMessageContent(msg)}</>
//                       )}

//                       <div className="flex items-center justify-end mt-1">
//                         <span className="text-xs text-gray-400">
//                           {new Date(msg.createdAt).toLocaleTimeString([], {
//                             hour: '2-digit',
//                             minute: '2-digit',
//                           })}
//                         </span>
//                         {renderReadReceipt(msg)}
//                       </div>

//                       <AnimatePresence>
//                         {activeMsgId === msg._id && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.9 }}
//                             transition={{ duration: 0.15 }}
//                             className={`absolute ${
//                               isSender
//                                 ? '-left-16 sm:-left-20'
//                                 : '-right-16 sm:-right-20'
//                             } top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-lg shadow-lg p-1 flex space-x-1`}
//                           >
//                             {isSender && (
//                               <>
//                                 <button
//                                   onClick={() => {
//                                     setEditingId(msg._id);
//                                     setEditText(msg.text || '');
//                                     setActiveMsgId(null);
//                                   }}
//                                   className="p-1 hover:bg-gray-700 rounded"
//                                   title="Edit"
//                                 >
//                                   <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-4 w-4 sm:h-5 sm:w-5"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                     />
//                                   </svg>
//                                 </button>
//                                 <button
//                                   onClick={() => handleDelete(msg._id)}
//                                   className="p-1 hover:bg-gray-700 rounded"
//                                   title="Delete"
//                                 >
//                                   <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-4 w-4 sm:h-5 sm:w-5"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                     />
//                                   </svg>
//                                 </button>
//                               </>
//                             )}

//                             {!isSender && (
//                               <button
//                                 onClick={() => {
//                                   setReplyTo(msg);
//                                   setActiveMsgId(null);
//                                 }}
//                                 className="p-1 hover:bg-gray-700 rounded"
//                                 title="Reply"
//                               >
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="h-4 w-4 sm:h-5 sm:w-5"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke="currentColor"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
//                                   />
//                                 </svg>
//                               </button>
//                             )}
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   </motion.div>
//                 </AnimatePresence>
//               );
//             })}
//             <div ref={messageEndRef} />
//           </div>
//         )}
//       </div>

//       {showTypingIndicator && (
//         <div className="px-4 py-1 text-sm text-gray-400 italic">
//           {selectedUser.fullName} is typing...
//         </div>
//       )}

//       <div className="border-t border-gray-700 bg-gray-800 relative z-50">
//         <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
    deleteMessage,
    editMessage,
    markAllMessagesFromSelectedAsSeen,
    connectionStatus,
    reconnectWebSocket,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  const [prevLength, setPrevLength] = useState(0);
  const [activeMsgId, setActiveMsgId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [connectionAlert, setConnectionAlert] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const messageRefs = useRef({});
  const scrollTimeoutRef = useRef(null);
  const typingDebounceRef = useRef(null);

  // Helper function to truncate text to approximately 50 words
  const getMessagePreview = (text) => {
    if (!text) return '';

    const words = text.trim().split(/\s+/);
    if (words.length <= 50) {
      return text;
    }

    return words.slice(0, 50).join(' ') + '...';
  };

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Monitor connection status
  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      setConnectionAlert(true);
      const timer = setTimeout(() => {
        reconnectWebSocket();
      }, 3000);

      return () => clearTimeout(timer);
    } else if (connectionStatus === 'connected') {
      setConnectionAlert(false);
    }
  }, [connectionStatus, reconnectWebSocket]);

  useEffect(() => {
    if (!selectedUser) return;

    (async () => {
      try {
        await getMessagesByUserId(selectedUser._id);
        await markAllMessagesFromSelectedAsSeen();
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      }
    })();

    try {
      subscribeToMessages();
      subscribeToTyping();
    } catch (error) {
      console.error('Error subscribing to events:', error);
      toast.error('Connection issue. Trying to reconnect...');
      setTimeout(() => reconnectWebSocket(), 2000);
    }

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromTyping();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }
    };
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    subscribeToTyping,
    unsubscribeFromMessages,
    unsubscribeFromTyping,
    markAllMessagesFromSelectedAsSeen,
    reconnectWebSocket,
  ]);

  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messageContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(distanceFromBottom <= 100);
  }, []);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (!messageEndRef.current || !messageContainerRef.current) return;

    if ('ontouchstart' in window) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTo({
            top: messageContainerRef.current.scrollHeight,
            behavior: behavior,
          });
        }
      }, 100);
    } else {
      messageEndRef.current.scrollIntoView({
        behavior: behavior,
        block: 'nearest',
      });
    }
  }, []);

  useEffect(() => {
    if (!messages.length) return;

    const isNewMessage = messages.length > prevLength;
    const lastMessage = messages[messages.length - 1];
    const isFromMe = lastMessage.senderId === authUser._id;

    if (isNewMessage && (isFromMe || isAtBottom)) {
      const delay = 'ontouchstart' in window ? 150 : 0;
      setTimeout(() => {
        scrollToBottom('smooth');
      }, delay);
    }

    setPrevLength(messages.length);
  }, [messages, authUser, isAtBottom, prevLength, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0 && !isMessagesLoading) {
      const delay = 'ontouchstart' in window ? 200 : 50;
      setTimeout(() => {
        scrollToBottom('auto');
      }, delay);
    }
  }, [isMessagesLoading, messages.length, scrollToBottom]);

  const isUserTyping = typingStatus[selectedUser?._id];
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  useEffect(() => {
    if (isUserTyping) {
      setShowTypingIndicator(true);
    } else {
      setShowTypingIndicator(false);
    }
  }, [isUserTyping]);

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      toast.success('Message deleted');
      setActiveMsgId(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEditConfirm = async (id) => {
    if (!editText.trim()) return setEditingId(null);
    try {
      await editMessage(id, editText.trim());
      toast.success('Message updated');
      setEditingId(null);
      setActiveMsgId(null);
    } catch {
      toast.error('Failed to edit');
    }
  };

  const parseLink = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const match = text?.match(urlRegex);
    return match ? match[0] : null;
  };

  const renderMessageContent = (msg) => {
    const displayText =
      msg.text && msg.text.length > 500 && !expandedMessages[msg._id]
        ? `${msg.text.substring(0, 500)}...`
        : msg.text;

    if (msg.text) {
      const youtubeMatch = msg.text.match(
        /(https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11}))/i,
      );
      if (youtubeMatch) {
        const youtubeUrl = youtubeMatch[1];
        const videoId = youtubeMatch[2];
        return (
          <div className="max-w-xs">
            <iframe
              className="w-full rounded-lg"
              height="170"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm mt-1 block"
            >
              ▶️ Watch on YouTube
            </a>
          </div>
        );
      }
    }

    const link = parseLink(msg.text);
    if (link) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          <p>{link}</p>
          <p className="text-xs">🌍 External Link</p>
        </a>
      );
    }

    if (msg.image) {
      return <img src={msg.image} alt="sent" className="max-w-xs rounded-lg" />;
    }

    return (
      <div>
        <p className="break-words whitespace-pre-wrap">{displayText}</p>
        {msg.text && msg.text.length > 500 && (
          <button
            onClick={() =>
              setExpandedMessages((prev) => ({
                ...prev,
                [msg._id]: !prev[msg._id],
              }))
            }
            className="text-blue-400 text-xs mt-1 hover:underline"
          >
            {expandedMessages[msg._id] ? 'Show less' : 'Show more...'}
          </button>
        )}
      </div>
    );
  };

  const renderReadReceipt = (msg) => {
    if (msg.senderId !== authUser._id) return null;
    if (msg.seenBy?.length > 0)
      return <span className="ml-1 text-blue-400">✓✓</span>;
    if (msg.deliveredTo?.length > 0) return <span className="ml-1">✓</span>;
    return null;
  };

  const scrollToMessage = (msgId) => {
    if (messageRefs.current[msgId]) {
      messageRefs.current[msgId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  // Mobile-friendly action buttons component
  const MessageActions = ({ msg, isSender }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className={`
        ${
          isMobile
            ? 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg shadow-xl p-3 flex space-x-3 z-50 min-w-[200px] justify-center'
            : `absolute ${
                isSender ? '-left-16 sm:-left-20' : '-right-16 sm:-right-20'
              } top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-lg shadow-lg p-1 flex space-x-1`
        }
      `}
    >
      {isSender && (
        <>
          <button
            onClick={() => {
              setEditingId(msg._id);
              setEditText(msg.text || '');
              setActiveMsgId(null);
            }}
            className={`p-2 hover:bg-gray-700 rounded ${
              isMobile ? 'flex items-center space-x-2' : ''
            }`}
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {isMobile && <span>Edit</span>}
          </button>
          <button
            onClick={() => handleDelete(msg._id)}
            className={`p-2 hover:bg-gray-700 rounded ${
              isMobile
                ? '极速赛车开奖直播 结果 官网 首页 双色球开奖号码 查询 结果 官网 首页 幸运飞艇开奖直播 结果 官网 首页 flex items-center space-x-2'
                : ''
            }`}
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {isMobile && <span>Delete</span>}
          </button>
        </>
      )}

      {!isSender && (
        <button
          onClick={() => {
            setReplyTo(msg);
            setActiveMsgId(null);
          }}
          className={`p-2 hover:bg-gray-700 rounded ${
            isMobile ? 'flex items-center space-x-2' : ''
          }`}
          title="Reply"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          {isMobile && <span>Reply</span>}
        </button>
      )}
    </motion.div>
  );

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-300">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      {connectionAlert && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c极速赛车开奖直播 结果 官网 首页 双色球开奖号码 查询 结果 官网 首页 幸运飞艇开奖直播 结果 官网 首页 0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connection issue. Reconnecting...
          </div>
        </div>
      )}

      <ChatHeader />

      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 bg-gray-900 bg-opacity-95 overflow-x-hidden"
        style={{ maxWidth: '100vw' }}
      >
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="space-y-1 py-2">
            {messages.map((msg) => {
              const isSender = msg.senderId === authUser._id;
              const replyMsg = msg.replyTo;

              return (
                <AnimatePresence key={msg._id}>
                  <motion.div
                    ref={(el) => (messageRefs.current[msg._id] = el)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => !isMobile && setActiveMsgId(msg._id)}
                    onMouseLeave={() => !isMobile && setActiveMsgId(null)}
                    onClick={() =>
                      isMobile &&
                      setActiveMsgId(activeMsgId === msg._id ? null : msg._id)
                    }
                    className={`flex ${
                      isSender ? 'justify-end' : 'justify-start'
                    } px-2`}
                  >
                    <div
                      className={`relative max-w-[90vw] sm:max-w-md md:max-w-lg px-3 py-2 rounded-lg ${
                        isSender ? 'bg-green-800' : 'bg-gray-800'
                      }`}
                    >
                      {replyMsg && (
                        <div
                          onClick={() => scrollToMessage(replyMsg._id)}
                          className="text-xs p-2 mb-1 bg-black bg-opacity-30 rounded cursor-pointer border-l-2 border-gray-500 max-w-full"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-semibold flex items-center max-w-[85%]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                              <span className="truncate">
                                {replyMsg.senderId === authUser._id
                                  ? 'Replying to yourself'
                                  : `Replying to ${selectedUser.fullName}`}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReplyTo(null);
                              }}
                              className="ml-2 text-gray-400 hover:text-white flex-shrink-0 p-1 rounded hover:bg-gray-600 transition-colors"
                              title="Cancel reply"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div
                            className="text-gray-300 break-words overflow-hidden"
                            title={replyMsg.text || 'Media message'}
                          >
                            {replyMsg.text ? (
                              <div className="max-h-12 overflow-hidden">
                                {getMessagePreview(replyMsg.text)}
                              </div>
                            ) : (
                              '📷 Media message'
                            )}
                          </div>
                        </div>
                      )}

                      {editingId === msg._id ? (
                        <div className="flex flex-col space-y-2">
                          <input
                            className="bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditConfirm(msg._id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditConfirm(msg._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>{renderMessageContent(msg)}</>
                      )}

                      <div className="flex items-center justify-end mt-1">
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {renderReadReceipt(msg)}
                      </div>

                      <AnimatePresence>
                        {activeMsgId === msg._id && (
                          <MessageActions msg={msg} isSender={isSender} />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {showTypingIndicator && (
        <div className="px-4 py-1 text-sm text-gray-400 italic">
          {selectedUser.fullName} is typing...
        </div>
      )}

      {/* Overlay to close actions when clicking outside on mobile */}
      {isMobile && activeMsgId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-0 z-40"
          onClick={() => setActiveMsgId(null)}
        />
      )}

      <div className="border-t border-gray-700 bg-gray-800 relative z-50">
        <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
      </div>
    </div>
  );
};

export default ChatContainer;
