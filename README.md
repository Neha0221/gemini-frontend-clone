# Gemini Chat App

A modern, responsive chat application built with React that provides a seamless messaging experience with AI integration, real-time features, and advanced UI/UX capabilities.

## 🚀 Live Demo

Live demo at: https://gemini-frontend-clone.onrender.com

## 📋 Project Overview

This is a full-featured chat application that mimics the functionality of modern messaging platforms with the following key features:

- **Multi-chatroom Support**: Create and manage multiple chat conversations
- **Real-time Messaging**: Instant message delivery with typing indicators
- **AI Integration**: Smart responses and conversation capabilities
- **Image Sharing**: Upload and share images in conversations
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Advanced Search**: Find messages and chatrooms quickly
- **Message History**: Persistent storage with pagination and infinite scroll
- **Form Validation**: Comprehensive input validation with real-time feedback
- **Performance Optimized**: Throttling, debouncing, and efficient state management

## 🛠️ Setup and Run Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```


### Build for Production

```bash
npm run build
# or
yarn build
```

This creates a `build` folder with optimized production files.

## 📁 Folder/Component Structure

```
src/
├── components/           # React components
│   ├── Auth.js          # Authentication component
│   ├── Dashboard.js     # Main dashboard with chatroom list
│   ├── ChatInterface.js # Chat interface with messages
│   ├── MessageList.js   # Message display component
│   ├── MessageInput.js  # Message input with file upload
│   ├── ChatroomList.js  # Chatroom management
│   ├── CreateChatroomModal.js # Modal for creating chatrooms
│   ├── PhoneInput.js    # Phone number input component
│   ├── OTPVerification.js # OTP verification component
│   └── TypingIndicator.js # Typing animation component
├── hooks/               # Custom React hooks
│   ├── useInfiniteScroll.js # Infinite scroll implementation
│   ├── useKeyboardNavigation.js # Keyboard navigation
│   └── useLocalStorage.js # Local storage management
├── store/               # State management (Zustand)
│   ├── authStore.js     # Authentication state
│   └── chatStore.js     # Chat and message state
├── styles/              # CSS modules
│   ├── App.module.css   # Main app styles
│   ├── Auth.module.css  # Authentication styles
│   ├── ChatInterface.module.css # Chat interface styles
│   ├── Dashboard.module.css # Dashboard styles
│   ├── MessageList.module.css # Message list styles
│   ├── MessageInput.module.css # Message input styles
│   └── [Other component styles]
├── utils/               # Utility functions
│   ├── api.js          # API communication
│   ├── helpers.js      # Helper functions
│   └── validation.js   # Form validation schemas
└── App.js              # Main application component
```

### Component Architecture

- **App.js**: Main application component with routing logic
- **Auth.js**: Handles user authentication flow
- **Dashboard.js**: Main interface showing chatroom list
- **ChatInterface.js**: Individual chat interface
- **MessageList.js**: Displays messages with infinite scroll
- **MessageInput.js**: Input component with file upload support

## 🔧 Implementation Details

### Throttling Implementation

The application implements throttling in several key areas:

**1. AI Response Throttling** (`src/utils/helpers.js`)
```javascript
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
```

**2. Search Input Throttling** (`src/components/Dashboard.js`)
```javascript
import { debounce } from '../utils/helpers';

const handleSearch = debounce((query) => {
  setSearchQuery(query);
}, 300);
```

### Pagination Implementation

**Message Pagination** (`src/store/chatStore.js`)
- **Page Size**: 20 messages per page
- **State Management**: Tracks current page, hasMore flag, and total messages
- **Pagination State**: Stored per chatroom for independent pagination

```javascript
messagePagination: {
  [chatroomId]: {
    currentPage: 1,
    hasMore: true,
    totalMessages: 0
  }
}
```

**Load More Messages**:
```javascript
loadMoreMessages: (chatroomId, newMessages) => {
  set(state => ({
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
  }));
}
```

### Infinite Scroll Implementation

**Custom Hook** (`src/hooks/useInfiniteScroll.js`)
```javascript
export const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observerRef = useRef();
  
  const lastElementRef = useCallback((node) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        callback();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, callback]);

  return { lastElementRef };
};
```

**Usage in MessageList** (`src/components/MessageList.js`)
```javascript
const handleScroll = (e) => {
  const { scrollTop } = e.target;
  if (scrollTop === 0 && hasMore && !isLoading) {
    onLoadMore();
  }
};
```

### Form Validation Implementation

**Validation Schemas** (`src/utils/validation.js`)
```javascript
import Joi from 'joi';

// Phone number validation
export const phoneSchema = Joi.object({
  countryCode: Joi.string()
    .pattern(/^\+\d{1,4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please select a valid country code',
      'any.required': 'Country code is required'
    }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10-15 digits',
      'any.required': 'Phone number is required'
    })
});

// Message validation
export const messageSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Message cannot be empty',
      'string.max': 'Message must be less than 2000 characters',
      'any.required': 'Message content is required'
    })
});
```

**Validation Helper Function**:
```javascript
export const validateForm = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = {};
    error.details.forEach(detail => {
      const field = detail.path[0];
      errors[field] = detail.message;
    });
    return { errors, value: null };
  }
  
  return { errors: null, value };
};
```

## 🎨 Key Features

### State Management
- **Zustand**: Lightweight state management with persistence
- **Local Storage**: Automatic data persistence across sessions


### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus trapping in modals
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast**: Dark/light mode support

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Render

**Render** is a modern cloud platform that makes it easy to deploy web applications. Here's how to deploy your Gemini Chat App:

#### Method 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" and select "Web Service"
   - Connect your GitHub account and select your repository

3. **Configure the deployment**
   - **Name**: `gemini-chat-app` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: ``
   - **Environment**: `Static Site`


## 📱 Screenshots

<img width="1914" height="959" alt="image" src="https://github.com/user-attachments/assets/eaae9e76-9bda-430a-a860-f19e39b747aa" />
<img width="1918" height="965" alt="image" src="https://github.com/user-attachments/assets/42cda6cc-0199-42b3-9e5b-4fb08aab07fd" />
<img width="1909" height="971" alt="image" src="https://github.com/user-attachments/assets/72fcab8c-2a84-4497-8c9c-e888a9de2d98" />




## 🙏 Acknowledgments

- React team for the amazing framework
- Zustand for lightweight state management
- React Icons for beautiful icons
- Joi for robust validation
- All contributors and users
