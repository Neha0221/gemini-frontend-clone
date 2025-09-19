import React from 'react';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import useChatStore from './store/chatStore';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import styles from './styles/App.module.css';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { currentChatroom, setCurrentChatroom } = useChatStore();

  const handleChatroomSelect = (chatroom) => {
    setCurrentChatroom(chatroom);
  };

  const handleBackToDashboard = () => {
    setCurrentChatroom(null);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.app}>
        <Auth />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    );
  }

  if (currentChatroom) {
    return (
      <div className={styles.app}>
        <ChatInterface 
          chatroom={currentChatroom}
          onBack={handleBackToDashboard}
        />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Dashboard onChatroomSelect={handleChatroomSelect} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
