import React from 'react';
import useChatStore from '../store/chatStore';
import styles from '../styles/TypingIndicator.module.css';

const TypingIndicator = () => {
  const { darkMode } = useChatStore();

  return (
    <div className={`${styles.typingIndicator} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.typingContent}>
        <div className={styles.typingDots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        <span className={styles.typingText}>Gemini is typing...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
