import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';
import { sendMessage } from '../../services/chatService';

const INITIAL_MESSAGES: ChatMessageType[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: "Hello! Welcome to Dragon Treasure Transient & Condotel in Baguio City. I can help answer questions about our room types, rates, amenities, check-in policies, or monthly dormitory rentals. How may I assist you today?",
    timestamp: 'Just now'
  }
];

interface ChatbotWidgetProps {
  externalOpenTrigger?: boolean;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  externalOpenTrigger,
  onOpenStateChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Sync if opened via hero button or navbar
  React.useEffect(() => {
    if (externalOpenTrigger) {
      setIsOpen(true);
      setUnreadCount(0);
    }
  }, [externalOpenTrigger]);

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setUnreadCount(0);
    }
    if (onOpenStateChange) {
      onOpenStateChange(nextState);
    }
  };

  const handleSendMessage = async (text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Calls the abstracted chat service (mocked now, easily configured for POST /api/chat later)
      const reply = await sendMessage(text);

      const assistantMessage: ChatMessageType = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessageType = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I'm having trouble processing your question at the moment. Please feel free to test another question or review our FAQ section.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onResetChat={handleResetChat}
      />
      <ChatButton
        isOpen={isOpen}
        onToggle={toggleChat}
        unreadCount={unreadCount}
      />
    </>
  );
};
