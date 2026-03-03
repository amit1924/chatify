// import React, { useEffect, useRef, useState } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import useKeyboardSound from '../../hook/useKeyboardSound';
// import toast from 'react-hot-toast';
// import { Image, Send, X } from 'lucide-react';

// const MessageInput = ({ replyTo, setReplyTo }) => {
//   const { playRandomKeystrokeSound } = useKeyboardSound();
//   const { sendMessage, isSoundEnabled, selectedUser, sendTypingStatus } =
//     useChatStore();

//   const [text, setText] = useState('');
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSending, setIsSending] = useState(false);

//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   useEffect(() => {
//     textareaRef.current?.focus({ preventScroll: true });
//   }, [selectedUser]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!text.trim() && !imagePreview) return;

//     setIsSending(true);
//     await sendMessage({
//       text: text.trim(),
//       image: imagePreview,
//       replyTo: replyTo?._id || null,
//     });
//     setIsSending(false);

//     setText('');
//     setImagePreview(null);
//     setReplyTo(null);
//     if (fileInputRef.current) fileInputRef.current.value = null;

//     textareaRef.current?.focus({ preventScroll: true });
//     sendTypingStatus(selectedUser._id, false);
//   };

//   const handleEnterKey = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       handleSendMessage(e);
//     }
//   };

//   const handleTextChange = (e) => {
//     setText(e.target.value);
//     if (isSoundEnabled) playRandomKeystrokeSound();

//     if (!selectedUser) return;

//     sendTypingStatus(selectedUser._id, true);
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(
//       () => sendTypingStatus(selectedUser._id, false),
//       2000,
//     );

//     e.target.style.height = 'auto';
//     e.target.style.height = `${e.target.scrollHeight}px`;
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select a valid image file.');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => setImagePreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = null;
//   };

//   return (
//     <form
//       onSubmit={handleSendMessage}
//       className="flex items-center gap-2 p-2 bg-gray-800 rounded-xl shadow-md"
//     >
//       {/* Reply preview */}
//       {replyTo && (
//         <div className="absolute -top-16 left-4 w-64 p-2 bg-gray-700 border-l-4 border-cyan-400 rounded text-xs text-gray-200">
//           ↩️ Replying to: {replyTo.text || 'Media'}
//           <button
//             type="button"
//             className="ml-2 text-red-500 font-bold"
//             onClick={() => setReplyTo(null)}
//           >
//             ✖
//           </button>
//         </div>
//       )}

//       {/* Image upload */}
//       <label className="cursor-pointer hover:scale-110 transition-transform">
//         <Image className="w-6 h-6 text-slate-400 hover:text-cyan-400" />
//         <input
//           type="file"
//           ref={fileInputRef}
//           accept="image/*"
//           onChange={handleImageChange}
//           className="hidden"
//         />
//       </label>

//       {/* Textarea */}
//       <textarea
//         ref={textareaRef}
//         value={text}
//         onChange={handleTextChange}
//         onKeyDown={handleEnterKey}
//         placeholder="Type a message..."
//         rows={1}
//         className="flex-1 p-2 rounded-md bg-gray-700 text-white outline-none resize-none max-h-40 overflow-y-auto border border-gray-600"
//       />

//       {/* Send */}
//       <button
//         type="submit"
//         className={`p-2 text-cyan-500 hover:text-cyan-700 transition-transform ${
//           isSending ? 'animate-bounce rotate-12' : ''
//         }`}
//       >
//         <Send className="w-5 h-5" />
//       </button>

//       {/* Image preview */}
//       {imagePreview && (
//         <div className="relative">
//           <img
//             src={imagePreview}
//             alt="Preview"
//             className="w-20 h-20 rounded-md object-cover"
//           />
//           <button
//             onClick={removeImage}
//             type="button"
//             className="absolute top-1 right-1 bg-gray-700 rounded-full p-1 shadow"
//           >
//             <X className="w-4 h-4 text-red-500" />
//           </button>
//         </div>
//       )}
//     </form>
//   );
// };

// export default MessageInput;

// import React, { useEffect, useRef, useState } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import useKeyboardSound from '../../hook/useKeyboardSound';
// import toast from 'react-hot-toast';
// import { Image, Send, X, Mic } from 'lucide-react';

// const MessageInput = ({ replyTo, setReplyTo }) => {
//   const { playRandomKeystrokeSound } = useKeyboardSound();
//   const { sendMessage, isSoundEnabled, selectedUser, sendTypingStatus } =
//     useChatStore();

//   const [text, setText] = useState('');
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSending, setIsSending] = useState(false);

//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   useEffect(() => {
//     textareaRef.current?.focus({ preventScroll: true });
//   }, [selectedUser]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!text.trim() && !imagePreview) return;

//     setIsSending(true);
//     await sendMessage({
//       text: text.trim(),
//       image: imagePreview,
//       replyTo: replyTo?._id || null,
//     });
//     setIsSending(false);

//     setText('');
//     setImagePreview(null);
//     setReplyTo(null);
//     if (fileInputRef.current) fileInputRef.current.value = null;

//     textareaRef.current?.focus({ preventScroll: true });
//     sendTypingStatus(selectedUser._id, false);
//   };

//   const handleEnterKey = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       handleSendMessage(e);
//     }
//   };

//   const handleTextChange = (e) => {
//     setText(e.target.value);
//     if (isSoundEnabled) playRandomKeystrokeSound();

//     if (!selectedUser) return;

//     sendTypingStatus(selectedUser._id, true);
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(
//       () => sendTypingStatus(selectedUser._id, false),
//       2000,
//     );

//     // Auto-resize textarea
//     e.target.style.height = 'auto';
//     e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select a valid image file.');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => setImagePreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = null;
//   };

//   return (
//     <form onSubmit={handleSendMessage} className="bg-gray-800 p-2 pb-3 sm:pb-2">
//       {/* Reply preview */}
//       {replyTo && (
//         <div className="flex items-center justify-between bg-gray-700 text-gray-300 px-3 py-2 rounded-t-lg mb-1 border-l-4 border-green-500">
//           <div className="text-sm truncate flex-1">
//             <span className="font-medium">Replying to:</span>{' '}
//             {replyTo.text || 'Media'}
//           </div>
//           <button
//             type="button"
//             className="text-gray-400 hover:text-white transition-colors ml-2 flex-shrink-0"
//             onClick={() => setReplyTo(null)}
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Image preview */}
//       {imagePreview && (
//         <div className="relative mb-2 mx-2">
//           <img
//             src={imagePreview}
//             alt="Preview"
//             className="h-20 w-20 object-cover rounded-lg border border-gray-600"
//           />
//           <button
//             onClick={removeImage}
//             type="button"
//             className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors"
//           >
//             <X size={14} className="text-white" />
//           </button>
//         </div>
//       )}

//       <div className="flex items-end space-x-2">
//         {/* Image upload */}
//         <label className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors flex-shrink-0">
//           <Image size={20} className="text-gray-300" />
//           <input
//             type="file"
//             ref={fileInputRef}
//             accept="image/*"
//             onChange={handleImageChange}
//             className="hidden"
//           />
//         </label>

//         {/* Textarea */}
//         <textarea
//           ref={textareaRef}
//           value={text}
//           onChange={handleTextChange}
//           onKeyDown={handleEnterKey}
//           placeholder="Type a message..."
//           rows={1}
//           className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-2xl px-4 py-3 max-h-32 resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
//           style={{ minHeight: '44px' }}
//         />

//         {/* Voice message button (mobile) or Send button */}
//         {text.trim() || imagePreview ? (
//           <button
//             type="submit"
//             disabled={!text.trim() && !imagePreview}
//             className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 hover:bg-green-700 transition-colors flex-shrink-0"
//           >
//             {isSending ? (
//               <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               <Send size={18} className="text-white" />
//             )}
//           </button>
//         ) : (
//           <button
//             type="button"
//             className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors flex-shrink-0"
//           >
//             <Mic size={20} className="text-gray-300" />
//           </button>
//         )}
//       </div>
//     </form>
//   );
// };

// export default MessageInput;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import useKeyboardSound from '../../hook/useKeyboardSound';
import toast from 'react-hot-toast';
import { Image, Send, X, Mic, Paperclip } from 'lucide-react';

const MessageInput = ({ replyTo, setReplyTo }) => {
  const { playRandomKeystrokeSound } = useKeyboardSound();
  const { sendMessage, isSoundEnabled, selectedUser, sendTypingStatus } =
    useChatStore();

  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const formRef = useRef(null);

  // Memoize handlers to prevent unnecessary re-renders
  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!text.trim() && !imagePreview) return;

      setIsSending(true);
      try {
        await sendMessage({
          text: text.trim(),
          image: imagePreview,
          replyTo: replyTo?._id || null,
        });

        setText('');
        setImagePreview(null);
        setReplyTo(null);
        if (fileInputRef.current) fileInputRef.current.value = null;

        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } catch (error) {
        toast.error('Failed to send message', error);
      } finally {
        setIsSending(false);
        textareaRef.current?.focus({ preventScroll: true });
        sendTypingStatus(selectedUser._id, false);
      }
    },
    [
      text,
      imagePreview,
      replyTo,
      selectedUser,
      sendMessage,
      sendTypingStatus,
      setReplyTo,
    ],
  );

  const handleEnterKey = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
      }
    },
    [handleSendMessage],
  );

  const handleTextChange = useCallback(
    (e) => {
      const newText = e.target.value;
      setText(newText);

      if (isSoundEnabled) playRandomKeystrokeSound();

      if (!selectedUser) return;

      sendTypingStatus(selectedUser._id, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(
        () => sendTypingStatus(selectedUser._id, false),
        2000,
      );

      // Auto-resize textarea
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    },
    [isSoundEnabled, playRandomKeystrokeSound, selectedUser, sendTypingStatus],
  );

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true });
  }, [selectedUser]);

  // Handle mobile keyboard appearance
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current && isFocused) {
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFocused]);

  // Handle iOS safe area for the input
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div
      className={`bg-gray-800 border-t border-gray-700 message-input-wrapper ${
        isIOS ? 'pb-safe' : ''
      }`}
    >
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center justify-between bg-gray-700 text-gray-300 px-3 py-2 mb-1 border-l-4 border-green-500">
          <div className="text-sm truncate flex-1">
            <span className="font-medium">Replying to:</span>{' '}
            {replyTo.text || 'Media'}
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors ml-2 flex-shrink-0"
            onClick={() => setReplyTo(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="relative mx-2 mt-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-20 w-20 object-cover rounded-lg border border-gray-600"
          />
          <button
            onClick={removeImage}
            type="button"
            className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors border border-gray-600"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSendMessage}
        className="p-2 flex items-end gap-2"
      >
        {/* Attachment button */}
        <label className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors flex-shrink-0">
          <Paperclip size={20} className="text-gray-300" />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleEnterKey}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-2xl px-4 py-3 max-h-32 resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
          style={{ minHeight: '44px' }}
        />

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {text.trim() || imagePreview ? (
            <button
              type="submit"
              disabled={isSending || (!text.trim() && !imagePreview)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 transition-colors flex-shrink-0"
            >
              {isSending ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={18} className="text-white" />
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="flex md:hidden items-center justify-center h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors flex-shrink-0"
              >
                <Mic size={20} className="text-gray-300" />
              </button>
              <button
                type="submit"
                disabled
                className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 transition-colors flex-shrink-0"
              >
                <Send size={18} className="text-gray-500" />
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default React.memo(MessageInput);
