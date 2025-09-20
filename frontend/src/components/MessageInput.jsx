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

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import useKeyboardSound from '../../hook/useKeyboardSound';
import toast from 'react-hot-toast';
import { Image, Send, X } from 'lucide-react';

const MessageInput = ({ replyTo, setReplyTo, inputRef }) => {
  const { playRandomKeystrokeSound } = useKeyboardSound();
  const { sendMessage, isSoundEnabled, selectedUser, sendTypingStatus } =
    useChatStore();

  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isComposingRef = useRef(false);

  // Use the forwarded ref or create a local one
  const actualInputRef = inputRef || React.createRef();

  // Combine refs to ensure both work
  const setCombinedRefs = useCallback(
    (element) => {
      // Set the local ref
      textareaRef.current = element;

      // Set the forwarded ref if provided
      if (actualInputRef) {
        if (typeof actualInputRef === 'function') {
          actualInputRef(element);
        } else {
          actualInputRef.current = element;
        }
      }
    },
    [actualInputRef],
  );

  useEffect(() => {
    // Focus without scrolling on mobile
    const focusInput = () => {
      if (textareaRef.current) {
        // Small delay to ensure layout is stable
        setTimeout(() => {
          textareaRef.current.focus({ preventScroll: true });
        }, 100);
      }
    };

    focusInput();
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
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

      // Maintain focus without scrolling - important for mobile
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          // Small timeout to ensure DOM updates are complete
          setTimeout(() => {
            textareaRef.current.focus({ preventScroll: true });
          }, 50);
        }
      });
    } catch (error) {
      toast.error('Failed to send message', error);
    } finally {
      setIsSending(false);
      sendTypingStatus(selectedUser._id, false);
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  // Throttled text change handler to prevent performance issues
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

      // Auto-resize textarea with better mobile handling
      const textarea = e.target;
      requestAnimationFrame(() => {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = `${newHeight}px`;

        // On mobile, scroll the messages container when input expands
        if (newHeight > 60) {
          const messagesContainer = document.querySelector(
            '[class*="overflow-y-auto"]',
          );
          if (messagesContainer) {
            setTimeout(() => {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
          }
        }
      });
    },
    [isSoundEnabled, selectedUser, sendTypingStatus, playRandomKeystrokeSound],
  );

  const handleImageChange = (e) => {
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
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Handle outside clicks to maintain focus
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // If click is outside the input but not on the keyboard
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target) &&
        e.target.tagName !== 'TEXTAREA' &&
        e.target.tagName !== 'INPUT'
      ) {
        // On mobile, maintain focus on the input
        setTimeout(() => {
          if (
            textareaRef.current &&
            document.activeElement !== textareaRef.current
          ) {
            textareaRef.current.focus({ preventScroll: true });
          }
        }, 100);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center gap-2 p-2 bg-gray-800 rounded-xl shadow-md"
    >
      {/* Reply preview */}
      {replyTo && (
        <div className="absolute -top-16 left-4 w-64 p-2 bg-gray-700 border-l-4 border-cyan-400 rounded text-xs text-gray-200">
          ↩️ Replying to: {replyTo.text || 'Media'}
          <button
            type="button"
            className="ml-2 text-red-500 font-bold"
            onClick={() => setReplyTo(null)}
          >
            ✖
          </button>
        </div>
      )}

      {/* Image upload */}
      <label className="cursor-pointer hover:scale-110 transition-transform">
        <Image className="w-6 h-6 text-slate-400 hover:text-cyan-400" />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      {/* Textarea with improved mobile handling */}
      <textarea
        ref={setCombinedRefs}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleEnterKey}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 p-2 rounded-md bg-gray-700 text-white outline-none resize-none max-h-32 overflow-y-auto border border-gray-600 transition-all duration-150"
        style={{ minHeight: '44px' }} // Minimum touch target size for mobile
      />

      {/* Send button */}
      <button
        type="submit"
        disabled={isSending || (!text.trim() && !imagePreview)}
        className={`p-2 rounded-full ${
          text.trim() || imagePreview
            ? 'bg-cyan-600 text-white hover:bg-cyan-700'
            : 'bg-gray-600 text-gray-400'
        } transition-colors ${isSending ? 'animate-pulse' : ''}`}
        style={{ minWidth: '44px', minHeight: '44px' }} // Mobile touch target
      >
        <Send className="w-5 h-5" />
      </button>

      {/* Image preview */}
      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 rounded-md object-cover"
          />
          <button
            onClick={removeImage}
            type="button"
            className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 shadow"
            style={{ width: '28px', height: '28px' }} // Mobile touch target
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </form>
  );
};

export default React.memo(MessageInput);
