// hooks/useConversations.ts
import { useState, useCallback, useEffect } from 'react';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  time: string;
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createConversation = useCallback((title: string) => {
    const now = new Date();
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      preview: '',
      date: 'Today',
      time: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }),
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    return newConversation;
  }, []);

  const addMessage = useCallback((
    conversationId: string, 
    role: MessageRole, 
    content: string
  ) => {
    const now = new Date();
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }),
    };

    // Atualizar no array de conversas
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, newMessage];
          return {
            ...conv,
            messages: updatedMessages,
            preview: role === 'user' ? content : conv.preview,
            updatedAt: now,
          };
        }
        return conv;
      })
    );

    // Atualizar a conversa atual
    setCurrentConversation(prev => {
      if (prev && prev.id === conversationId) {
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          preview: role === 'user' ? content : prev.preview,
          updatedAt: now,
        };
      }
      return prev;
    });

    return newMessage;
  }, []);

  // Sincronizar currentConversation com conversations
  useEffect(() => {
    if (currentConversation && conversations.length > 0) {
      const updated = conversations.find(c => c.id === currentConversation.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentConversation)) {
        setCurrentConversation(updated);
      }
    }
  }, [conversations]);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
  }, [currentConversation]);

  const loadConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      return conversation;
    }
    return null;
  }, [conversations]);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
  }, []);

  return {
    conversations,
    currentConversation,
    isLoading,
    createConversation,
    addMessage,
    deleteConversation,
    loadConversation,
    clearCurrentConversation,
  };
};