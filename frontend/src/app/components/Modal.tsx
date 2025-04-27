// src/components/Modal.tsx
import React from 'react';

interface ModalProps {
  title: string;
  content: React.ReactNode; // Allow JSX content
  isVisible: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform scale-100 opacity-100 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="text-gray-600">{content}</div> {/* Changed from <p> to <div> for flexibility */}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;