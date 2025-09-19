import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiImage, FiSmile } from 'react-icons/fi';
import { handleImageUpload, throttle } from '../utils/helpers';
import useChatStore from '../store/chatStore';
import styles from '../styles/MessageInput.module.css';

const MessageInput = ({ onSendMessage, disabled, placeholder = "Type a message..." }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { darkMode } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Throttled message sending to prevent rapid submissions
  const throttledSendMessage = throttle((messageContent) => {
    if (messageContent.trim() && !disabled) {
      onSendMessage(messageContent.trim());
    }
  }, 500); // Throttle to max 1 message per 500ms

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      throttledSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageData = await handleImageUpload(file);
      onSendMessage(imageData.url, 'image');
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.messageInput} ${darkMode ? 'dark' : ''}`}>
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.textInput}
            disabled={disabled || isUploading}
            rows={1}
            maxLength={2000}
          />
          
          <div className={styles.inputActions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={handleImageClick}
              disabled={disabled || isUploading}
              title="Upload image"
            >
              <FiImage />
            </button>
            
            <button
              type="button"
              className={styles.actionButton}
              disabled={disabled || isUploading}
              title="Add emoji"
            >
              <FiSmile />
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!message.trim() || disabled || isUploading}
        >
          {isUploading ? (
            <div className={styles.spinner}></div>
          ) : (
            <FiSend />
          )}
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {isUploading && (
        <div className={styles.uploadingIndicator}>
          <div className={styles.spinner}></div>
          <span>Uploading image...</span>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
