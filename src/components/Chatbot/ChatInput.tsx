import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    onSendMessage(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-3.5 border-t border-stone-200/80 bg-white">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about rates, check-in, parking, or dorms..."
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 disabled:opacity-50 transition-all font-medium"
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="shimmer-btn w-10 h-10 rounded-xl bg-gradient-to-r from-pine-900 to-pine-800 text-white flex items-center justify-center hover:from-pine-800 hover:to-pine-950 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs flex-shrink-0"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gold-400" strokeWidth={2} />
          ) : (
            <Send className="w-4 h-4 text-gold-400" strokeWidth={2} />
          )}
        </button>
      </div>
    </form>
  );
};
