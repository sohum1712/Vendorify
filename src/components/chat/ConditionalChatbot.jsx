import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ChatbotWidget from './ChatbotWidget';

const ConditionalChatbot = () => {
  const { user } = useAuth();
  
  // Only show chatbot for customers, not vendors
  if (!user || user.role !== 'customer') {
    return null;
  }
  
  return <ChatbotWidget />;
};

export default ConditionalChatbot;
