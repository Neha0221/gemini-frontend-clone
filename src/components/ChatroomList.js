import React from 'react';
import { toast } from 'react-hot-toast';
import { FiMessageSquare, FiTrash2, FiClock } from 'react-icons/fi';
import { formatTimestamp } from '../utils/helpers';
import useChatStore from '../store/chatStore';
import styles from '../styles/ChatroomList.module.css';

const ChatroomList = ({ chatrooms, onChatroomSelect }) => {
  const { deleteChatroom, darkMode } = useChatStore();

  const handleDeleteChatroom = (e, chatroomId) => {
    e.stopPropagation();
    
    const chatroom = chatrooms.find(room => room.id === chatroomId);
    const chatroomTitle = chatroom?.title || 'this chatroom';
    
    if (window.confirm(`Are you sure you want to delete "${chatroomTitle}"?`)) {
      deleteChatroom(chatroomId);
      toast.success(`"${chatroomTitle}" has been deleted successfully`);
    }
  };

  if (chatrooms.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FiMessageSquare className={styles.emptyIcon} />
        <p>No chatrooms yet</p>
        <span>Create your first chatroom to get started</span>
      </div>
    );
  }

  return (
    <div className={`${styles.chatroomList} ${darkMode ? styles.dark : ''}`}>
      {chatrooms.map((chatroom) => (
        <div
          key={chatroom.id}
          className={styles.chatroomItem}
          onClick={() => onChatroomSelect(chatroom)}
        >
          <div className={styles.chatroomIcon}>
            <FiMessageSquare />
          </div>
          
          <div className={styles.chatroomInfo}>
            <h3 className={styles.chatroomTitle}>{chatroom.title}</h3>
            <p className={styles.chatroomPreview}>
              {chatroom.lastMessage || 'No messages yet'}
            </p>
            <div className={styles.chatroomMeta}>
              <span className={styles.messageCount}>
                {chatroom.messageCount || 0} messages
              </span>
              <span className={styles.timestamp}>
                <FiClock />
                {formatTimestamp(chatroom.createdAt)}
              </span>
            </div>
          </div>
          
          <button
            className={styles.deleteButton}
            onClick={(e) => handleDeleteChatroom(e, chatroom.id)}
            title="Delete chatroom"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatroomList;
