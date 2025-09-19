import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiPlus, FiMoon, FiSun, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { debounce } from '../utils/helpers';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import ChatroomList from './ChatroomList';
import CreateChatroomModal from './CreateChatroomModal';
import styles from '../styles/Dashboard.module.css';

const Dashboard = ({ onChatroomSelect }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { user, logout } = useAuthStore();
  const { 
    darkMode, 
    toggleDarkMode, 
    setSearchQuery: setStoreSearchQuery,
    getFilteredChatrooms 
  } = useChatStore();

  const handleSearch = debounce((query) => {
    setStoreSearchQuery(query);
  }, 300);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleCreateChatroom = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const filteredChatrooms = getFilteredChatrooms();

  return (
    <div className={`${styles.dashboard} ${darkMode ? styles.dark : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <FiMessageSquare className={styles.logoIcon} />
            <span className={styles.logoText}>Gemini Chat</span>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search chatrooms..."
              className={styles.searchInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <button
            className={styles.themeToggle}
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          
          <div className={styles.userMenu}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className={styles.userName}>{user?.name || 'User'}</span>
            </div>
            
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Chatrooms</h2>
            <button
              className={styles.createButton}
              onClick={handleCreateChatroom}
              title="Create new chatroom"
            >
              <FiPlus />
            </button>
          </div>
          
          <ChatroomList 
            chatrooms={filteredChatrooms}
            onChatroomSelect={onChatroomSelect}
          />
        </div>
        
        <div className={styles.content}>
          <div className={styles.welcomeMessage}>
            <div className={styles.welcomeIcon}>
              <FiMessageSquare />
            </div>
            <h3>Welcome to Gemini Chat</h3>
            <p>Select a chatroom to start chatting or create a new one to get started.</p>
            <button
              className={styles.getStartedButton}
              onClick={handleCreateChatroom}
            >
              Create Your Chatroom
            </button>
          </div>
        </div>
      </main>

      {showCreateModal && (
        <CreateChatroomModal 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
