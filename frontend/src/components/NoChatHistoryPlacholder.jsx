import { MessageCircleIcon } from 'lucide-react';

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-8 py-8 sm:py-12">
      {/* Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-medium text-slate-200 mb-3">
        Start your conversation with{' '}
        <span className="text-cyan-400">{name}</span>
      </h3>

      {/* Description */}
      <div className="flex flex-col space-y-3 max-w-md mb-6">
        <p className="text-slate-400 text-sm sm:text-base">
          This is the beginning of your conversation. Send a message to start
          chatting!
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto"></div>
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        <button className="px-4 py-2 text-xs sm:text-sm font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors">
          👋 Say Hello
        </button>
        <button className="px-4 py-2 text-xs sm:text-sm font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors">
          🤝 How are you?
        </button>
        <button className="px-4 py-2 text-xs sm:text-sm font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors">
          📅 Meet up soon?
        </button>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
