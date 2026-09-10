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
    <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a question about rates, check-in, or rooms..."
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-pine-800 text-white flex items-center justify-center hover:bg-pine-900 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm flex-shrink-0"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cedar-300" />
          ) : (
            <Send className="w-4 h-4 text-cedar-300" />
          )}
        </button>
      </div>
    </form>
  );
};
