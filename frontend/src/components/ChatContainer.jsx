import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlacholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingkeleton';
// eslint-disable-next-line no-unused-vars
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
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [prevLength, setPrevLength] = useState(0);
  const [activeMsgId, setActiveMsgId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  // Create refs for all messages to enable "jump to message"
  const messageRefs = useRef({});

  // Load messages & subscribe
  useEffect(() => {
    if (!selectedUser) return;

    (async () => {
      await getMessagesByUserId(selectedUser._id);
      await markAllMessagesFromSelectedAsSeen();
    })();

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
    markAllMessagesFromSelectedAsSeen,
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

  const parseLink = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const match = text?.match(urlRegex);
    return match ? match[0] : null;
  };

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
            <iframe
              width="300"
              height="170"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
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

    const link = parseLink(msg.text);
    if (link) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-2 p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
        >
          <p className="text-sm text-cyan-300 break-all">{link}</p>
          <p className="text-xs text-gray-400">🌍 External Link</p>
        </a>
      );
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

  const renderReadReceipt = (msg) => {
    if (msg.senderId !== authUser._id) return null;
    if (msg.seenBy?.length > 0)
      return <span className="text-xs text-cyan-400 ml-2">✓✓</span>;
    if (msg.deliveredTo?.length > 0)
      return <span className="text-xs text-gray-400 ml-2">✓</span>;
    return null;
  };

  if (!selectedUser) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900 text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  // Scroll to message function
  const scrollToMessage = (msgId) => {
    if (messageRefs.current[msgId]) {
      messageRefs.current[msgId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      messageRefs.current[msgId].classList.add('ring-2', 'ring-cyan-400');
      setTimeout(() => {
        messageRefs.current[msgId]?.classList.remove('ring-2', 'ring-cyan-400');
      }, 1500);
    }
  };

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
              const replyMsg = msg.replyTo; // populated reply message

              return (
                <AnimatePresence key={msg._id}>
                  <motion.div
                    ref={(el) => (messageRefs.current[msg._id] = el)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      isSender ? 'justify-end' : 'justify-start'
                    }`}
                    onMouseEnter={() => setActiveMsgId(msg._id)}
                    onMouseLeave={() => setActiveMsgId(null)}
                  >
                    <div
                      className={`relative max-w-xs break-words rounded-2xl px-4 py-2 shadow-lg whitespace-pre-wrap ${
                        isSender
                          ? 'bg-cyan-800 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {/* Reply preview */}
                      {replyMsg && (
                        <div
                          onClick={() => scrollToMessage(replyMsg._id)}
                          className="mb-1 p-2 border-l-4 border-cyan-400 bg-gray-700 text-xs text-gray-300 rounded cursor-pointer hover:bg-gray-600"
                        >
                          ↩️ {replyMsg.text || 'Media'}
                        </div>
                      )}

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

                      {/* Timestamp + Read receipts */}
                      <p className="mt-1 text-xs text-gray-300 flex items-center justify-end">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {renderReadReceipt(msg)}
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
                            {/* Sender can edit/delete */}
                            {isSender && (
                              <>
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
                              </>
                            )}

                            {/* Only incoming messages can be replied to */}
                            {!isSender && (
                              <button
                                className="px-2 py-1 text-xs bg-blue-600 rounded text-white"
                                onClick={() => {
                                  setReplyTo(msg);
                                  setActiveMsgId(null);
                                }}
                              >
                                Reply
                              </button>
                            )}
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

      <div className="border-t border-gray-700 bg-gray-800 px-4 py-3 relative">
        <MessageInput replyTo={replyTo} setReplyTo={setReplyTo} />
      </div>
    </div>
  );
};

export default ChatContainer;
