import React from 'react';
import { MessageSquare, X, Sparkles } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onToggle, unreadCount = 1 }) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-5 right-5 z-40 p-3.5 sm:p-4 rounded-2xl shadow-elevated transition-all duration-300 flex items-center justify-center group ${
        isOpen
          ? 'bg-slate-800 text-white hover:bg-slate-900 rotate-90'
          : 'bg-pine-800 text-white hover:bg-pine-900 hover:scale-105 active:scale-95'
      }`}
      aria-label={isOpen ? 'Close Dragon Treasure Assistant' : 'Open Dragon Treasure Assistant'}
      title="Chat with Dragon Treasure Assistant"
    >
      {isOpen ? (
        <X className="w-6 h-6 -rotate-90" />
      ) : (
        <div className="relative">
          <MessageSquare className="w-6 h-6 text-cedar-200" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-cedar-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-pine-800 animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
};
