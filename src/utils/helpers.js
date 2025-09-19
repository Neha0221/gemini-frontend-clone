// Utility functions for the application

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) { // 7 days
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Format time for message display
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Handle image upload and convert to base64
export const handleImageUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image size must be less than 5MB'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        url: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Generate avatar initials
export const getAvatarInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Check if message is from today
export const isToday = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Check if message is from yesterday
export const isYesterday = (timestamp) => {
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

// Format date for message grouping
export const formatMessageDate = (timestamp) => {
  const date = new Date(timestamp);
  
  if (isToday(timestamp)) {
    return 'Today';
  } else if (isYesterday(timestamp)) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

// Throttle function for AI responses
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Generate random AI response delay
export const getRandomDelay = (min = 1000, max = 4000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
