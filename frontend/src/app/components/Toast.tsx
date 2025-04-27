// src/components/Toast.tsx
import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  duration?: number;
  onDismiss?: () => void; // Optional callback when dismissed
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, duration = 3000, onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isVisible) {
      setShow(true);
      timer = setTimeout(() => {
        setShow(false);
        if (onDismiss) {
          onDismiss(); // Call the dismiss callback if provided
        }
      }, duration);
    } else {
      setShow(false); // Immediately hide if isVisible becomes false
    }

    // Cleanup timer on unmount or dependency change
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isVisible, duration, onDismiss]); // Rerun effect if isVisible, duration, or onDismiss changes

  // Use CSS transition classes controlled by the 'show' state
  return (
     <div className={`fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transition-all duration-300 z-50 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        <div className="flex items-center space-x-3">
            <i className="fas fa-check-circle text-2xl"></i>
            <span className="font-medium">{message}</span>
        </div>
    </div>
  );
};

export default Toast;