import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/45 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-3xl border border-[#e2e8df] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        <div className="px-6 py-4 border-b border-[#edf2ec] flex items-center justify-between bg-[#fbfcfb]">
          <h3 className="text-base font-bold text-[#14231b] tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#627368] hover:text-[#14231b] hover:bg-[#edf3ee] transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
