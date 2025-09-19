import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { chatroomSchema } from '../utils/validation';
import useChatStore from '../store/chatStore';
import styles from '../styles/CreateChatroomModal.module.css';

const CreateChatroomModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const { createChatroom, darkMode } = useChatStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const { errors } = chatroomSchema.validate(data);
      if (errors) {
        console.error('Validation errors:', errors);
        return;
      }

      createChatroom(data);
      toast.success('Chatroom created successfully!');
      onClose();
      reset();
    } catch (error) {
      toast.error('Failed to create chatroom');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div 
        className={`${styles.modal} ${darkMode ? styles.dark : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Create New Chatroom</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={loading}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              Chatroom Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter chatroom title..."
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 1,
                  message: 'Title cannot be empty'
                },
                maxLength: {
                  value: 50,
                  message: 'Title must be less than 50 characters'
                }
              })}
              disabled={loading}
            />
            {errors.title && (
              <p className={styles.errorMessage}>{errors.title.message}</p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.createButton}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Chatroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatroomModal;
