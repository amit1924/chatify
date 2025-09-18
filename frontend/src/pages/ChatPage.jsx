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
// function ChatPage() {
//   const { activeTab, selectedUser } = useChatStore();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="relative w-full h-screen sm:max-w-6xl">
//       <BorderAnimatedContainer>
//         {/* SIDEBAR */}
//         <div
//           className={`
//             fixed top-0 left-0 h-full w-72 bg-slate-800/80 backdrop-blur-md
//             transform transition-transform duration-300 z-20
//             ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//             sm:relative sm:translate-x-0 sm:flex sm:flex-col
//           `}
//         >
//           <ProfileHeader />
//           <ActiveTabSwitch />
//           <div className="flex-1 overflow-y-auto p-4 space-y-2">
//             {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
//           </div>
//         </div>

//         {/* MAIN CHAT AREA */}
//         <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm relative">
//           {/* Mobile Toggle Button */}
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="absolute top-4 left-[-12px] sm:hidden bg-slate-800/80 p-2 rounded-lg"
//           >
//             <Menu className="w-6 h-6 text-white" />
//           </button>

//           {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
//         </div>
//       </BorderAnimatedContainer>

//       {/* BACKDROP when sidebar is open on mobile */}
//       {isSidebarOpen && (
//         <div
//           onClick={() => setIsSidebarOpen(false)}
//           className="fixed inset-0 bg-black/50 sm:hidden z-10"
//         />
//       )}
//     </div>
//   );
// }

// export default ChatPage;

export default function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative w-full h-screen sm:max-w-6xl mx-auto mt-5">
      <BorderAnimatedContainer>
        {/* SIDEBAR */}
        <div
          className={`
            fixed top-0 left-0 h-full w-72 bg-[#0f0f0f]/80 backdrop-blur-md
            border-r border-[#0ff]/50 shadow-[0_0_20px_#0ff]
            transform transition-transform duration-300 z-20
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            sm:relative sm:translate-x-0 sm:flex sm:flex-col
          `}
        >
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col bg-[#0c0c0c]/70 backdrop-blur-sm relative border-l border-[#0ff]/40 shadow-[inset_0_0_30px_#f0f]">
          {/* Mobile top bar for buttons */}
          <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-[#0ff]/30 bg-[#111]/60">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg shadow-neon bg-[#111]/80"
            >
              <Menu className="w-6 h-6 text-[#0ff]" />
            </button>
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg shadow-neon bg-[#111]/80"
              >
                <X className="w-6 h-6 text-[#f0f]" />
              </button>
            )}
          </div>

          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>

      {/* BACKDROP when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 sm:hidden z-10"
        />
      )}
    </div>
  );
}
