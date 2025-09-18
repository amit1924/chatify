// import React, { useRef, useState } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import useKeyboardSound from '../../hook/useKeyboardSound';
// import toast from 'react-hot-toast';
// import { Image, Send, X } from 'lucide-react';

// const MessageInput = () => {
//   const { playRandomKeystrokeSound } = useKeyboardSound();
//   const [text, setText] = useState('');
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSending, setIsSending] = useState(false);
//   const fileInputRef = useRef(null);

//   const { sendMessage, isSoundEnabled } = useChatStore();

//   // ✅ Handle sending message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!text.trim() && !imagePreview) return;

//     setIsSending(true);
//     await sendMessage({
//       text: text.trim(),
//       image: imagePreview,
//     });

//     setTimeout(() => setIsSending(false), 400); // reset animation

//     setText('');
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = null;
//     }
//   };

//   // ✅ Handle image file selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select a valid image file.');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   // ✅ Remove image preview
//   const removeImage = () => {
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = null;
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSendMessage}
//       className="flex items-center gap-2 p-4 border-t border-slate-700 bg-slate-800/70 relative"
//     >
//       {/* 📷 Image Upload */}
//       <label className="cursor-pointer hover:scale-110 transition-transform">
//         <Image className="w-6 h-6 text-slate-400 hover:text-cyan-400" />
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           accept="image/*"
//           onChange={handleImageChange}
//         />
//       </label>

//       {/* ⌨️ Text Input */}
//       <input
//         type="text"
//         value={text}
//         onChange={(e) => {
//           setText(e.target.value);
//           if (isSoundEnabled) playRandomKeystrokeSound();
//         }}
//         placeholder="Type a message..."
//         className="flex-1 bg-slate-700/50 text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow shadow-md"
//       />

//       {/* 📤 Send Button with animation */}
//       <button
//         type="submit"
//         className={`p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 transition transform ${
//           isSending ? 'animate-bounce rotate-12' : ''
//         }`}
//       >
//         <Send className="w-5 h-5 text-white" />
//       </button>

//       {/* 🖼️ Image Preview */}
//       {imagePreview && (
//         <div className="absolute bottom-20 left-4 bg-slate-900/90 border border-slate-700 rounded-lg p-3 shadow-lg animate-scale-in">
//           <div className="relative">
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="h-24 rounded-md object-cover"
//             />
//             <button
//               onClick={removeImage}
//               type="button"
//               className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-500 transition"
//             >
//               <X className="w-4 h-4 text-white" />
//             </button>
//           </div>
//         </div>
//       )}
//     </form>
//   );
// };

// export default MessageInput;

import React, { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import useKeyboardSound from '../../hook/useKeyboardSound';
import toast from 'react-hot-toast';
import { Image, Send, X } from 'lucide-react';

const MessageInput = () => {
  const { playRandomKeystrokeSound } = useKeyboardSound();
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, isSoundEnabled, selectedUser, sendTypingStatus } =
    useChatStore();

  // ✅ Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    setIsSending(true);
    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setTimeout(() => setIsSending(false), 400);

    setText('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;

    // notify stopped typing
    sendTypingStatus(selectedUser._id, false);
  };

  // ✅ Handle text change + typing indicator
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (isSoundEnabled) playRandomKeystrokeSound();

    if (!selectedUser) return;

    // send typing true
    sendTypingStatus(selectedUser._id, true);

    // clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // send typing false after 2s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(selectedUser._id, false);
    }, 2000);
  };

  // ✅ Handle image selection
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
      className="flex items-center gap-2 p-4 border-t border-slate-700 bg-slate-800/70 relative"
    >
      {/* Image Upload */}
      <label className="cursor-pointer hover:scale-110 transition-transform">
        <Image className="w-6 h-6 text-slate-400 hover:text-cyan-400" />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>

      {/* Text Input */}
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Type a message..."
        className="flex-1 bg-slate-700/50 text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow shadow-md"
      />

      {/* Send Button */}
      <button
        type="submit"
        className={`p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 transition transform ${
          isSending ? 'animate-bounce rotate-12' : ''
        }`}
      >
        <Send className="w-5 h-5 text-white" />
      </button>

      {/* Image Preview */}
      {imagePreview && (
        <div className="absolute bottom-20 left-4 bg-slate-900/90 border border-slate-700 rounded-lg p-3 shadow-lg animate-scale-in">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-24 rounded-md object-cover"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-500 transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
