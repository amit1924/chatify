import React from 'react';
import { useChatStore } from '../store/useChatStore';

import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder ';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitcher from '../components/ActiveTabSwitcher ';
import ChatList from '../components/ChatList';
import ContactsList from '../components/ContactsList';

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative mx-auto w-full max-w-6xl h-[800px] flex rounded-xl overflow-hidden">
      {/* Left sidebar */}
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
        <ProfileHeader />
        <ActiveTabSwitcher />

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'chats' ? <ChatList /> : <ContactsList />}
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-sm flex">
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
};

export default ChatPage;
