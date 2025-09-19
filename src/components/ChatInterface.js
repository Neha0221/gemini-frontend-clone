import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiImage, FiMoreVertical } from 'react-icons/fi';
import { generateAIResponse } from '../utils/api';
import { copyToClipboard, throttle } from '../utils/helpers';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import styles from '../styles/ChatInterface.module.css';

const ChatInterface = ({ chatroom, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { user } = useAuthStore();
  const { 
    addMessage, 
    getCurrentMessages, 
    getCurrentPagination,
    loadMoreMessages,
    setTyping, 
    darkMode 
  } = useChatStore();

  const messages = getCurrentMessages();
  const pagination = getCurrentPagination();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize with some mock messages for pagination demo
  useEffect(() => {
    if (chatroom && messages.length === 0) {
      const initialMessages = generateMockMessages(15); // Start with 15 messages
      loadMoreMessages(chatroom.id, initialMessages);
    }
  }, [chatroom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoading) {
      // Simulate loading more messages (in a real app, this would fetch from API)
      const moreMessages = generateMockMessages(10); // Generate 10 more messages
      loadMoreMessages(chatroom.id, moreMessages);
    }
  };

  // Helper function to generate mock messages for pagination demo
  const generateMockMessages = (count) => {
    const mockMessages = [];
    for (let i = 0; i < count; i++) {
      mockMessages.push({
        id: `mock-${Date.now()}-${i}`,
        content: `This is a mock message ${i + 1} for pagination testing.`,
        type: 'text',
        sender: i % 2 === 0 ? 'user' : 'ai',
        timestamp: new Date(Date.now() - (count - i) * 60000).toISOString(),
        user: {
          id: 'user-1',
          name: 'User',
          avatar: null
        }
      });
    }
    return mockMessages;
  };

  // Throttled AI response generation
  const throttledAIResponse = throttle(async (content) => {
    try {
      const aiResponse = await generateAIResponse(content);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        type: 'text',
        sender: 'ai',
        timestamp: aiResponse.timestamp,
        isAI: true
      };

      addMessage(chatroom.id, aiMessage);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setTyping(false);
    }
  }, 1000); // Throttle AI responses to max 1 per second

  const handleSendMessage = async (content, type = 'text') => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      type,
      sender: 'user',
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    };

    addMessage(chatroom.id, userMessage);
    setIsLoading(true);
    setIsTyping(true);
    setTyping(true);

    try {
      // Simulate AI thinking delay
      const delay = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Use throttled AI response
      await throttledAIResponse(content);
    } catch (error) {
      console.error('Error in message handling:', error);
      setIsLoading(false);
      setIsTyping(false);
      setTyping(false);
    }
  };


  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      try {
        // Convert image to base64 for preview
        const base64 = await convertToBase64(file);
        setImagePreview(base64);
        setSelectedFile(file);
        toast.success('Image selected. Click "Send Image" to upload.');
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to process image');
      }
    }
  };

  const handleSendImage = async () => {
    if (!selectedFile || !imagePreview) return;

    try {
      // Create image message
      const imageMessage = {
        id: Date.now().toString(),
        content: imagePreview,
        type: 'image',
        sender: 'user',
        timestamp: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        },
        imageData: {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        }
      };

      // Add message to chat
      addMessage(chatroom.id, imageMessage);
      toast.success('Image uploaded successfully');
      
      // Reset state
      setImagePreview(null);
      setSelectedFile(null);
      setShowImageUpload(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleCancelImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };



  return (
    <div className={`${styles.chatInterface} ${darkMode ? styles.dark : ''}`}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          <FiArrowLeft />
        </button>
        
        <div className={styles.chatroomInfo}>
          <h2 className={styles.chatroomTitle}>{chatroom.title}</h2>
          <p className={styles.messageCount}>
            {messages.length} messages
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <button
            className={styles.actionButton}
            onClick={() => setShowImageUpload(!showImageUpload)}
            title="Upload image"
          >
            <FiImage />
          </button>
          
          <button
            className={styles.actionButton}
            title="More options"
          >
            <FiMoreVertical />
          </button>
        </div>
      </header>

      <div className={styles.messagesContainer}>
        <MessageList 
          messages={messages}
          onLoadMore={handleLoadMore}
          hasMore={pagination.hasMore}
          isLoading={isLoading}
        />
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        {showImageUpload && (
          <div className={styles.imageUploadArea}>
            {!imagePreview ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <button
                  className={styles.uploadButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiImage />
                  Choose Image
                </button>
              </>
            ) : (
              <div className={styles.imagePreviewContainer}>
                <div className={styles.imagePreview}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                  <div className={styles.imageInfo}>
                    <span className={styles.fileName}>
                      {selectedFile?.name}
                    </span>
                    <span className={styles.fileSize}>
                      {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <div className={styles.imageActions}>
                  <button
                    className={styles.sendButton}
                    onClick={handleSendImage}
                  >
                    Send Image
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelImage}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default ChatInterface;
