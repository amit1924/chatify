import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: 'chats',
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true,

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem('isSoundEnabled', JSON.stringify(newValue));
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: async (tab) => set({ activeTab: tab }),

  setSelectedUser: async (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/messages/contacts');
      set({ allContacts: response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/messages/chats');
      set({ chats: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch chat partners',
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));
