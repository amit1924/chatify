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

  // -------------------------
  // Set selected user (resets unread count)
  // -------------------------
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

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleSound: () => {
    set((state) => {
      const newValue = !state.isSoundEnabled;
      localStorage.setItem('isSoundEnabled', JSON.stringify(newValue));
      return { isSoundEnabled: newValue };
    });
  },

  // -------------------------
  // API calls
  // -------------------------
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
      // Optionally mark visible messages as seen here (frontend will call markMessageAsSeen when appropriate)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // -------------------------
  // Send message (supports replyTo) with optimistic update
  // data: { text, image (base64 or url), replyTo }
  // -------------------------
  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;

    if (!selectedUser) {
      toast.error('No recipient selected');
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: data.text || '',
      image: data.image || null,
      replyTo: data.replyTo || null,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      deliveredTo: [],
      seenBy: [],
    };

    // optimistic UI update
    set({ messages: [...messages, tempMsg] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        {
          text: data.text,
          image: data.image,
          replyTo: data.replyTo,
        },
      );

      // replace optimistic msg with server message
      set((state) => ({
        messages: state.messages.map((m) => (m._id === tempId ? res.data : m)),
      }));

      // Optionally emit delivered event locally if server returns delivered info
    } catch (err) {
      // rollback
      set({ messages });
      console.error('❌ sendMessage error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Message failed');
    }
  },

  // -------------------------
  // Delete / Edit
  // -------------------------
  deleteMessage: async (messageId) => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== messageId),
      }));

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

  // -------------------------
  // Read / Delivered receipts
  // -------------------------
  // Mark a single message as seen (frontend should call when user views the message/chat)
  markMessageAsSeen: async (messageId) => {
    try {
      const res = await axiosInstance.put(`/messages/seen/${messageId}`);
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? res.data : m,
        ),
      }));
    } catch (err) {
      console.error('❌ markMessageAsSeen error:', err);
    }
  },

  // Optional: mark all messages from selectedUser as seen (call on opening chat)
  // markAllMessagesFromSelectedAsSeen: async () => {
  //   const { selectedUser, messages } = get();
  //   if (!selectedUser) return;
  //   // find unread messages from selectedUser
  //   const unread = messages.filter(
  //     (m) =>
  //       m.senderId === selectedUser._id &&
  //       !(m.seenBy || []).includes(useAuthStore.getState().authUser._id),
  //   );
  //   // mark each (could be batched on backend)
  //   for (const m of unread) {
  //     get().markMessageAsSeen(m._id);
  //   }
  // },

  markAllMessagesFromSelectedAsSeen: async () => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    const authUserId = useAuthStore.getState().authUser._id;

    const unread = messages.filter(
      (m) =>
        m.senderId === selectedUser._id &&
        !(m.seenBy || []).includes(authUserId),
    );

    // Optimistically update UI
    set((state) => ({
      messages: state.messages.map((m) =>
        unread.find((u) => u._id === m._id)
          ? { ...m, seenBy: [...(m.seenBy || []), authUserId] }
          : m,
      ),
    }));

    // Now update backend
    await Promise.all(unread.map((m) => get().markMessageAsSeen(m._id)));
  },

  // -------------------------
  // Typing indicator
  // -------------------------
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

  // -------------------------
  // Socket subscriptions: messages + receipts + edits + deletes
  // -------------------------
  // subscribeToMessages: () => {
  //   const socket = useAuthStore.getState().socket;
  //   const { selectedUser } = get();
  //   const authUser = useAuthStore.getState().authUser;

  //   if (!socket) return;

  //   if (selectedUser && msg.senderId === selectedUser._id) {
  //     // Show immediately
  //     set({ messages: [...currentMessages, msg] });

  //     // Optimistic seen
  //     const authUserId = authUser._id;
  //     set((state) => ({
  //       messages: state.messages.map((m) =>
  //         m._id === msg._id
  //           ? { ...m, seenBy: [...(m.seenBy || []), authUserId] }
  //           : m,
  //       ),
  //     }));

  //     // Fire backend update
  //     get().markMessageAsSeen(msg._id);
  //   }

  //   // clear old listeners
  //   socket.off('newMessage');
  //   socket.off('messageDeleted');
  //   socket.off('messageEdited');
  //   socket.off('messageSeen');
  //   socket.off('messageDelivered');

  //   // new incoming message
  //   socket.on('newMessage', (msg) => {
  //     const currentMessages = get().messages;

  //     if (selectedUser && msg.senderId === selectedUser._id) {
  //       // chat open with sender → show immediately
  //       set({ messages: [...currentMessages, msg] });

  //       // immediately mark as seen (fire-and-forget)
  //       get().markMessageAsSeen(msg._id);
  //     } else if (msg.receiverId === authUser._id) {
  //       // message for me but chat not open → increment unread
  //       set((state) => ({
  //         unreadCounts: {
  //           ...state.unreadCounts,
  //           [msg.senderId]: (state.unreadCounts[msg.senderId] || 0) + 1,
  //         },
  //       }));

  //       // toast + sound
  //       toast.success(`New message from ${msg.senderName || 'Someone'}`);
  //       if (get().isSoundEnabled) {
  //         const audio = new Audio('/notification.mp3');
  //         audio.play().catch(() => {});
  //       }

  //       // browser notification if permitted
  //       if ('Notification' in window && Notification.permission === 'granted') {
  //         const notification = new Notification(
  //           msg.senderName || 'New message',
  //           {
  //             body: msg.text || '📷 Image',
  //             icon: msg.senderAvatar || '/hacker.png',
  //           },
  //         );
  //         notification.onclick = () => {
  //           window.focus();
  //           set({
  //             selectedUser: {
  //               _id: msg.senderId,
  //               name: msg.senderName,
  //               avatar: msg.senderAvatar,
  //             },
  //           });
  //         };
  //       }
  //     }
  //   });

  //   // message deleted
  //   socket.on('messageDeleted', ({ messageId }) => {
  //     set((state) => ({
  //       messages: state.messages.filter((m) => m._id !== messageId),
  //     }));
  //   });

  //   // message edited
  //   socket.on('messageEdited', ({ messageId, newText }) => {
  //     set((state) => ({
  //       messages: state.messages.map((m) =>
  //         m._id === messageId ? { ...m, text: newText } : m,
  //       ),
  //     }));
  //   });

  //   // delivery receipt
  //   socket.on('messageDelivered', ({ messageId, deliveredTo }) => {
  //     set((state) => ({
  //       messages: state.messages.map((m) =>
  //         m._id === messageId
  //           ? {
  //               ...m,
  //               deliveredTo: [
  //                 ...new Set([...(m.deliveredTo || []), deliveredTo]),
  //               ],
  //             }
  //           : m,
  //       ),
  //     }));
  //   });

  //   // read receipt
  //   socket.on('messageSeen', ({ messageId, seenBy }) => {
  //     set((state) => ({
  //       messages: state.messages.map((m) =>
  //         m._id === messageId
  //           ? { ...m, seenBy: [...new Set([...(m.seenBy || []), seenBy])] }
  //           : m,
  //       ),
  //     }));
  //   });
  // },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
    const { selectedUser } = get();

    if (!socket) return;

    // Clear old listeners first
    socket.off('newMessage');
    socket.off('messageDeleted');
    socket.off('messageEdited');
    socket.off('messageSeen');
    socket.off('messageDelivered');

    // Listen for new messages
    socket.on('newMessage', (msg) => {
      const currentMessages = get().messages;

      if (selectedUser && msg.senderId === selectedUser._id) {
        // Add message immediately
        set({ messages: [...currentMessages, msg] });

        // Optimistic read (double tick) update
        const authUserId = authUser._id;
        set((state) => ({
          messages: state.messages.map((m) =>
            m._id === msg._id
              ? {
                  ...m,
                  seenBy: [...new Set([...(m.seenBy || []), authUserId])],
                }
              : m,
          ),
        }));

        // Fire backend update
        get().markMessageAsSeen(msg._id);
      } else if (msg.receiverId === authUser._id) {
        // Chat not open, increase unread count
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [msg.senderId]: (state.unreadCounts[msg.senderId] || 0) + 1,
          },
        }));

        // Notifications
        toast.success(`New message from ${msg.senderName || 'Someone'}`);
        if (get().isSoundEnabled) {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        }

        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification(
            msg.senderName || 'New message',
            {
              body: msg.text || '📷 Image',
              icon: msg.senderAvatar || '/hacker.png',
            },
          );
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

    // message deleted
    socket.on('messageDeleted', ({ messageId }) => {
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== messageId),
      }));
    });

    // message edited
    socket.on('messageEdited', ({ messageId, newText }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, text: newText } : m,
        ),
      }));
    });

    // delivery receipt
    socket.on('messageDelivered', ({ messageId, deliveredTo }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId
            ? {
                ...m,
                deliveredTo: [
                  ...new Set([...(m.deliveredTo || []), deliveredTo]),
                ],
              }
            : m,
        ),
      }));
    });

    // read receipt
    socket.on('messageSeen', ({ messageId, seenBy }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId
            ? { ...m, seenBy: [...new Set([...(m.seenBy || []), seenBy])] }
            : m,
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off('newMessage');
    socket?.off('messageDeleted');
    socket?.off('messageEdited');
    socket?.off('messageSeen');
    socket?.off('messageDelivered');
  },
}));
