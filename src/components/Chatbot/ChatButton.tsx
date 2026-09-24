import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onToggle, unreadCount = 1 }) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-40 p-2 rounded-full shadow-luxury transition-all duration-300 flex items-center justify-center group ${
        isOpen
          ? 'bg-pine-950 text-white hover:bg-black rotate-90 w-14 h-14 border border-white/20'
          : 'bg-pine-950 text-white hover:scale-108 active:scale-95 border-2 border-gold-400 shadow-glow-gold w-14 h-14 sm:w-16 sm:h-16'
      }`}
      aria-label={isOpen ? 'Close Dragon Treasure Assistant' : 'Open Dragon Treasure Assistant'}
      title="Chat with Virtual Concierge"
    >
      {isOpen ? (
        <X className="w-6 h-6 -rotate-90 text-white" strokeWidth={2} />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-pine-950">
            <img
              src="/dragon-treasure-logo.jpg"
              alt="Dragon Treasure Assistant"
              className="w-full h-full object-cover scale-[1.10]"
            />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-pine-950 animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
};
