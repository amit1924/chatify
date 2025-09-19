// import { create } from 'zustand';
// import { axiosInstance } from '../lib/axios';
// import { useAuthStore } from './useAuthStore';
// import toast from 'react-hot-toast';

// export const useChatStore = create((set, get) => ({
//   allContacts: [],
//   chats: [],
//   messages: [],
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true,
//   typingStatus: {}, // { userId: true/false }
//   activeTab: 'chats',
//   unreadCounts: {}, // { userId: number }

//   setSelectedUser: (user) => {
//     // When selecting a chat, clear its unread count
//     set((state) => ({
//       selectedUser: user,
//       unreadCounts: { ...state.unreadCounts, [user._id]: 0 },
//     }));
//   },
//   setActiveTab: (tab) => set({ activeTab: tab }),

//   toggleSound: () => {
//     set((state) => {
//       const newValue = !state.isSoundEnabled;
//       localStorage.setItem('isSoundEnabled', JSON.stringify(newValue));
//       return { isSoundEnabled: newValue };
//     });
//   },

//   getAllContacts: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get('/messages/contacts');
//       set({ allContacts: res.data });
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error fetching contacts');
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMyChatPartners: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get('/messages/chats');
//       set({ chats: res.data });
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error fetching chats');
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessagesByUserId: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error fetching messages');
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (data) => {
//     const { selectedUser, messages } = get();
//     const authUser = useAuthStore.getState().authUser;

//     const tempMsg = {
//       _id: `temp-${Date.now()}`,
//       senderId: authUser._id,
//       receiverId: selectedUser._id,
//       text: data.text,
//       image: data.image,
//       createdAt: new Date().toISOString(),
//       isOptimistic: true,
//     };

//     set({ messages: [...messages, tempMsg] });

//     try {
//       const res = await axiosInstance.post(
//         `/messages/send/${selectedUser._id}`,
//         data,
//       );
//       set({ messages: [...messages.filter((m) => !m.isOptimistic), res.data] });
//     } catch (err) {
//       set({ messages }); // rollback
//       toast.error(err.response?.data?.message || 'Message failed');
//     }
//   },

//   sendTypingStatus: (receiverId, isTyping) => {
//     const socket = useAuthStore.getState().socket;
//     if (socket) socket.emit('typing', { receiverId, isTyping });
//   },

//   subscribeToTyping: () => {
//     const socket = useAuthStore.getState().socket;
//     if (!socket) return;

//     socket.on('typing', ({ senderId, isTyping }) => {
//       set((state) => ({
//         typingStatus: { ...state.typingStatus, [senderId]: isTyping },
//       }));
//     });
//   },
//   unsubscribeFromTyping: () => {
//     const socket = useAuthStore.getState().socket;
//     socket?.off('typing');
//   },

//   subscribeToMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     const { selectedUser, isSoundEnabled } = get();
//     if (!socket) return;

//     const notificationAudio = new Audio('/sounds/notification.mp3');

//     socket.on('newMessage', (msg) => {
//       const currentMessages = get().messages;

//       // If the chat is currently open → push to messages
//       if (selectedUser && msg.senderId === selectedUser._id) {
//         set({ messages: [...currentMessages, msg] });
//       } else {
//         // Else increment unread count
//         set((state) => ({
//           unreadCounts: {
//             ...state.unreadCounts,
//             [msg.senderId]: (state.unreadCounts[msg.senderId] || 0) + 1,
//           },
//         }));
//       }

//       if (isSoundEnabled) {
//         notificationAudio.currentTime = 0;
//         notificationAudio.play().catch(() => {});
//       }
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket?.off('newMessage');
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
  activeTab: 'chats',
  unreadCounts: {}, // { userId: number }

  //   ✅ Updated setter
  setSelectedUser: (user) => {
    set((state) => {
      if (!user) {
        return { selectedUser: null };
      }
      return {
        selectedUser: user,
        unreadCounts: { ...state.unreadCounts, [user._id]: 0 },
      };
    });
  },

  //active tab functionality
  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleSound: () => {
    set((state) => {
      const newValue = !state.isSoundEnabled;
      localStorage.setItem('isSoundEnabled', JSON.stringify(newValue));
      return { isSoundEnabled: newValue };
    });
  },

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
      set({ messages }); // rollback
      toast.error(err.response?.data?.message || 'Message failed');
    }
  },

  deleteMessage: async (messageId) => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== messageId),
      }));

      // 🔴 notify receiver in real-time
      if (socket && selectedUser) {
        socket.emit('messageDeleted', {
          receiverId: selectedUser._id,
          messageId,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  },

  editMessage: async (messageId, newText) => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    try {
      const res = await axiosInstance.put(`/messages/${messageId}`, {
        text: newText,
      });

      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, text: res.data.text } : m,
        ),
      }));

      // 🟢 notify receiver in real-time
      if (socket && selectedUser) {
        socket.emit('messageEdited', {
          receiverId: selectedUser._id,
          messageId,
          newText: res.data.text,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to edit');
    }
  },

  sendTypingStatus: (receiverId, isTyping) => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.emit('typing', { receiverId, isTyping });
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
    const { selectedUser } = get();
    const authUser = useAuthStore.getState().authUser;

    if (!socket) return;

    // 🔄 Clean old listeners first
    socket.off('newMessage');
    socket.off('messageDeleted');
    socket.off('messageEdited');

    // 🟢 Handle new message
    socket.on('newMessage', (msg) => {
      const currentMessages = get().messages;

      if (selectedUser && msg.senderId === selectedUser._id) {
        // If chat is open with sender → show immediately
        set({ messages: [...currentMessages, msg] });
      } else if (msg.receiverId === authUser._id) {
        // If it's for me but not in the open chat → increase unread
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [msg.senderId]: (state.unreadCounts[msg.senderId] || 0) + 1,
          },
        }));

        // 🔔 Toast notification
        toast.success(`New message from ${msg.senderName || 'Someone'}`);

        // 🎵 Play sound if enabled
        if (get().isSoundEnabled) {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        }

        // 🌐 Browser Notification with click-to-open
        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification(
            msg.senderName || 'New message',
            {
              body: msg.text || '📷 Image',
              icon: msg.senderAvatar || '/hacker.png',
            },
          );

          // 🖱️ Open chat when clicked
          notification.onclick = () => {
            window.focus();
            set({
              selectedUser: {
                _id: msg.senderId,
                name: msg.senderName,
                avatar: msg.senderAvatar,
              },
            });
          };
        }
      }
    });

    // 🔴 Handle deletes
    socket.on('messageDeleted', ({ messageId }) => {
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== messageId),
      }));
    });

    // 🟢 Handle edits
    socket.on('messageEdited', ({ messageId, newText }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, text: newText } : m,
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off('newMessage');
    socket?.off('messageDeleted');
    socket?.off('messageEdited');
  },
}));
