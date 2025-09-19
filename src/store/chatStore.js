import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      messages: {},
      messagePagination: {}, // Track pagination state for each chatroom
      isLoading: false,
      isTyping: false,
      searchQuery: '',
      darkMode: false,
      pageSize: 20, // Messages per page
      
      // Chatroom management
      createChatroom: (chatroom) => {
        const newChatroom = {
          id: Date.now().toString(),
          title: chatroom.title,
          createdAt: new Date().toISOString(),
          lastMessage: null,
          messageCount: 0
        };
        set(state => ({
          chatrooms: [newChatroom, ...state.chatrooms],
          messages: {
            ...state.messages,
            [newChatroom.id]: []
          },
          messagePagination: {
            ...state.messagePagination,
            [newChatroom.id]: {
              currentPage: 1,
              hasMore: true,
              totalMessages: 0
            }
          }
        }));
        return newChatroom;
      },
      
      deleteChatroom: (chatroomId) => {
        set(state => {
          const newChatrooms = state.chatrooms.filter(room => room.id !== chatroomId);
          const newMessages = { ...state.messages };
          const newPagination = { ...state.messagePagination };
          delete newMessages[chatroomId];
          delete newPagination[chatroomId];
          
          return {
            chatrooms: newChatrooms,
            messages: newMessages,
            messagePagination: newPagination,
            currentChatroom: state.currentChatroom?.id === chatroomId ? null : state.currentChatroom
          };
        });
      },
      
      setCurrentChatroom: (chatroom) => set({ currentChatroom: chatroom }),
      
      // Message management
      addMessage: (chatroomId, message) => {
        set(state => {
          const newMessages = {
            ...state.messages,
            [chatroomId]: [...(state.messages[chatroomId] || []), message]
          };
          
          // Update chatroom last message
          const updatedChatrooms = state.chatrooms.map(room => 
            room.id === chatroomId 
              ? { 
                  ...room, 
                  lastMessage: message.content,
                  messageCount: (state.messages[chatroomId] || []).length + 1
                }
              : room
          );
          
          return {
            messages: newMessages,
            chatrooms: updatedChatrooms
          };
        });
      },
      
      loadMoreMessages: (chatroomId, newMessages) => {
        set(state => {
          const currentMessages = state.messages[chatroomId] || [];
          const currentPagination = state.messagePagination[chatroomId] || { currentPage: 1, hasMore: true, totalMessages: 0 };
          
          return {
            messages: {
              ...state.messages,
              [chatroomId]: [...newMessages, ...currentMessages]
            },
            messagePagination: {
              ...state.messagePagination,
              [chatroomId]: {
                ...currentPagination,
                currentPage: currentPagination.currentPage + 1,
                hasMore: newMessages.length === state.pageSize
              }
            }
          };
        });
      },
      
      initializeMessages: (chatroomId, initialMessages, totalCount) => {
        set(state => ({
          messages: {
            ...state.messages,
            [chatroomId]: initialMessages
          },
          messagePagination: {
            ...state.messagePagination,
            [chatroomId]: {
              currentPage: 1,
              hasMore: initialMessages.length < totalCount,
              totalMessages: totalCount
            }
          }
        }));
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      setTyping: (typing) => set({ isTyping: typing }),
      
      // Search and UI
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      
      // Get filtered chatrooms
      getFilteredChatrooms: () => {
        const { chatrooms, searchQuery } = get();
        if (!searchQuery) return chatrooms;
        return chatrooms.filter(room => 
          room.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      },
      
      // Get messages for current chatroom
      getCurrentMessages: () => {
        const { currentChatroom, messages } = get();
        return currentChatroom ? (messages[currentChatroom.id] || []) : [];
      },
      
      // Get pagination info for current chatroom
      getCurrentPagination: () => {
        const { currentChatroom, messagePagination } = get();
        return currentChatroom ? (messagePagination[currentChatroom.id] || { currentPage: 1, hasMore: true, totalMessages: 0 }) : { currentPage: 1, hasMore: true, totalMessages: 0 };
      }
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        chatrooms: state.chatrooms,
        messages: state.messages,
        messagePagination: state.messagePagination,
        darkMode: state.darkMode
      })
    }
  )
);

export default useChatStore;
