import { MessageCircleIcon } from 'lucide-react';

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-8 py-8">
      {/* Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
      </div>

      {/* Heading */}
      <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">
        Select a conversation
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm sm:text-base max-w-md">
        Choose a contact from the sidebar to start chatting or continue a
        previous conversation.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;
