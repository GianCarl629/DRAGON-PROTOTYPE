import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <div className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/80 bg-pine-950 flex items-center justify-center flex-shrink-0 shadow-sm">
          <img
            src="/dragon-treasure-logo.jpg"
            alt="Dragon Treasure Assistant"
            className="w-full h-full object-cover scale-[1.09]"
          />
        </div>
      )}

      <div className={`max-w-[82%] space-y-1 ${isAssistant ? 'text-left' : 'text-right'}`}>
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
            isAssistant
              ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm'
              : 'bg-pine-800 text-white rounded-tr-sm'
          }`}
        >
          {message.text}
        </div>
        <span className="text-[10px] text-slate-600 px-1">
          {message.timestamp}
        </span>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-cedar-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
