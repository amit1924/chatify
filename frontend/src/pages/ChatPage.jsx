import { useState } from 'react';
import { useChatStore } from '../store/useChatStore';

import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch ';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder ';
import { Menu } from 'lucide-react';
import { X } from 'lucide-react';

export default function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative w-full h-screen max-w-7xl mx-auto sm:px-4">
      <BorderAnimatedContainer>
        {/* SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-[#0e0e0e]/80 backdrop-blur-md
                      border-r border-cyan-400/40 shadow-[0_0_25px_#0ff]
                      transform transition-transform duration-300 z-20
                      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                      sm:relative sm:translate-x-0 sm:flex sm:flex-col`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="flex-1 flex flex-col bg-[#0c0c0c]/70 backdrop-blur-sm relative border-l border-cyan-400/30 shadow-[inset_0_0_25px_#f0f]">
          {/* Mobile top bar */}
          <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-cyan-400/30 bg-black/60">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md bg-black/70 hover:bg-black/50 transition"
              >
                <Menu className="w-6 h-6 text-cyan-400" />
              </button>
            )}
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md bg-black/70 hover:bg-black/50 transition"
              >
                <X className="w-6 h-6 text-pink-400" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </main>
      </BorderAnimatedContainer>

      {/* Backdrop on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 sm:hidden z-10"
        />
      )}
    </div>
  );
}
