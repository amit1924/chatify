// import { useState } from 'react';
// import { useChatStore } from '../store/useChatStore';

// import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
// import ProfileHeader from '../components/ProfileHeader';
// import ActiveTabSwitch from '../components/ActiveTabSwitch ';
// import ChatsList from '../components/ChatsList';
// import ContactList from '../components/ContactList';
// import ChatContainer from '../components/ChatContainer';
// import NoConversationPlaceholder from '../components/NoConversationPlaceholder ';
// import { Menu } from 'lucide-react';
// import { X } from 'lucide-react';

// export default function ChatPage() {
//   const { activeTab, selectedUser } = useChatStore();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
//       <BorderAnimatedContainer className="relative flex h-full w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl">
//         {/* SIDEBAR */}
//         <aside
//           className={`absolute left-0 top-0 z-20 h-full w-72 transform bg-gray-800/90 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 sm:flex sm:flex-col
//             ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
//         >
//           <ProfileHeader />
//           <ActiveTabSwitch />
//           <div className="flex-1 overflow-y-auto px-2 pb-4">
//             {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
//           </div>
//         </aside>

//         {/* MAIN CHAT AREA */}
//         <main className="flex flex-1 flex-col bg-gray-900">
//           {/* Mobile top bar */}
//           <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-800 px-4 py-3 sm:hidden">
//             {!isSidebarOpen ? (
//               <button
//                 onClick={() => setIsSidebarOpen(true)}
//                 className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
//               >
//                 <Menu className="h-5 w-5 text-white" />
//               </button>
//             ) : (
//               <button
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
//               >
//                 <X className="h-5 w-5 text-white" />
//               </button>
//             )}
//             <h2 className="ml-2 text-lg font-semibold">Chat</h2>
//           </div>

//           {/* Chat content */}
//           <div className="flex-1 flex flex-col overflow-hidden">
//             {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
//           </div>
//         </main>
//       </BorderAnimatedContainer>

//       {/* Backdrop for mobile sidebar */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 z-10 bg-black/50 sm:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

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
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center safe-area-bottom">
      <BorderAnimatedContainer className="relative flex h-full w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl">
        {/* SIDEBAR */}
        <aside
          className={`absolute left-0 top-0 z-20 h-full w-72 transform bg-gray-800/90 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 sm:flex sm:flex-col
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="flex flex-1 flex-col bg-gray-900 h-full">
          {/* Mobile top bar */}
          <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-800 px-4 py-3 sm:hidden">
            {!isSidebarOpen ? (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>
            ) : (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            )}
            <h2 className="ml-2 text-lg font-semibold">Chat</h2>
          </div>

          {/* Chat content - FIXED: Added proper height constraints */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {' '}
            {/* Critical: min-h-0 allows proper flex shrinking */}
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </main>
      </BorderAnimatedContainer>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
