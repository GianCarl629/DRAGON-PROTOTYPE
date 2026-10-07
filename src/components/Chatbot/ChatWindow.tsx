import React, { useRef, useEffect } from 'react';
import { X, Sparkles, RefreshCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onResetChat: () => void;
}

const QUICK_PROMPTS = [
  "How much is a room?",
  "What time is check-in?",
  "Do you have parking?",
  "Monthly dorm rates?",
  "What payment methods do you accept?"
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
  onResetChat
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-40 w-[calc(100vw-1.5rem)] sm:w-[390px] max-w-sm h-[min(540px,calc(100vh-6.5rem))] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pine-950 via-pine-900 to-pine-950 text-white p-4 flex items-center justify-between shadow-xs border-b border-gold-500/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-400 shadow-glow-gold bg-pine-950 flex-shrink-0">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Assistant"
                className="w-full h-full object-cover scale-[1.10]"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-pine-950 rounded-full" />
          </div>

          <div>
            <h3 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
              <span>Dragon Treasure Assistant</span>
            </h3>
            <p className="text-[11px] text-gold-300 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Online • Virtual Concierge</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onResetChat}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close chat window"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Guidance Banner */}
      <div className="bg-gradient-to-r from-pine-50 via-cream-100 to-pine-50 px-3.5 py-1.5 border-b border-stone-200/60 flex items-center gap-2 text-[11px] text-pine-950 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" strokeWidth={2} />
        <span>Ask about room rates, check-in policies, or monthly dorms</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Loading Indicator Bubble */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-gold-500 bg-pine-950 flex items-center justify-center flex-shrink-0 shadow-xs">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Assistant"
                className="w-full h-full object-cover scale-[1.10]"
              />
            </div>
            <div className="bg-white border border-stone-200 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-pine-700 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-pine-700 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-pine-700 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3.5 py-2 bg-white border-t border-stone-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-stone-100 text-slate-700 hover:bg-pine-900 hover:text-white border border-stone-200 transition-colors flex-shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};
