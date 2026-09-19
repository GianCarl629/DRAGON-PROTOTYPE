import React, { useRef, useEffect } from 'react';
import { Bot, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
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
    <div className="fixed bottom-20 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 max-w-sm h-[520px] bg-slate-50 rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pine-900 to-pine-800 text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/90 shadow-md bg-pine-950 flex-shrink-0">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Assistant"
                className="w-full h-full object-cover scale-[1.09]"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-pine-900 rounded-full" />
          </div>

          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
              <span>Dragon Treasure Assistant</span>
            </h3>
            <p className="text-[11px] text-emerald-300 flex items-center gap-1">
              <span>Online</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">Prototype Demo</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onResetChat}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-pine-700 transition-colors"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-pine-700 transition-colors"
            aria-label="Close chat window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Gemini Live API Status Banner */}
      <div className="bg-emerald-50 px-3 py-1.5 border-b border-emerald-100 flex items-center gap-1.5 text-[11px] text-emerald-800">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span>Live Gemini Assistant (Connected via POST /api/chat)</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Loading Indicator Bubble */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-500/80 bg-pine-950 flex items-center justify-center flex-shrink-0 shadow-sm">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Assistant"
                className="w-full h-full object-cover scale-[1.09]"
              />
            </div>
            <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-pine-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-pine-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-pine-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 bg-white/70 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-pine-100 hover:text-pine-800 border border-slate-200 transition-colors flex-shrink-0 disabled:opacity-50"
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
