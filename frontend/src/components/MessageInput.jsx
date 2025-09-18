// import React, { useEffect, useRef, useState } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import useKeyboardSound from '../../hook/useKeyboardSound';
// import toast from 'react-hot-toast';
// import { Image, Send, X } from 'lucide-react';

// const MessageInput = () => {
//   const { playRandomKeystrokeSound } = useKeyboardSound();
//   const { sendMessage, isSoundEnabled, selectedUser, sendTypingStatus } =
//     useChatStore();

//   const [text, setText] = useState('');
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSending, setIsSending] = useState(false);

//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   // Focus textarea on mount
//   useEffect(() => {
//     textareaRef.current?.focus({ preventScroll: true });
//   }, [selectedUser]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!text.trim() && !imagePreview) return;

//     setIsSending(true);
//     await sendMessage({ text: text.trim(), image: imagePreview });
//     setIsSending(false);

//     setText('');
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = null;

//     // Always keep focus after sending
//     textareaRef.current?.focus({ preventScroll: true });
//     sendTypingStatus(selectedUser._id, false);
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

//     // Auto resize textarea
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

//       {/* Textarea input */}
//       <textarea
//         ref={textareaRef}
//         value={text}
//         onChange={handleTextChange}
//         placeholder="Type a message..."
//         rows={1}
//         className="flex-1 p-2 rounded-md bg-gray-700 text-white outline-none resize-none max-h-40 overflow-y-auto border border-gray-600"
//       />

//       {/* Send button */}
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

import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import useKeyboardSound from '../../hook/useKeyboardSound';
import toast from 'react-hot-toast';
import { Image, Send, X } from 'lucide-react';

const MessageInput = () => {
  const { playRandomKeystrokeSound } = useKeyboardSound();
  const { sendMessage, isSoundEnabled, selectedUser, sendTypingStatus } =
    useChatStore();

  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Focus on mount or user change
  useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true });
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    setIsSending(true);
    await sendMessage({ text: text.trim(), image: imagePreview });
    setIsSending(false);

    setText('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;

    textareaRef.current?.focus({ preventScroll: true });
    sendTypingStatus(selectedUser._id, false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (isSoundEnabled) playRandomKeystrokeSound();

    if (selectedUser) {
      sendTypingStatus(selectedUser._id, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(
        () => sendTypingStatus(selectedUser._id, false),
        2000,
      );
    }

    // auto resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image.');
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

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 p-2 rounded-md bg-gray-700 text-white outline-none resize-none max-h-40 overflow-y-auto border border-gray-600"
      />

      <button
        type="submit"
        className={`p-2 text-cyan-500 hover:text-cyan-700 transition-transform ${
          isSending ? 'animate-bounce rotate-12' : ''
        }`}
      >
        <Send className="w-5 h-5" />
      </button>

      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 rounded-md object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 bg-gray-700 rounded-full p-1 shadow"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
