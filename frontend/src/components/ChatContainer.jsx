// import React, { useEffect, useRef, useState } from 'react';
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
//     subscribeToTyping,
//     unsubscribeFromTyping,
//     typingStatus,
//   } = useChatStore();

//   const { authUser, onlineUsers } = useAuthStore();
//   const messageEndRef = useRef(null);
//   const [prevLength, setPrevLength] = useState(0);

//   // Fetch messages & subscribe to updates
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
//     unsubscribeFromMessages,
//     subscribeToTyping,
//     unsubscribeFromTyping,
//   ]);

//   // Scroll to bottom on new messages without losing focus
//   useEffect(() => {
//     if (!messageEndRef.current) return;

//     const isNewMessage = messages.length > prevLength;
//     const behavior = isNewMessage ? 'smooth' : 'auto';

//     const activeElement = document.activeElement;

//     const timeout = setTimeout(() => {
//       messageEndRef.current?.scrollIntoView({ block: 'end', behavior });
//       // Restore focus if input was active
//       if (activeElement && activeElement.tagName === 'INPUT') {
//         activeElement.focus({ preventScroll: true });
//       }
//     }, 50);

//     setPrevLength(messages.length);
//     return () => clearTimeout(timeout);
//   }, [messages, prevLength]);

//   if (!selectedUser) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   const isUserTyping = typingStatus[selectedUser._id];

//   return (
//     <div className="flex h-full flex-col bg-gray-900 text-white">
//       {/* Header */}
//       <ChatHeader />

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//         {isMessagesLoading ? (
//           <MessagesLoadingSkeleton />
//         ) : messages.length === 0 ? (
//           <NoChatHistoryPlaceholder name={selectedUser.fullName} />
//         ) : (
//           <div className="space-y-4">
//             {messages.map((msg) => {
//               const isSender = msg.senderId === authUser._id;
//               const isOnline = onlineUsers.includes(msg.senderId);

//               return (
//                 <div
//                   key={msg._id}
//                   className={`flex ${
//                     isSender ? 'justify-end' : 'justify-start'
//                   }`}
//                 >
//                   <div
//                     className={`relative max-w-xs rounded-2xl px-4 py-2 shadow-lg break-words whitespace-pre-wrap ${
//                       isSender
//                         ? 'bg-cyan-600 text-white'
//                         : 'bg-slate-800 text-slate-200'
//                     }`}
//                   >
//                     {msg.image && (
//                       <img
//                         src={msg.image}
//                         alt="Shared"
//                         className="mb-2 max-h-60 w-full rounded-lg object-cover"
//                       />
//                     )}
//                     {msg.text && (
//                       <p className="whitespace-pre-wrap">{msg.text}</p>
//                     )}

//                     <p className="mt-1 text-xs text-gray-300 flex items-center gap-1">
//                       {new Date(msg.createdAt).toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                       {!isSender && (
//                         <span
//                           className={`inline-block h-2 w-2 rounded-full ${
//                             isOnline ? 'bg-green-500' : 'bg-gray-500'
//                           }`}
//                         />
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messageEndRef} />
//           </div>
//         )}
//       </div>

//       {/* Typing indicator */}
//       {isUserTyping && (
//         <div className="px-4 py-2 text-sm text-gray-400">
//           {selectedUser.fullName} is typing…
//         </div>
//       )}

//       {/* Message input */}
//       <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
//         <MessageInput />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;

///////////////////////////////////***************/////////////////////////////////////////////// */

// import React, { useEffect, useRef, useState } from 'react';
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
//     subscribeToTyping,
//     unsubscribeFromTyping,
//     typingStatus,
//     deleteMessage,
//     editMessage,
//   } = useChatStore();

//   const { authUser, onlineUsers } = useAuthStore();
//   const messageEndRef = useRef(null);
//   const [prevLength, setPrevLength] = useState(0);

//   const [contextMenu, setContextMenu] = useState(null); // {x, y, msg}
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');

//   // Fetch messages & subscribe
//   useEffect(() => {
//     if (!selectedUser) return;
//     getMessagesByUserId(selectedUser._id);
//     subscribeToMessages();
//     subscribeToTyping();
//     return () => {
//       unsubscribeFromMessages();
//       unsubscribeFromTyping();
//     };
//   }, [selectedUser]);

//   // Scroll on new messages
//   useEffect(() => {
//     if (!messageEndRef.current) return;
//     const isNew = messages.length > prevLength;
//     const behavior = isNew ? 'smooth' : 'auto';
//     const active = document.activeElement;

//     const t = setTimeout(() => {
//       messageEndRef.current?.scrollIntoView({ block: 'end', behavior });
//       if (active && active.tagName === 'INPUT') {
//         active.focus({ preventScroll: true });
//       }
//     }, 50);

//     setPrevLength(messages.length);
//     return () => clearTimeout(t);
//   }, [messages]);

//   useEffect(() => {
//     const close = () => setContextMenu(null);
//     window.addEventListener('click', close);
//     return () => window.removeEventListener('click', close);
//   }, []);

//   if (!selectedUser) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   const isUserTyping = typingStatus[selectedUser._id];

//   const handleLongPress = (e, msg, isSender) => {
//     if (!isSender) return;
//     e.preventDefault();
//     setContextMenu({ x: e.clientX, y: e.clientY, msg });
//   };

//   const renderMessageText = (msg, isSender) => {
//     if (editingId === msg._id) {
//       return (
//         <input
//           className="bg-gray-700 text-white rounded px-2 py-1 w-full"
//           value={editText}
//           onChange={(e) => setEditText(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               editMessage(msg._id, editText);
//               setEditingId(null);
//             }
//             if (e.key === 'Escape') setEditingId(null);
//           }}
//           autoFocus
//         />
//       );
//     }
//     return <p className="whitespace-pre-wrap">{msg.text}</p>;
//   };

//   return (
//     <div className="flex h-full flex-col bg-gray-900 text-white relative">
//       <ChatHeader />

//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//         {isMessagesLoading ? (
//           <MessagesLoadingSkeleton />
//         ) : messages.length === 0 ? (
//           <NoChatHistoryPlaceholder name={selectedUser.fullName} />
//         ) : (
//           <div className="space-y-4">
//             {messages.map((msg) => {
//               const isSender = msg.senderId === authUser._id;
//               const isOnline = onlineUsers.includes(msg.senderId);

//               return (
//                 <div
//                   key={msg._id}
//                   className={`flex ${
//                     isSender ? 'justify-end' : 'justify-start'
//                   }`}
//                   onContextMenu={(e) => handleLongPress(e, msg, isSender)}
//                   onPointerDown={(e) => {
//                     if (e.pointerType === 'touch') {
//                       const timer = setTimeout(
//                         () => handleLongPress(e, msg, isSender),
//                         500,
//                       );
//                       const cancel = () => clearTimeout(timer);
//                       e.target.addEventListener('pointerup', cancel, {
//                         once: true,
//                       });
//                       e.target.addEventListener('pointerleave', cancel, {
//                         once: true,
//                       });
//                     }
//                   }}
//                 >
//                   <div
//                     className={`relative max-w-xs rounded-2xl px-4 py-2 shadow-lg break-words whitespace-pre-wrap ${
//                       isSender
//                         ? 'bg-cyan-600 text-white'
//                         : 'bg-slate-800 text-slate-200'
//                     }`}
//                   >
//                     {msg.image && (
//                       <img
//                         src={msg.image}
//                         alt="Shared"
//                         className="mb-2 max-h-60 w-full rounded-lg object-cover"
//                       />
//                     )}
//                     {msg.text && renderMessageText(msg, isSender)}

//                     <p className="mt-1 text-xs text-gray-300 flex items-center gap-1">
//                       {new Date(msg.createdAt).toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                       {!isSender && (
//                         <span
//                           className={`inline-block h-2 w-2 rounded-full ${
//                             isOnline ? 'bg-green-500' : 'bg-gray-500'
//                           }`}
//                         />
//                       )}
//                     </p>
//                   </div>
//                 </div>
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

//       {contextMenu && (
//         <div
//           className="absolute bg-gray-800 rounded-lg shadow-md p-2 z-50"
//           style={{ top: contextMenu.y, left: contextMenu.x }}
//         >
//           <button
//             className="block w-full text-left px-3 py-1 hover:bg-gray-700"
//             onClick={() => {
//               setEditingId(contextMenu.msg._id);
//               setEditText(contextMenu.msg.text);
//               setContextMenu(null);
//             }}
//           >
//             Edit
//           </button>
//           <button
//             className="block w-full text-left px-3 py-1 hover:bg-red-600"
//             onClick={() => {
//               deleteMessage(contextMenu.msg._id);
//               setContextMenu(null);
//             }}
//           >
//             Delete
//           </button>
//         </div>
//       )}
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

//   const { authUser, onlineUsers } = useAuthStore();
//   const messageEndRef = useRef(null);

//   const [prevLength, setPrevLength] = useState(0);
//   const [openMenuMsgId, setOpenMenuMsgId] = useState(null);
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
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedUser]);

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

//   // Close menu on outside / ESC
//   useEffect(() => {
//     const onClick = () => setOpenMenuMsgId(null);
//     const onKey = (e) => {
//       if (e.key === 'Escape') {
//         setOpenMenuMsgId(null);
//         setEditingId(null);
//       }
//     };
//     window.addEventListener('click', onClick);
//     window.addEventListener('keydown', onKey);
//     return () => {
//       window.removeEventListener('click', onClick);
//       window.removeEventListener('keydown', onKey);
//     };
//   }, []);

//   const isUserTyping = typingStatus[selectedUser?._id];

//   const handleDelete = async (id) => {
//     try {
//       await deleteMessage(id);
//       toast.success('Message deleted');
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
//     } catch {
//       toast.error('Failed to edit');
//     }
//   };

//   const openMenuFor = (e, msg, isSender) => {
//     if (!isSender) return;
//     e.stopPropagation();
//     e.preventDefault?.();
//     setOpenMenuMsgId((cur) => (cur === msg._id ? null : msg._id));
//   };

//   const startLongPress = (target, msg, isSender) => {
//     if (!isSender) return null;
//     const timer = setTimeout(() => setOpenMenuMsgId(msg._id), 500);
//     const cancel = () => clearTimeout(timer);
//     target.addEventListener('pointerup', cancel, { once: true });
//     target.addEventListener('pointerleave', cancel, { once: true });
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

//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//         {isMessagesLoading ? (
//           <MessagesLoadingSkeleton />
//         ) : messages.length === 0 ? (
//           <NoChatHistoryPlaceholder name={selectedUser.fullName} />
//         ) : (
//           <div className="space-y-4">
//             <AnimatePresence>
//               {messages.map((msg) => {
//                 const isSender = msg.senderId === authUser._id;
//                 const isOnline = onlineUsers.includes(msg.senderId);

//                 return (
//                   <motion.div
//                     key={msg._id}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{ duration: 0.2 }}
//                     className={`group flex ${
//                       isSender ? 'justify-end' : 'justify-start'
//                     }`}
//                   >
//                     <div
//                       className={`relative max-w-xs break-words rounded-2xl px-4 py-2 shadow-lg whitespace-pre-wrap ${
//                         isSender
//                           ? 'bg-cyan-600 text-white'
//                           : 'bg-slate-800 text-slate-200'
//                       }`}
//                       onContextMenu={(e) => openMenuFor(e, msg, isSender)}
//                       onPointerDown={(e) =>
//                         e.pointerType === 'touch' &&
//                         startLongPress(e.currentTarget, msg, isSender)
//                       }
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       {/* 3-dot button */}
//                       {isSender && (
//                         <>
//                           <button
//                             type="button"
//                             onClick={(e) => openMenuFor(e, msg, isSender)}
//                             className="absolute -top-2 right-2 z-10 block rounded-full bg-gray-700/80 p-1 text-xs md:hidden"
//                           >
//                             ⋯
//                           </button>
//                           <button
//                             type="button"
//                             onClick={(e) => openMenuFor(e, msg, isSender)}
//                             className="absolute -top-3 right-2 z-10 hidden rounded-full bg-gray-700/80 p-1 text-xs md:block md:group-hover:block"
//                           >
//                             ⋯
//                           </button>
//                         </>
//                       )}

//                       {/* Message text / edit */}
//                       {editingId === msg._id ? (
//                         <div className="flex w-full items-center gap-2">
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
//                           {msg.image && (
//                             <img
//                               src={msg.image}
//                               alt="Shared"
//                               className="mb-2 max-h-60 w-full rounded-lg object-cover"
//                             />
//                           )}
//                           {msg.text && (
//                             <p className="whitespace-pre-wrap">{msg.text}</p>
//                           )}
//                         </>
//                       )}

//                       <p className="mt-1 flex items-center gap-2 text-xs text-gray-300">
//                         {new Date(msg.createdAt).toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
//                         {!isSender && (
//                           <span
//                             className={`inline-block h-2 w-2 rounded-full ${
//                               isOnline ? 'bg-green-500' : 'bg-gray-500'
//                             }`}
//                           />
//                         )}
//                       </p>

//                       <AnimatePresence>
//                         {openMenuMsgId === msg._id && isSender && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.9 }}
//                             transition={{ duration: 0.15 }}
//                             className="absolute right-0 top-0 mt-8 w-40 rounded-lg bg-gray-800 p-1 shadow-lg ring-1 ring-gray-700 z-20"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <button
//                               className="block w-full rounded px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-700"
//                               onClick={() => {
//                                 setEditingId(msg._id);
//                                 setEditText(msg.text || '');
//                                 setOpenMenuMsgId(null);
//                               }}
//                             >
//                               ✏️ Edit
//                             </button>

//                             <button
//                               className="mt-1 block w-full rounded px-3 py-2 text-left text-sm text-red-400 hover:bg-red-600/30"
//                               onClick={() => {
//                                 const ok = window.confirm(
//                                   'Delete this message?',
//                                 );
//                                 if (ok) handleDelete(msg._id);
//                                 setOpenMenuMsgId(null);
//                               }}
//                             >
//                               🗑️ Delete
//                             </button>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
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

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isSender = msg.senderId === authUser._id;

              return (
                <div
                  key={msg._id}
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
                        ? 'bg-cyan-600 text-white'
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
                      <p>{msg.text}</p>
                    )}

                    {/* Timestamp */}
                    <p className="mt-1 text-xs text-gray-300">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>

                    {/* Toolbar absolutely positioned */}
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
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 text-xs bg-red-600 rounded text-white"
                            onClick={() => handleDelete(msg._id)}
                          >
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
