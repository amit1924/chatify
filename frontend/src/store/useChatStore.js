// import { create } from 'zustand';
// import { axiosInstance } from '../lib/axios';
// import toast from 'react-hot-toast';
// import { useAuthStore } from './useAuthStore';

// export const useChatStore = create((set, get) => ({
//   allContacts: [],
//   chats: [],
//   messages: [],
//   activeTab: 'chats',
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true,

//   toggleSound: () => {
//     localStorage.setItem('isSoundEnabled', !get().isSoundEnabled);
//     set({ isSoundEnabled: !get().isSoundEnabled });
//   },

//   setActiveTab: (tab) => set({ activeTab: tab }),
//   setSelectedUser: (selectedUser) => set({ selectedUser }),

//   getAllContacts: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get('/messages/contacts');
//       set({ allContacts: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },
//   getMyChatPartners: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get('/messages/chats');
//       set({ chats: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessagesByUserId: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Something went wrong');
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     const { authUser } = useAuthStore.getState();

//     const tempId = `temp-${Date.now()}`;

//     const optimisticMessage = {
//       _id: tempId,
//       senderId: authUser._id,
//       receiverId: selectedUser._id,
//       text: messageData.text,
//       image: messageData.image,
//       createdAt: new Date().toISOString(),
//       isOptimistic: true, // flag to identify optimistic messages (optional)
//     };
//     // immidetaly update the ui by adding the message
//     set({ messages: [...messages, optimisticMessage] });

//     try {
//       const res = await axiosInstance.post(
//         `/messages/send/${selectedUser._id}`,
//         messageData,
//       );
//       set({ messages: messages.concat(res.data) });
//     } catch (error) {
//       // remove optimistic message on failure
//       set({ messages: messages });
//       toast.error(error.response?.data?.message || 'Something went wrong');
//     }
//   },

//   subscribeToMessages: () => {
//     const { selectedUser, isSoundEnabled } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;

//     socket.on('newMessage', (newMessage) => {
//       const isMessageSentFromSelectedUser =
//         newMessage.senderId === selectedUser._id;
//       if (!isMessageSentFromSelectedUser) return;

//       const currentMessages = get().messages;
//       set({ messages: [...currentMessages, newMessage] });

//       if (isSoundEnabled) {
//         const notificationSound = new Audio('/sounds/notification.mp3');

//         notificationSound.currentTime = 0; // reset to start
//         notificationSound
//           .play()
//           .catch((e) => console.log('Audio play failed:', e));
//       }
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off('newMessage');
//   },
// }));

import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true,
  typingStatus: {}, // { userId: true/false }

  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/contacts');
      set({ allContacts: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching contacts');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/chats');
      set({ chats: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching chats');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;

    const tempMsg = {
      _id: `temp-${Date.now()}`,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: data.text,
      image: data.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, tempMsg] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data,
      );
      set({ messages: [...messages.filter((m) => !m.isOptimistic), res.data] });
    } catch (err) {
      set({ messages: messages }); // rollback
      toast.error(err.response?.data?.message || 'Message failed');
    }
  },

  sendTypingStatus: (receiverId, isTyping) => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.emit('typing', { receiverId, isTyping });
    }
  },

  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on('typing', ({ senderId, isTyping }) => {
      set((state) => ({
        typingStatus: { ...state.typingStatus, [senderId]: isTyping },
      }));
    });
  },
  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off('typing');
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser, isSoundEnabled } = get();
    if (!socket || !selectedUser) return;

    socket.on('newMessage', (msg) => {
      if (msg.senderId !== selectedUser._id) return;
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, msg] });

      if (isSoundEnabled) {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {});
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off('newMessage');
  },
}));
