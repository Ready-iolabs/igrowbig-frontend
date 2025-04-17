// ToastNotification.jsx
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastNotification = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          maxWidth: '500px',
          padding: '12px',
          borderRadius: '8px',
        },
      }}
    />
  );
};

// Toast utility functions
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: '#22c55e',
      color: '#fff',
    },
  });
};

export const showErrorToast = (message, details = null) => {
  toast.error(`${message}${details ? `\n${details}` : ''}`, {
    duration: 5000,
   
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    
  });
};

export const showWarningToast = (message) => {
  toast(message, {
    duration: 3000,
    
  });
};

export default ToastNotification;