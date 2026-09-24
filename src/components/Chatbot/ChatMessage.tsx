import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <div className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gold-500 bg-pine-950 flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
          <img
            src="/dragon-treasure-logo.jpg"
            alt="Dragon Treasure Assistant"
            className="w-full h-full object-cover scale-[1.10]"
          />
        </div>
      )}

      <div className={`max-w-[84%] space-y-1 ${isAssistant ? 'text-left' : 'text-right'}`}>
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
            isAssistant
              ? 'bg-white text-slate-800 border border-stone-200/90 rounded-tl-sm'
              : 'bg-gradient-to-r from-pine-900 to-pine-800 text-white rounded-tr-sm'
          }`}
        >
          {message.text}
        </div>
        <span className="text-[10px] text-slate-600 px-1 font-medium">
          {message.timestamp}
        </span>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-gold-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
          <User className="w-4 h-4" strokeWidth={2} />
        </div>
      )}
    </div>
  );
};
