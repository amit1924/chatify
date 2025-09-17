import React from 'react';
import { useChatStore } from '../store/useChatStore';

import ChatContainer from '../components/ChatContainer';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder ';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitcher from '../components/ActiveTabSwitcher ';
import ChatList from '../components/ChatList';
import ContactsList from '../components/ContactsList';

import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile when switching to desktop
      if (!mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }

      // Auto-open sidebar on desktop when switching from mobile
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Close sidebar when a user is selected on mobile
  useEffect(() => {
    if (selectedUser && isMobile) {
      setIsSidebarOpen(false);
    }
  }, [selectedUser, isMobile]);

  return (
    <div className="flex w-full h-full relative">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-20 bg-slate-800/95 backdrop-blur-md
          flex flex-col border-r border-slate-700 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-full sm:w-80 md:relative md:translate-x-0 md:bg-slate-800/70
          md:w-80
        `}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 z-30 text-slate-200 md:hidden bg-slate-700 p-1 rounded-md"
            onClick={() => setIsSidebarOpen(false)}
          >
            <HiX size={24} />
          </button>
        )}

        <ProfileHeader />
        <ActiveTabSwitcher />
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'chats' ? <ChatList /> : <ContactsList />}
        </div>
      </div>

      {/* Hamburger button for mobile */}
      {(!isSidebarOpen || !isMobile) && !selectedUser && (
        <button
          className="fixed top-4 left-4 z-30 md:hidden text-slate-200 bg-slate-800 p-2 rounded-lg shadow-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <HiMenu size={24} />
        </button>
      )}

      {/* Chat Area */}
      <div className="flex-1 w-full transition-all duration-300 bg-slate-900/70 backdrop-blur-md flex flex-col">
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
};

export default ChatPage;
