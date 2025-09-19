import React, { useEffect, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { formatMessageTime, formatMessageDate, copyToClipboard } from '../utils/helpers';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import useChatStore from '../store/chatStore';
import styles from '../styles/MessageList.module.css';

const MessageList = ({ messages, onLoadMore, hasMore, isLoading }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { darkMode } = useChatStore();
  
  // Use infinite scroll hook
  const { lastElementRef } = useInfiniteScroll(onLoadMore, hasMore, isLoading);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMore && !isLoading) {
      onLoadMore();
    }
  };

  const handleCopyMessage = async (message) => {
    try {
      const success = await copyToClipboard(message.content);
      if (success) {
        toast.success('Message copied to clipboard!');
      } else {
        toast.error('Failed to copy message');
      }
    } catch (error) {
      console.error('Error copying message:', error);
      toast.error('Failed to copy message');
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div 
      className={`${styles.messageList} ${darkMode ? styles.dark : ''}`}
      onScroll={handleScroll}
      ref={messagesContainerRef}
    >
      {/* Infinite scroll trigger - invisible element at the top */}
      <div ref={lastElementRef} style={{ height: '1px' }} />
      
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
          <span>Loading more messages...</span>
        </div>
      )}
      
      {hasMore && !isLoading && (
        <div className={styles.loadMoreHint}>
          <span>Scroll up to load more messages</span>
        </div>
      )}
      
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className={styles.dateGroup}>
          <div className={styles.dateDivider}>
            <span className={styles.dateText}>{date}</span>
          </div>
          
          {dateMessages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.aiMessage
              }`}
            >
              <div className={styles.messageContent}>
                {message.type === 'image' ? (
                  <div className={styles.imageMessage}>
                    <img
                      src={message.content}
                      alt={message.imageData?.name || 'Uploaded image'}
                      className={styles.messageImage}
                    />
                    <p className={styles.imageCaption}>
                      {message.imageData?.name || 'Image'}
                    </p>
                  </div>
                ) : (
                  <p className={styles.messageText}>{message.content}</p>
                )}
                
                <div className={styles.messageActions}>
                  <button
                    className={styles.copyButton}
                    onClick={() => handleCopyMessage(message)}
                    title="Copy message"
                  >
                    <FiCopy />
                  </button>
                  <span className={styles.messageTime}>
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
