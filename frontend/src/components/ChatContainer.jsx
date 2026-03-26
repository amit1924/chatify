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
//   const [expandedMessages, setExpandedMessages] = useState({});
//   const [isMobile, setIsMobile] = useState(false);

//   const messageRefs = useRef({});
//   const scrollTimeoutRef = useRef(null);
//   const typingDebounceRef = useRef(null);

//   // Helper function to truncate text to approximately 50 words
//   const getMessagePreview = (text) => {
//     if (!text) return '';

//     const words = text.trim().split(/\s+/);
//     if (words.length <= 50) {
//       return text;
//     }

//     return words.slice(0, 50).join(' ') + '...';
//   };

//   // Check if mobile device
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Monitor connection status
//   useEffect(() => {
//     if (connectionStatus === 'disconnected') {
//       setConnectionAlert(true);
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

//   const handleScroll = useCallback(() => {
//     if (!messageContainerRef.current) return;

//     const { scrollTop, scrollHeight, clientHeight } =
//       messageContainerRef.current;
//     const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
//     setIsAtBottom(distanceFromBottom <= 100);
//   }, []);

//   useEffect(() => {
//     const container = messageContainerRef.current;
//     if (container) {
//       container.addEventListener('scroll', handleScroll);
//       handleScroll();
//       return () => container.removeEventListener('scroll', handleScroll);
//     }
//   }, [handleScroll]);

//   const scrollToBottom = useCallback((behavior = 'smooth') => {
//     if (!messageEndRef.current || !messageContainerRef.current) return;

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

//   useEffect(() => {
//     if (!messages.length) return;

//     const isNewMessage = messages.length > prevLength;
//     const lastMessage = messages[messages.length - 1];
//     const isFromMe = lastMessage.senderId === authUser._id;

//     if (isNewMessage && (isFromMe || isAtBottom)) {
//       const delay = 'ontouchstart' in window ? 150 : 0;
//       setTimeout(() => {
//         scrollToBottom('smooth');
//       }, delay);
//     }

//     setPrevLength(messages.length);
//   }, [messages, authUser, isAtBottom, prevLength, scrollToBottom]);

//   useEffect(() => {
//     if (messages.length > 0 && !isMessagesLoading) {
//       const delay = 'ontouchstart' in window ? 200 : 50;
//       setTimeout(() => {
//         scrollToBottom('auto');
//       }, delay);
//     }
//   }, [isMessagesLoading, messages.length, scrollToBottom]);

//   const isUserTyping = typingStatus[selectedUser?._id];
//   const [showTypingIndicator, setShowTypingIndicator] = useState(false);

//   useEffect(() => {
//     if (isUserTyping) {
//       setShowTypingIndicator(true);
//     } else {
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
//     const displayText =
//       msg.text && msg.text.length > 500 && !expandedMessages[msg._id]
//         ? `${msg.text.substring(0, 500)}...`
//         : msg.text;

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

//     return (
//       <div>
//         <p className="break-words whitespace-pre-wrap">{displayText}</p>
//         {msg.text && msg.text.length > 500 && (
//           <button
//             onClick={() =>
//               setExpandedMessages((prev) => ({
//                 ...prev,
//                 [msg._id]: !prev[msg._id],
//               }))
//             }
//             className="text-blue-400 text-xs mt-1 hover:underline"
//           >
//             {expandedMessages[msg._id] ? 'Show less' : 'Show more...'}
//           </button>
//         )}
//       </div>
//     );
//   };

//   const renderReadReceipt = (msg) => {
//     if (msg.senderId !== authUser._id) return null;
//     if (msg.seenBy?.length > 0)
//       return <span className="ml-1 text-blue-400">✓✓</span>;
//     if (msg.deliveredTo?.length > 0) return <span className="ml-1">✓</span>;
//     return null;
//   };

//   const scrollToMessage = (msgId) => {
//     if (messageRefs.current[msgId]) {
//       messageRefs.current[msgId].scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });
//     }
//   };

//   // Mobile-friendly action buttons component
//   // const MessageActions = ({ msg, isSender }) => (
//   //   <motion.div
//   //     initial={{ opacity: 0, scale: 0.9 }}
//   //     animate={{ opacity: 1, scale: 1 }}
//   //     exit={{ opacity: 0, scale: 0.9 }}
//   //     transition={{ duration: 0.15 }}
//   //     className={`
//   //       ${
//   //         isMobile
//   //           ? 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg shadow-xl p-3 flex space-x-3 z-50 min-w-[200px] justify-center'
//   //           : `absolute ${
//   //               isSender ? '-left-16 sm:-left-20' : '-right-16 sm:-right-20'
//   //             } top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-lg shadow-lg p-1 flex space-x-1`
//   //       }
//   //     `}
//   //   >
//   //     {isSender && (
//   //       <>
//   //         <button
//   //           onClick={() => {
//   //             setEditingId(msg._id);
//   //             setEditText(msg.text || '');
//   //             setActiveMsgId(null);
//   //           }}
//   //           className={`p-2 hover:bg-gray-700 rounded ${
//   //             isMobile ? 'flex items-center space-x-2' : ''
//   //           }`}
//   //           title="Edit"
//   //         >
//   //           <svg
//   //             xmlns="http://www.w3.org/2000/svg"
//   //             className="h-5 w-5"
//   //             fill="none"
//   //             viewBox="0 0 24 24"
//   //             stroke="currentColor"
//   //           >
//   //             <path
//   //               strokeLinecap="round"
//   //               strokeLinejoin="round"
//   //               strokeWidth={2}
//   //               d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//   //             />
//   //           </svg>
//   //           {isMobile && <span>Edit</span>}
//   //         </button>
//   //         <button
//   //           onClick={() => handleDelete(msg._id)}
//   //           className={`p-2 hover:bg-gray-700 rounded ${
//   //             isMobile
//   //               ? '极速赛车开奖直播 结果 官网 首页 双色球开奖号码 查询 结果 官网 首页 幸运飞艇开奖直播 结果 官网 首页 flex items-center space-x-2'
//   //               : ''
//   //           }`}
//   //           title="Delete"
//   //         >
//   //           <svg
//   //             xmlns="http://www.w3.org/2000/svg"
//   //             className="h-5 w-5"
//   //             fill="none"
//   //             viewBox="0 0 24 24"
//   //             stroke="currentColor"
//   //           >
//   //             <path
//   //               strokeLinecap="round"
//   //               strokeLinejoin="round"
//   //               strokeWidth={2}
//   //               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//   //             />
//   //           </svg>
//   //           {isMobile && <span>Delete</span>}
//   //         </button>
//   //       </>
//   //     )}

//   //     {!isSender && (
//   //       <button
//   //         onClick={() => {
//   //           setReplyTo(msg);
//   //           setActiveMsgId(null);
//   //         }}
//   //         className={`p-2 hover:bg-gray-700 rounded ${
//   //           isMobile ? 'flex items-center space-x-2' : ''
//   //         }`}
//   //         title="Reply"
//   //       >
//   //         <svg
//   //           xmlns="http://www.w3.org/2000/svg"
//   //           className="h-5 w-5"
//   //           fill="none"
//   //           viewBox="0 0 24 24"
//   //           stroke="currentColor"
//   //         >
//   //           <path
//   //             strokeLinecap="round"
//   //             strokeLinejoin="round"
//   //             strokeWidth={2}
//   //             d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
//   //           />
//   //         </svg>
//   //         {isMobile && <span>Reply</span>}
//   //       </button>
//   //     )}
//   //   </motion.div>
//   // );

//   const MessageActions = ({ msg, isSender }) => {
//     return (
//       <>
//         {/* DESKTOP ACTIONS (same but improved spacing) */}
//         {!isMobile && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: -10 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: -10 }}
//             transition={{ duration: 0.2 }}
//             className={`
//             absolute
//             ${isSender ? '-left-20' : '-right-20'}
//             top-1/2 -translate-y-1/2
//             bg-gray-800 border border-gray-700
//             rounded-xl shadow-xl
//             p-1 flex gap-1
//           `}
//           >
//             {isSender && (
//               <>
//                 <button
//                   onClick={() => {
//                     setEditingId(msg._id);
//                     setEditText(msg.text || '');
//                     setActiveMsgId(null);
//                   }}
//                   className="p-2 hover:bg-gray-700 rounded-lg transition"
//                 >
//                   ✏️
//                 </button>

//                 <button
//                   onClick={() => handleDelete(msg._id)}
//                   className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
//                 >
//                   🗑️
//                 </button>
//               </>
//             )}

//             {!isSender && (
//               <button
//                 onClick={() => {
//                   setReplyTo(msg);
//                   setActiveMsgId(null);
//                 }}
//                 className="p-2 hover:bg-gray-700 rounded-lg transition"
//               >
//                 ↩️
//               </button>
//             )}
//           </motion.div>
//         )}

//         {/* 🔥 MOBILE BOTTOM SHEET */}
//         {isMobile && (
//           <motion.div
//             initial={{ y: '100%' }}
//             animate={{ y: 0 }}
//             exit={{ y: '100%' }}
//             transition={{ duration: 0.3, ease: 'easeOut' }}
//             className="
//             fixed bottom-0 left-0 w-full
//             bg-gray-900 border-t border-gray-700
//             rounded-t-2xl
//             z-50
//             p-4
//           "
//           >
//             {/* drag indicator */}
//             <div className="w-10 h-1.5 bg-gray-600 rounded-full mx-auto mb-4" />

//             <div className="space-y-2">
//               {isSender && (
//                 <>
//                   <button
//                     onClick={() => {
//                       setEditingId(msg._id);
//                       setEditText(msg.text || '');
//                       setActiveMsgId(null);
//                     }}
//                     className="
//                     w-full flex items-center gap-3
//                     px-4 py-3
//                     rounded-xl
//                     bg-gray-800 hover:bg-gray-700
//                     transition
//                   "
//                   >
//                     <span className="text-lg">✏️</span>
//                     <span>Edit Message</span>
//                   </button>

//                   <button
//                     onClick={() => handleDelete(msg._id)}
//                     className="
//                     w-full flex items-center gap-3
//                     px-4 py-3
//                     rounded-xl
//                     bg-red-600/10 hover:bg-red-600/20
//                     text-red-400
//                     transition
//                   "
//                   >
//                     <span className="text-lg">🗑️</span>
//                     <span>Delete Message</span>
//                   </button>
//                 </>
//               )}

//               {!isSender && (
//                 <button
//                   onClick={() => {
//                     setReplyTo(msg);
//                     setActiveMsgId(null);
//                   }}
//                   className="
//                   w-full flex items-center gap-3
//                   px-4 py-3
//                   rounded-xl
//                   bg-gray-800 hover:bg-gray-700
//                   transition
//                 "
//                 >
//                   <span className="text-lg">↩️</span>
//                   <span>Reply</span>
//                 </button>
//               )}

//               {/* Cancel */}
//               <button
//                 onClick={() => setActiveMsgId(null)}
//                 className="
//                 w-full mt-2
//                 py-3
//                 rounded-xl
//                 bg-gray-700 hover:bg-gray-600
//                 transition
//               "
//               >
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </>
//     );
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-900 text-gray-300">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-gray-900 relative">
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
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c极速赛车开奖直播 结果 官网 首页 双色球开奖号码 查询 结果 官网 首页 幸运飞艇开奖直播 结果 官网 首页 0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             Connection issue. Reconnecting...
//           </div>
//         </div>
//       )}

//       <ChatHeader />

//       <div
//         ref={messageContainerRef}
//         className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 bg-gray-900 bg-opacity-95 overflow-x-hidden"
//         style={{ maxWidth: '100vw' }}
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
//                     onMouseEnter={() => !isMobile && setActiveMsgId(msg._id)}
//                     onMouseLeave={() => !isMobile && setActiveMsgId(null)}
//                     onClick={() =>
//                       isMobile &&
//                       setActiveMsgId(activeMsgId === msg._id ? null : msg._id)
//                     }
//                     className={`flex ${
//                       isSender ? 'justify-end' : 'justify-start'
//                     } px-2`}
//                   >
//                     <div
//                       className={`relative max-w-[90vw] sm:max-w-md md:max-w-lg px-3 py-2 rounded-lg ${
//                         isSender ? 'bg-green-800' : 'bg-gray-800'
//                       }`}
//                     >
//                       {replyMsg && (
//                         <div
//                           onClick={() => scrollToMessage(replyMsg._id)}
//                           className="text-xs p-2 mb-1 bg-black bg-opacity-30 rounded cursor-pointer border-l-2 border-gray-500 max-w-full"
//                         >
//                           <div className="flex items-center justify-between mb-1">
//                             <div className="font-semibold flex items-center max-w-[85%]">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-3 w-3 mr-1 flex-shrink-0"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
//                                 />
//                               </svg>
//                               <span className="truncate">
//                                 {replyMsg.senderId === authUser._id
//                                   ? 'Replying to yourself'
//                                   : `Replying to ${selectedUser.fullName}`}
//                               </span>
//                             </div>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setReplyTo(null);
//                               }}
//                               className="ml-2 text-gray-400 hover:text-white flex-shrink-0 p-1 rounded hover:bg-gray-600 transition-colors"
//                               title="Cancel reply"
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-3 w-3"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M6 18L18 6M6 6l12 12"
//                                 />
//                               </svg>
//                             </button>
//                           </div>
//                           <div
//                             className="text-gray-300 break-words overflow-hidden"
//                             title={replyMsg.text || 'Media message'}
//                           >
//                             {replyMsg.text ? (
//                               <div className="max-h-12 overflow-hidden">
//                                 {getMessagePreview(replyMsg.text)}
//                               </div>
//                             ) : (
//                               '📷 Media message'
//                             )}
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
//                           <MessageActions msg={msg} isSender={isSender} />
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

//       {/* Overlay to close actions when clicking outside on mobile */}
//       {isMobile && activeMsgId && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-0 z-40"
//           onClick={() => setActiveMsgId(null)}
//         />
//       )}

//       <div className="border-t border-gray-700 bg-gray-800 relative z-50">
//         <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;
///////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useAuthStore } from '../store/useAuthStore';
// import { useChatStore } from '../store/useChatStore';
// import ChatHeader from './ChatHeader';
// import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
// import MessageInput from './MessageInput';
// import MessagesLoadingSkeleton from './MessagesLoadingkeleton';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';

// // Feather icons (clean UI)
// import {
//   FiEdit2,
//   FiTrash2,
//   FiX,
//   FiLoader,
//   FiExternalLink,
//   FiImage,
//   FiCheck,
//   FiCheckCircle,
//   FiChevronDown,
//   FiChevronUp,
//   FiCornerUpLeft,
//   FiSave,
//   FiMessageSquare,
// } from 'react-icons/fi';

// // FontAwesome icons (for missing icons)
// import { FaReply, FaYoutube } from 'react-icons/fa';

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
//   const [expandedMessages, setExpandedMessages] = useState({});
//   const [isMobile, setIsMobile] = useState(false);

//   const messageRefs = useRef({});
//   const scrollTimeoutRef = useRef(null);
//   const typingDebounceRef = useRef(null);

//   // Helper function to truncate text to approximately 50 words
//   const getMessagePreview = (text) => {
//     if (!text) return '';

//     const words = text.trim().split(/\s+/);
//     if (words.length <= 50) {
//       return text;
//     }

//     return words.slice(0, 50).join(' ') + '...';
//   };

//   // Check if mobile device
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Monitor connection status
//   useEffect(() => {
//     if (connectionStatus === 'disconnected') {
//       setConnectionAlert(true);
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

//   const handleScroll = useCallback(() => {
//     if (!messageContainerRef.current) return;

//     const { scrollTop, scrollHeight, clientHeight } =
//       messageContainerRef.current;
//     const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
//     setIsAtBottom(distanceFromBottom <= 100);
//   }, []);

//   useEffect(() => {
//     const container = messageContainerRef.current;
//     if (container) {
//       container.addEventListener('scroll', handleScroll);
//       handleScroll();
//       return () => container.removeEventListener('scroll', handleScroll);
//     }
//   }, [handleScroll]);

//   const scrollToBottom = useCallback((behavior = 'smooth') => {
//     if (!messageEndRef.current || !messageContainerRef.current) return;

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

//   useEffect(() => {
//     if (!messages.length) return;

//     const isNewMessage = messages.length > prevLength;
//     const lastMessage = messages[messages.length - 1];
//     const isFromMe = lastMessage.senderId === authUser._id;

//     if (isNewMessage && (isFromMe || isAtBottom)) {
//       const delay = 'ontouchstart' in window ? 150 : 0;
//       setTimeout(() => {
//         scrollToBottom('smooth');
//       }, delay);
//     }

//     setPrevLength(messages.length);
//   }, [messages, authUser, isAtBottom, prevLength, scrollToBottom]);

//   useEffect(() => {
//     if (messages.length > 0 && !isMessagesLoading) {
//       const delay = 'ontouchstart' in window ? 200 : 50;
//       setTimeout(() => {
//         scrollToBottom('auto');
//       }, delay);
//     }
//   }, [isMessagesLoading, messages.length, scrollToBottom]);

//   const isUserTyping = typingStatus[selectedUser?._id];
//   const [showTypingIndicator, setShowTypingIndicator] = useState(false);

//   useEffect(() => {
//     if (isUserTyping) {
//       setShowTypingIndicator(true);
//     } else {
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
//     const displayText =
//       msg.text && msg.text.length > 500 && !expandedMessages[msg._id]
//         ? `${msg.text.substring(0, 500)}...`
//         : msg.text;

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
//               className="text-blue-400 hover:underline text-sm mt-1 block flex items-center gap-1"
//             >
//               <FaYoutube className="inline" size={14} />
//               Watch on YouTube
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
//           <p className="text-xs flex items-center gap-1">
//             <FiExternalLink size={12} />
//             External Link
//           </p>
//         </a>
//       );
//     }

//     if (msg.image) {
//       return (
//         <div className="relative">
//           <img src={msg.image} alt="sent" className="max-w-xs rounded-lg" />
//           <FiImage
//             className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
//             size={24}
//           />
//         </div>
//       );
//     }

//     return (
//       <div>
//         <p className="break-words whitespace-pre-wrap">{displayText}</p>
//         {msg.text && msg.text.length > 500 && (
//           <button
//             onClick={() =>
//               setExpandedMessages((prev) => ({
//                 ...prev,
//                 [msg._id]: !prev[msg._id],
//               }))
//             }
//             className="text-blue-400 text-xs mt-1 hover:underline flex items-center gap-1"
//           >
//             {expandedMessages[msg._id] ? (
//               <>
//                 <FiChevronUp size={12} />
//                 Show less
//               </>
//             ) : (
//               <>
//                 <FiChevronDown size={12} />
//                 Show more...
//               </>
//             )}
//           </button>
//         )}
//       </div>
//     );
//   };

//   const renderReadReceipt = (msg) => {
//     if (msg.senderId !== authUser._id) return null;
//     if (msg.seenBy?.length > 0)
//       return <FiCheckCircle className="ml-1 text-blue-400" size={14} />;
//     if (msg.deliveredTo?.length > 0)
//       return <FiCheck className="ml-1" size={14} />;
//     return null;
//   };

//   const scrollToMessage = (msgId) => {
//     if (messageRefs.current[msgId]) {
//       messageRefs.current[msgId].scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });
//     }
//   };

//   const MessageActions = ({ msg, isSender }) => {
//     return (
//       <>
//         {/* DESKTOP ACTIONS */}
//         {!isMobile && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: -10 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: -10 }}
//             transition={{ duration: 0.2 }}
//             className={`
//             absolute
//             ${isSender ? '-left-20' : '-right-20'}
//             top-1/2 -translate-y-1/2
//             bg-gray-800 border border-gray-700
//             rounded-xl shadow-xl
//             p-1 flex gap-1
//           `}
//           >
//             {isSender && (
//               <>
//                 <button
//                   onClick={() => {
//                     setEditingId(msg._id);
//                     setEditText(msg.text || '');
//                     setActiveMsgId(null);
//                   }}
//                   className="p-2 hover:bg-gray-700 rounded-lg transition"
//                   title="Edit"
//                 >
//                   <FiEdit2 size={18} />
//                 </button>

//                 <button
//                   onClick={() => handleDelete(msg._id)}
//                   className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
//                   title="Delete"
//                 >
//                   <FiTrash2 size={18} />
//                 </button>
//               </>
//             )}

//             {!isSender && (
//               <button
//                 onClick={() => {
//                   setReplyTo(msg);
//                   setActiveMsgId(null);
//                 }}
//                 className="p-2 hover:bg-gray-700 rounded-lg transition"
//                 title="Reply"
//               >
//                 <FaReply size={18} />
//               </button>
//             )}
//           </motion.div>
//         )}

//         {/* MOBILE BOTTOM SHEET */}
//         {isMobile && (
//           <motion.div
//             initial={{ y: '100%' }}
//             animate={{ y: 0 }}
//             exit={{ y: '100%' }}
//             transition={{ duration: 0.3, ease: 'easeOut' }}
//             className="
//             fixed bottom-0 left-0 w-full
//             bg-gray-900 border-t border-gray-700
//             rounded-t-2xl
//             z-50
//             p-4
//           "
//           >
//             {/* drag indicator */}
//             <div className="w-10 h-1.5 bg-gray-600 rounded-full mx-auto mb-4" />

//             <div className="space-y-2">
//               {isSender && (
//                 <>
//                   <button
//                     onClick={() => {
//                       setEditingId(msg._id);
//                       setEditText(msg.text || '');
//                       setActiveMsgId(null);
//                     }}
//                     className="
//                     w-full flex items-center gap-3
//                     px-4 py-3
//                     rounded-xl
//                     bg-gray-800 hover:bg-gray-700
//                     transition
//                   "
//                   >
//                     <FiEdit2 size={20} />
//                     <span>Edit Message</span>
//                   </button>

//                   <button
//                     onClick={() => handleDelete(msg._id)}
//                     className="
//                     w-full flex items-center gap-3
//                     px-4 py-3
//                     rounded-xl
//                     bg-red-600/10 hover:bg-red-600/20
//                     text-red-400
//                     transition
//                   "
//                   >
//                     <FiTrash2 size={20} />
//                     <span>Delete Message</span>
//                   </button>
//                 </>
//               )}

//               {!isSender && (
//                 <button
//                   onClick={() => {
//                     setReplyTo(msg);
//                     setActiveMsgId(null);
//                   }}
//                   className="
//                   w-full flex items-center gap-3
//                   px-4 py-3
//                   rounded-xl
//                   bg-gray-800 hover:bg-gray-700
//                   transition
//                 "
//                 >
//                   <FaReply size={20} />
//                   <span>Reply</span>
//                 </button>
//               )}

//               {/* Cancel */}
//               <button
//                 onClick={() => setActiveMsgId(null)}
//                 className="
//                 w-full mt-2
//                 py-3
//                 rounded-xl
//                 bg-gray-700 hover:bg-gray-600
//                 transition
//               "
//               >
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </>
//     );
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-900 text-gray-300">
//         <FiMessageSquare className="mr-2" size={20} />
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-gray-900 relative">
//       {connectionAlert && (
//         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
//           <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
//             <FiLoader className="animate-spin" size={16} />
//             Connection issue. Reconnecting...
//           </div>
//         </div>
//       )}

//       <ChatHeader />

//       <div
//         ref={messageContainerRef}
//         className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 bg-gray-900 bg-opacity-95 overflow-x-hidden"
//         style={{ maxWidth: '100vw' }}
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
//                     onMouseEnter={() => !isMobile && setActiveMsgId(msg._id)}
//                     onMouseLeave={() => !isMobile && setActiveMsgId(null)}
//                     onClick={() =>
//                       isMobile &&
//                       setActiveMsgId(activeMsgId === msg._id ? null : msg._id)
//                     }
//                     className={`flex ${
//                       isSender ? 'justify-end' : 'justify-start'
//                     } px-2`}
//                   >
//                     <div
//                       className={`relative max-w-[90vw] sm:max-w-md md:max-w-lg px-3 py-2 rounded-lg ${
//                         isSender ? 'bg-green-800' : 'bg-gray-800'
//                       }`}
//                     >
//                       {replyMsg && (
//                         <div
//                           onClick={() => scrollToMessage(replyMsg._id)}
//                           className="text-xs p-2 mb-1 bg-black bg-opacity-30 rounded cursor-pointer border-l-2 border-gray-500 max-w-full"
//                         >
//                           <div className="flex items-center justify-between mb-1">
//                             <div className="font-semibold flex items-center gap-1 max-w-[85%]">
//                               <FiCornerUpLeft
//                                 size={12}
//                                 className="flex-shrink-0"
//                               />
//                               <span className="truncate">
//                                 {replyMsg.senderId === authUser._id
//                                   ? 'Replying to yourself'
//                                   : `Replying to ${selectedUser.fullName}`}
//                               </span>
//                             </div>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setReplyTo(null);
//                               }}
//                               className="ml-2 text-gray-400 hover:text-white flex-shrink-0 p-1 rounded hover:bg-gray-600 transition-colors"
//                               title="Cancel reply"
//                             >
//                               <FiX size={12} />
//                             </button>
//                           </div>
//                           <div
//                             className="text-gray-300 break-words overflow-hidden"
//                             title={replyMsg.text || 'Media message'}
//                           >
//                             {replyMsg.text ? (
//                               <div className="max-h-12 overflow-hidden">
//                                 {getMessagePreview(replyMsg.text)}
//                               </div>
//                             ) : (
//                               <span className="flex items-center gap-1">
//                                 <FiImage size={12} />
//                                 Media message
//                               </span>
//                             )}
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
//                               className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
//                             >
//                               <FiSave size={14} />
//                               Save
//                             </button>
//                             <button
//                               onClick={() => setEditingId(null)}
//                               className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
//                             >
//                               <FiX size={14} />
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>{renderMessageContent(msg)}</>
//                       )}

//                       <div className="flex items-center justify-end mt-1 gap-1">
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
//                           <MessageActions msg={msg} isSender={isSender} />
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
//         <div className="px-4 py-1 text-sm text-gray-400 italic flex items-center gap-2">
//           <FiLoader className="animate-spin" size={12} />
//           {selectedUser.fullName} is typing...
//         </div>
//       )}

//       {/* Overlay to close actions when clicking outside on mobile */}
//       {isMobile && activeMsgId && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-0 z-40"
//           onClick={() => setActiveMsgId(null)}
//         />
//       )}

//       <div className="border-t border-gray-700 bg-gray-800 relative z-50">
//         <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;

//////////////////////////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingkeleton';
import toast from 'react-hot-toast';

// Feather icons (clean UI)
import {
  FiEdit2,
  FiTrash2,
  FiX,
  FiLoader,
  FiExternalLink,
  FiImage,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiCornerUpLeft,
  FiSave,
  FiMessageSquare,
} from 'react-icons/fi';

// FontAwesome icons (for missing icons)
import { FaReply, FaYoutube } from 'react-icons/fa';

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
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  // Check if mobile device and keyboard visibility
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Detect keyboard on mobile
    if ('visualViewport' in window) {
      const handleResize = () => {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const isKeyboardOpen = viewportHeight < windowHeight * 0.8;
        setKeyboardVisible(isKeyboardOpen);
      };

      window.visualViewport.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', checkMobile);
        window.visualViewport?.removeEventListener('resize', handleResize);
      };
    }

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
          <div className="max-w-[80vw] sm:max-w-xs">
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
              className="text-blue-400 hover:underline text-sm mt-1 block flex items-center gap-1"
            >
              <FaYoutube className="inline" size={14} />
              Watch on YouTube
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
          className="text-blue-400 hover:underline break-all"
        >
          <p className="break-all">{link}</p>
          <p className="text-xs flex items-center gap-1">
            <FiExternalLink size={12} />
            External Link
          </p>
        </a>
      );
    }

    if (msg.image) {
      return (
        <div className="relative">
          <img
            src={msg.image}
            alt="sent"
            className="max-w-[80vw] sm:max-w-xs rounded-lg object-cover"
          />
          <FiImage
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
            size={24}
          />
        </div>
      );
    }

    return (
      <div>
        <p className="break-words whitespace-pre-wrap text-sm sm:text-base">
          {displayText}
        </p>
        {msg.text && msg.text.length > 500 && (
          <button
            onClick={() =>
              setExpandedMessages((prev) => ({
                ...prev,
                [msg._id]: !prev[msg._id],
              }))
            }
            className="text-blue-400 text-xs mt-1 hover:underline flex items-center gap-1"
          >
            {expandedMessages[msg._id] ? (
              <>
                <FiChevronUp size={12} />
                Show less
              </>
            ) : (
              <>
                <FiChevronDown size={12} />
                Show more...
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const renderReadReceipt = (msg) => {
    if (msg.senderId !== authUser._id) return null;
    if (msg.seenBy?.length > 0)
      return (
        <FiCheckCircle className="ml-1 text-blue-400 flex-shrink-0" size={14} />
      );
    if (msg.deliveredTo?.length > 0)
      return <FiCheck className="ml-1 flex-shrink-0" size={14} />;
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

  const MessageActions = ({ msg, isSender }) => {
    return (
      <>
        {/* DESKTOP ACTIONS */}
        {!isMobile && activeMsgId === msg._id && (
          <div
            className={`
            absolute 
            ${isSender ? '-left-20' : '-right-20'} 
            top-1/2 -translate-y-1/2
            bg-gray-800 border border-gray-700
            rounded-xl shadow-xl
            p-1 flex gap-1
            z-30
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
                  className="p-2 hover:bg-gray-700 rounded-lg transition"
                  title="Edit"
                >
                  <FiEdit2 size={18} />
                </button>

                <button
                  onClick={() => handleDelete(msg._id)}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                  title="Delete"
                >
                  <FiTrash2 size={18} />
                </button>
              </>
            )}

            {!isSender && (
              <button
                onClick={() => {
                  setReplyTo(msg);
                  setActiveMsgId(null);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
                title="Reply"
              >
                <FaReply size={18} />
              </button>
            )}
          </div>
        )}

        {/* MOBILE BOTTOM SHEET - IMPROVED FOR CUTOFF ISSUE */}
        {isMobile && activeMsgId === msg._id && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setActiveMsgId(null)}
            />

            {/* Bottom sheet - positioned with safe area */}
            <div
              className="fixed bottom-0 left-0 right-0
              bg-gray-900 border-t border-gray-700
              rounded-t-2xl
              z-50
              p-4
              animate-slide-up
              safe-area-bottom"
              style={{
                maxHeight: '50vh',
                overflowY: 'auto',
                paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
              }}
            >
              {/* drag indicator */}
              <div className="w-10 h-1.5 bg-gray-600 rounded-full mx-auto mb-4" />

              <div className="space-y-2">
                {isSender && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(msg._id);
                        setEditText(msg.text || '');
                        setActiveMsgId(null);
                      }}
                      className="
                      w-full flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      bg-gray-800 hover:bg-gray-700
                      transition
                      touch-manipulation
                    "
                    >
                      <FiEdit2 size={20} />
                      <span>Edit Message</span>
                    </button>

                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="
                      w-full flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      bg-red-600/10 hover:bg-red-600/20
                      text-red-400
                      transition
                      touch-manipulation
                    "
                    >
                      <FiTrash2 size={20} />
                      <span>Delete Message</span>
                    </button>
                  </>
                )}

                {!isSender && (
                  <button
                    onClick={() => {
                      setReplyTo(msg);
                      setActiveMsgId(null);
                    }}
                    className="
                    w-full flex items-center gap-3
                    px-4 py-3
                    rounded-xl
                    bg-gray-800 hover:bg-gray-700
                    transition
                    touch-manipulation
                  "
                  >
                    <FaReply size={20} />
                    <span>Reply</span>
                  </button>
                )}

                {/* Cancel */}
                <button
                  onClick={() => setActiveMsgId(null)}
                  className="
                  w-full mt-2
                  py-3
                  rounded-xl
                  bg-gray-700 hover:bg-gray-600
                  transition
                  touch-manipulation
                "
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-300 p-4 text-center">
        <FiMessageSquare className="mr-2 flex-shrink-0" size={20} />
        <span className="text-sm sm:text-base">
          Select a chat to start messaging
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 relative overflow-hidden">
      {connectionAlert && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm">
          <div className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs sm:text-sm">
            <FiLoader className="animate-spin flex-shrink-0" size={14} />
            <span className="truncate">Connection issue. Reconnecting...</span>
          </div>
        </div>
      )}

      <ChatHeader />

      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-2 bg-gray-900 bg-opacity-95"
        style={{
          maxWidth: '100%',
          WebkitOverflowScrolling: 'touch',
        }}
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
                <div key={msg._id}>
                  <div
                    ref={(el) => (messageRefs.current[msg._id] = el)}
                    onMouseEnter={() => !isMobile && setActiveMsgId(msg._id)}
                    onMouseLeave={() => !isMobile && setActiveMsgId(null)}
                    onClick={() =>
                      isMobile &&
                      setActiveMsgId(activeMsgId === msg._id ? null : msg._id)
                    }
                    className={`flex ${
                      isSender ? 'justify-end' : 'justify-start'
                    } px-1 sm:px-2`}
                  >
                    <div
                      className={`relative max-w-[85%] sm:max-w-md md:max-w-lg px-3 py-2 rounded-lg ${
                        isSender ? 'bg-green-800' : 'bg-gray-800'
                      }`}
                    >
                      {replyMsg && (
                        <div
                          onClick={() => scrollToMessage(replyMsg._id)}
                          className="text-xs p-2 mb-1 bg-black bg-opacity-30 rounded cursor-pointer border-l-2 border-gray-500"
                        >
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="font-semibold flex items-center gap-1 min-w-0 flex-1">
                              <FiCornerUpLeft
                                size={12}
                                className="flex-shrink-0"
                              />
                              <span className="truncate text-xs">
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
                              className="text-gray-400 hover:text-white flex-shrink-0 p-1 rounded hover:bg-gray-600 transition-colors"
                              title="Cancel reply"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                          <div
                            className="text-gray-300 break-words"
                            title={replyMsg.text || 'Media message'}
                          >
                            {replyMsg.text ? (
                              <div className="line-clamp-2 overflow-hidden">
                                {getMessagePreview(replyMsg.text)}
                              </div>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FiImage size={12} />
                                Media message
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {editingId === msg._id ? (
                        <div className="flex flex-col space-y-2">
                          <textarea
                            className="bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm sm:text-base"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleEditConfirm(msg._id);
                              }
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditConfirm(msg._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 touch-manipulation"
                            >
                              <FiSave size={14} />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 touch-manipulation"
                            >
                              <FiX size={14} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>{renderMessageContent(msg)}</>
                      )}

                      <div className="flex items-center justify-end mt-1 gap-1">
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {renderReadReceipt(msg)}
                      </div>

                      <MessageActions msg={msg} isSender={isSender} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {showTypingIndicator && (
        <div className="px-3 sm:px-4 py-1 text-xs sm:text-sm text-gray-400 italic flex items-center gap-2">
          <FiLoader className="animate-spin flex-shrink-0" size={12} />
          <span className="truncate">{selectedUser.fullName} is typing...</span>
        </div>
      )}

      <div className="border-t border-gray-700 bg-gray-800 relative z-50 safe-area-bottom">
        <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
      </div>
    </div>
  );
};

export default ChatContainer;

// update
