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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    setIsSending(true);
    await sendMessage({ text: text.trim(), image: imagePreview });
    setTimeout(() => setIsSending(false), 400);

    setText('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    sendTypingStatus(selectedUser._id, false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (isSoundEnabled) playRandomKeystrokeSound();

    if (!selectedUser) return;

    sendTypingStatus(selectedUser._id, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => sendTypingStatus(selectedUser._id, false),
      2000,
    );
  };

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
      className="flex items-center gap-2 p-2 bg-white rounded-lg shadow"
    >
      {/* Image Upload */}
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

      {/* Text Input */}
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Type a message..."
        className="flex-1 p-2 outline-none rounded-md border border-slate-200"
      />

      {/* Send Button */}
      <button
        type="submit"
        className={`p-2 text-cyan-500 hover:text-cyan-700 transition-transform ${
          isSending ? 'animate-bounce rotate-12' : ''
        }`}
      >
        <Send className="w-5 h-5" />
      </button>

      {/* Image Preview */}
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
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
