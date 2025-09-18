import { useChatStore } from '../store/useChatStore';

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex justify-around mb-2 border-b border-gray-700">
      <button
        onClick={() => setActiveTab('chats')}
        className={`flex-1 py-2 text-center transition-colors rounded-t-md ${
          activeTab === 'chats'
            ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
            : 'text-slate-400 hover:bg-gray-700/50'
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab('contacts')}
        className={`flex-1 py-2 text-center transition-colors rounded-t-md ${
          activeTab === 'contacts'
            ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
            : 'text-slate-400 hover:bg-gray-700/50'
        }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
