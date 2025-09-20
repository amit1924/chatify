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

const MessageInput = ({ replyTo, setReplyTo }) => {
  const { playRandomKeystrokeSound } = useKeyboardSound();
  const { sendMessage, isSoundEnabled, selectedUser, sendTypingStatus } =
    useChatStore();

  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true });
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    setIsSending(true);
    await sendMessage({
      text: text.trim(),
      image: imagePreview,
      replyTo: replyTo?._id || null,
    });
    setIsSending(false);

    setText('');
    setImagePreview(null);
    setReplyTo(null);
    if (fileInputRef.current) fileInputRef.current.value = null;

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    textareaRef.current?.focus({ preventScroll: true });
    sendTypingStatus(selectedUser._id, false);
  };

  const handleEnterKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Use useCallback to prevent unnecessary re-renders
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

      // Auto-resize textarea without causing layout shifts
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
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

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

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

      {/* Textarea with fixed height management */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleEnterKey}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 p-2 rounded-md bg-gray-700 text-white outline-none resize-none max-h-32 overflow-y-auto border border-gray-600 transition-all duration-150"
        style={{ minHeight: '40px' }}
      />

      {/* Send button */}
      <button
        type="submit"
        disabled={isSending}
        className={`p-2 text-cyan-500 hover:text-cyan-700 transition-transform ${
          isSending ? 'animate-pulse' : ''
        }`}
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
            className="absolute top-1 right-1 bg-gray-700 rounded-full p-1 shadow"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </form>
  );
};

export default React.memo(MessageInput);
