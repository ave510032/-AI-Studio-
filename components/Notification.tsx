
import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[200] px-6 py-3 rounded-xl border shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 flex items-center gap-3 ${bgColors[type]}`}>
      <span className="text-white font-bold text-sm">{message}</span>
      <button onClick={onClose} className="text-white/50 hover:text-white text-lg">✕</button>
    </div>
  );
};

export default Notification;
