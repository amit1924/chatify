import { MessageCircleIcon } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

function NoChatFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center space-y-4 sm:space-y-6">
      {/* Icon container */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/10 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
      </div>

      {/* Text */}
      <div className="px-4 sm:px-6">
        <h4 className="text-slate-200 font-medium text-base sm:text-lg mb-1">
          No conversations yet
        </h4>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Start a new chat by selecting a contact from the contacts tab.
        </p>
      </div>

      {/* Button */}
      <button
        onClick={() => setActiveTab('contacts')}
        className="
          px-4 py-2 sm:px-6 sm:py-3
          text-sm sm:text-base
          text-cyan-400 bg-cyan-500/10
          rounded-lg hover:bg-cyan-500/20
          transition-colors font-medium
        "
      >
        Find contacts
      </button>
    </div>
  );
}

export default NoChatFound;
