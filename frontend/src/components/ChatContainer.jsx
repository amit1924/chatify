// import React, { useEffect, useRef, useState } from 'react';
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
//   } = useChatStore();

//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);

//   const [prevLength, setPrevLength] = useState(0);
//   const [activeMsgId, setActiveMsgId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');

//   // Load messages & subscribe
//   useEffect(() => {
//     if (!selectedUser) return;
//     getMessagesByUserId(selectedUser._id);
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

//   if (!selectedUser) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
//         Select a chat to start messaging
//       </div>
//     );
//   }

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

//               return (
//                 <AnimatePresence key={msg._id}>
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className={`flex ${
//                       isSender ? 'justify-end' : 'justify-start'
//                     }`}
//                     onMouseEnter={() => isSender && setActiveMsgId(msg._id)}
//                     onMouseLeave={() => isSender && setActiveMsgId(null)}
//                     onClick={() => isSender && setActiveMsgId(msg._id)}
//                   >
//                     <div
//                       className={`relative max-w-xs break-words rounded-2xl px-4 py-2 shadow-lg whitespace-pre-wrap ${
//                         isSender
//                           ? 'bg-cyan-800 text-white'
//                           : 'bg-slate-800 text-slate-200'
//                       }`}
//                     >
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
//                         <>
//                           {msg.text && <p>{msg.text}</p>}
//                           {msg.image && (
//                             <img
//                               src={msg.image}
//                               alt="sent"
//                               className="mt-2 rounded-lg max-w-[200px] object-cover"
//                             />
//                           )}
//                         </>
//                       )}

//                       {/* Timestamp */}
//                       <p className="mt-1 text-xs text-gray-300">
//                         {new Date(msg.createdAt).toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
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
//                             <button
//                               className="px-2 py-1 text-xs bg-cyan-600 rounded text-white"
//                               onClick={() => {
//                                 setEditingId(msg._id);
//                                 setEditText(msg.text || '');
//                                 setActiveMsgId(null);
//                               }}
//                               aria-label="Edit message"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               className="px-2 py-1 text-xs bg-red-600 rounded text-white"
//                               onClick={() => handleDelete(msg._id)}
//                               aria-label="Delete message"
//                             >
//                               Delete
//                             </button>
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

//       <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
//         <MessageInput />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;

// import React, { useEffect, useRef, useState } from 'react';
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
//   } = useChatStore();

//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);

//   const [prevLength, setPrevLength] = useState(0);
//   const [activeMsgId, setActiveMsgId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');

//   // Load messages & subscribe
//   useEffect(() => {
//     if (!selectedUser) return;
//     getMessagesByUserId(selectedUser._id);
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

//   // Helper to detect YouTube link and extract info
//   const parseYouTubeLink = (text) => {
//     if (!text) return null;

//     const youtubeRegex =
//       /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
//     const match = text.match(youtubeRegex);

//     if (match) {
//       const videoId = match[1];
//       const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
//       const url = `https://www.youtube.com/watch?v=${videoId}`;
//       return { url, thumbnail };
//     }

//     return null;
//   };

//   const renderMessageContent = (text) => {
//     const youtubeData = parseYouTubeLink(text);
//     if (youtubeData) {
//       return (
//         <a
//           href={youtubeData.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="block border rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
//         >
//           <img
//             src={youtubeData.thumbnail}
//             alt="YouTube video"
//             className="w-full max-w-xs"
//           />
//           <p className="px-2 py-1 text-sm text-cyan-300 bg-gray-700">
//             ▶️ Watch on YouTube
//           </p>
//         </a>
//       );
//     }
//     return text;
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
//         Select a chat to start messaging
//       </div>
//     );
//   }

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

//               return (
//                 <AnimatePresence key={msg._id}>
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className={`flex ${
//                       isSender ? 'justify-end' : 'justify-start'
//                     }`}
//                     onMouseEnter={() => isSender && setActiveMsgId(msg._id)}
//                     onMouseLeave={() => isSender && setActiveMsgId(null)}
//                     onClick={() => isSender && setActiveMsgId(msg._id)}
//                   >
//                     <div
//                       className={`relative max-w-xs break-words rounded-2xl px-4 py-2 shadow-lg whitespace-pre-wrap ${
//                         isSender
//                           ? 'bg-cyan-800 text-white'
//                           : 'bg-slate-800 text-slate-200'
//                       }`}
//                     >
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
//                         <>
//                           {msg.text && (
//                             <div>{renderMessageContent(msg.text)}</div>
//                           )}
//                           {msg.image && (
//                             <img
//                               src={msg.image}
//                               alt="sent"
//                               className="mt-2 rounded-lg max-w-[200px] object-cover"
//                             />
//                           )}
//                         </>
//                       )}

//                       {/* Timestamp */}
//                       <p className="mt-1 text-xs text-gray-300">
//                         {new Date(msg.createdAt).toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
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
//                             <button
//                               className="px-2 py-1 text-xs bg-cyan-600 rounded text-white"
//                               onClick={() => {
//                                 setEditingId(msg._id);
//                                 setEditText(msg.text || '');
//                                 setActiveMsgId(null);
//                               }}
//                               aria-label="Edit message"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               className="px-2 py-1 text-xs bg-red-600 rounded text-white"
//                               onClick={() => handleDelete(msg._id)}
//                               aria-label="Delete message"
//                             >
//                               Delete
//                             </button>
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

//       <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
//         <MessageInput />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;

// import React, { useEffect, useRef, useState } from 'react';
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
//   } = useChatStore();

//   const { authUser } = useAuthStore();
//   const messageEndRef = useRef(null);

//   const [prevLength, setPrevLength] = useState(0);
//   const [activeMsgId, setActiveMsgId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');

//   // Load messages & subscribe
//   useEffect(() => {
//     if (!selectedUser) return;
//     getMessagesByUserId(selectedUser._id);
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

//   if (!selectedUser) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   const renderMessageContent = (msg) => {
//     // Handle YouTube preview
//     if (msg.text) {
//       const youtubeMatch = msg.text.match(
//         /(https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11}))/i,
//       );
//       if (youtubeMatch) {
//         const youtubeUrl = youtubeMatch[1];
//         const videoId = youtubeMatch[2];
//         return (
//           <a
//             href={youtubeUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex flex-col items-start gap-1 mt-2 p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
//           >
//             <img
//               src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
//               alt="YouTube thumbnail"
//               className="w-48 rounded"
//             />
//             <p className="text-sm font-semibold text-white">
//               ▶️ Watch on YouTube
//             </p>
//           </a>
//         );
//       }
//     }

//     // Image message
//     if (msg.image) {
//       return (
//         <img
//           src={msg.image}
//           alt="sent"
//           className="mt-2 rounded-lg max-w-[200px] object-cover"
//         />
//       );
//     }

//     // Plain text
//     return <p>{msg.text}</p>;
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

//               return (
//                 <AnimatePresence key={msg._id}>
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className={`flex ${
//                       isSender ? 'justify-end' : 'justify-start'
//                     }`}
//                     onMouseEnter={() => isSender && setActiveMsgId(msg._id)}
//                     onMouseLeave={() => isSender && setActiveMsgId(null)}
//                     onClick={() => isSender && setActiveMsgId(msg._id)}
//                   >
//                     <div
//                       className={`relative max-w-xs break-words rounded-2xl px-4 py-2 shadow-lg whitespace-pre-wrap ${
//                         isSender
//                           ? 'bg-cyan-800 text-white'
//                           : 'bg-slate-800 text-slate-200'
//                       }`}
//                     >
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
//                         renderMessageContent(msg)
//                       )}

//                       {/* Timestamp */}
//                       <p className="mt-1 text-xs text-gray-300">
//                         {new Date(msg.createdAt).toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
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
//                             <button
//                               className="px-2 py-1 text-xs bg-cyan-600 rounded text-white"
//                               onClick={() => {
//                                 setEditingId(msg._id);
//                                 setEditText(msg.text || '');
//                                 setActiveMsgId(null);
//                               }}
//                               aria-label="Edit message"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               className="px-2 py-1 text-xs bg-red-600 rounded text-white"
//                               onClick={() => handleDelete(msg._id)}
//                               aria-label="Delete message"
//                             >
//                               Delete
//                             </button>
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

//       <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
//         <MessageInput />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;

import React, { useEffect, useRef, useState } from 'react';
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
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [prevLength, setPrevLength] = useState(0);
  const [activeMsgId, setActiveMsgId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load messages & subscribe
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
    subscribeToTyping,
    unsubscribeFromMessages,
    unsubscribeFromTyping,
  ]);

  // Auto-scroll
  useEffect(() => {
    if (!messageEndRef.current) return;
    const isNew = messages.length > prevLength;
    const t = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({
        block: 'end',
        behavior: isNew ? 'smooth' : 'auto',
      });
    }, 40);
    setPrevLength(messages.length);
    return () => clearTimeout(t);
  }, [messages, prevLength]);

  const isUserTyping = typingStatus[selectedUser?._id];

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

  // Render message content (text, image, or YouTube)
  const renderMessageContent = (msg) => {
    if (msg.text) {
      const youtubeMatch = msg.text.match(
        /(https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11}))/i,
      );
      if (youtubeMatch) {
        const youtubeUrl = youtubeMatch[1];
        const videoId = youtubeMatch[2];
        return (
          <div className="mt-2 flex flex-col gap-1">
            {/* Inline YouTube player */}
            <iframe
              width="300"
              height="170"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>

            {/* Optional clickable link */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:underline"
            >
              ▶️ Watch on YouTube
            </a>
          </div>
        );
      }
    }

    if (msg.image) {
      return (
        <img
          src={msg.image}
          alt="sent"
          className="mt-2 rounded-lg max-w-[200px] object-cover"
        />
      );
    }

    return <p>{msg.text}</p>;
  };

  if (!selectedUser) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-gray-900 text-white">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4 relative">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isSender = msg.senderId === authUser._id;

              return (
                <AnimatePresence key={msg._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      isSender ? 'justify-end' : 'justify-start'
                    }`}
                    onMouseEnter={() => isSender && setActiveMsgId(msg._id)}
                    onMouseLeave={() => isSender && setActiveMsgId(null)}
                    onClick={() => isSender && setActiveMsgId(msg._id)}
                  >
                    <div
                      className={`relative max-w-xs break-words rounded-2xl px-4 py-2 shadow-lg whitespace-pre-wrap ${
                        isSender
                          ? 'bg-cyan-800 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {/* Edit mode */}
                      {editingId === msg._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditConfirm(msg._id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="w-full rounded-md bg-gray-700 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          />
                          <button
                            onClick={() => handleEditConfirm(msg._id)}
                            className="ml-2 rounded px-2 py-1 text-sm bg-cyan-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="ml-1 rounded px-2 py-1 text-sm bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>{renderMessageContent(msg)}</>
                      )}

                      {/* Timestamp */}
                      <p className="mt-1 text-xs text-gray-300">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      {/* Toolbar */}
                      <AnimatePresence>
                        {activeMsgId === msg._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            className="absolute -top-8 right-0 flex gap-2"
                          >
                            <button
                              className="px-2 py-1 text-xs bg-cyan-600 rounded text-white"
                              onClick={() => {
                                setEditingId(msg._id);
                                setEditText(msg.text || '');
                                setActiveMsgId(null);
                              }}
                              aria-label="Edit message"
                            >
                              Edit
                            </button>
                            <button
                              className="px-2 py-1 text-xs bg-red-600 rounded text-white"
                              onClick={() => handleDelete(msg._id)}
                              aria-label="Delete message"
                            >
                              Delete
                            </button>
                          </motion.div>
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

      {isUserTyping && (
        <div className="px-4 py-2 text-sm text-gray-400">
          {selectedUser.fullName} is typing…
        </div>
      )}

      <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
