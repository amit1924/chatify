import { useChatStore } from '../store/useChatStore';

function ActiveTabSwitcher() {
  const { activeTab, setActiveTab } = useChatStore();

  const baseClasses =
    'px-5 py-2 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg';

  return (
    <div className="flex gap-4 justify-center bg-[#0f172a] p-3 rounded-2xl shadow-xl">
      {/* Chats Button */}
      <button
        onClick={() => setActiveTab('chats')}
        className={`${baseClasses} ${
          activeTab === 'chats'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/50'
            : 'bg-slate-800 text-slate-300 hover:text-cyan-400 hover:shadow-cyan-400/20'
        }`}
      >
        💬 Chats
      </button>

      {/* Contacts Button */}
      <button
        onClick={() => setActiveTab('contacts')}
        className={`${baseClasses} ${
          activeTab === 'contacts'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/50'
            : 'bg-slate-800 text-slate-300 hover:text-cyan-400 hover:shadow-cyan-400/20'
        }`}
      >
        👥 Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitcher;
