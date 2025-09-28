import React, { ReactNode } from 'react';
import { ICONS } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card-light dark:bg-card-dark text-light-text dark:text-dark-text rounded-2xl shadow-lg border border-border-light dark:border-border-dark p-6 w-full max-w-lg mx-4 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold font-heading">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-500 dark:text-slate-400 hover:text-light-text dark:hover:text-white transition-colors"
          >
            <ICONS.Close className="w-6 h-6" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;