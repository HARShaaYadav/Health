'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import GlassCard from './GlassCard';
import { MessageCircle, Send, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AI_RESPONSES = {
  greeting: "Hello! I'm your AI health assistant. I can help you understand your cycle, answer questions about menstrual health, and provide personalized insights. How can I assist you today?",
  cycle: "Based on your data, your cycle is {regularity}. Your average cycle length is {length} days. Would you like me to explain what this means for you?",
  prediction: "Your next period is predicted to start in {days} days with {confidence}% confidence. This prediction is based on your recent cycle patterns and health data.",
  symptoms: "I notice you've been tracking {symptom}. This is common during the {phase} phase of your cycle. Would you like tips on managing this symptom?",
  irregular: "Irregular cycles can be influenced by stress, sleep, exercise, and hormonal changes. I see your recent stress levels have been {level}. Let's work on strategies to support cycle regularity.",
  pcos: "PCOS can cause irregular cycles. Our AI is specifically designed to handle irregular patterns and provide accurate predictions even with variable cycle lengths. How can I support you better?",
  general: "I'm here to help with any questions about your menstrual health, cycle predictions, or wellness. What would you like to know?"
};

export default function AIChat() {
  const { chatMessages, addChatMessage, currentPrediction, analytics } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Send welcome message if no messages
    if (chatMessages.length === 0) {
      addChatMessage({
        role: 'assistant',
        content: AI_RESPONSES.greeting
      });
    }
  }, []);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return AI_RESPONSES.greeting;
    }
    
    if (lowerMessage.includes('cycle') || lowerMessage.includes('period')) {
      if (analytics) {
        return AI_RESPONSES.cycle
          .replace('{regularity}', analytics.regularityScore > 80 ? 'very regular' : analytics.regularityScore > 60 ? 'fairly regular' : 'irregular')
          .replace('{length}', analytics.averageCycleLength.toString());
      }
    }
    
    if (lowerMessage.includes('predict') || lowerMessage.includes('next period') || lowerMessage.includes('when')) {
      if (currentPrediction) {
        const days = Math.ceil((new Date(currentPrediction.nextPeriod.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return AI_RESPONSES.prediction
          .replace('{days}', days.toString())
          .replace('{confidence}', Math.round(currentPrediction.confidence.overall).toString());
      }
    }
    
    if (lowerMessage.includes('symptom') || lowerMessage.includes('cramp') || lowerMessage.includes('pain')) {
      return AI_RESPONSES.symptoms
        .replace('{symptom}', 'cramps')
        .replace('{phase}', 'menstrual');
    }
    
    if (lowerMessage.includes('irregular') || lowerMessage.includes('late')) {
      return AI_RESPONSES.irregular.replace('{level}', 'moderate');
    }
    
    if (lowerMessage.includes('pcos')) {
      return AI_RESPONSES.pcos;
    }
    
    return AI_RESPONSES.general;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    addChatMessage({
      role: 'user',
      content: input
    });

    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateAIResponse(input);
      addChatMessage({
        role: 'assistant',
        content: response
      });
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "When is my next period?",
    "Why is my cycle irregular?",
    "How accurate are the predictions?",
    "Tips for managing cramps",
    "What affects cycle regularity?"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-lavender-400 to-primary-500 mb-4 pulse-glow">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">AI Health Assistant</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ask me anything about your menstrual health and cycle
        </p>
      </motion.div>

      {/* Quick Questions */}
      {chatMessages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
              Quick Questions
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="px-4 py-2 rounded-lg bg-lavender-50 dark:bg-lavender-900/20 text-lavender-700 dark:text-lavender-300 text-sm hover:bg-lavender-100 dark:hover:bg-lavender-900/30 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Chat Messages */}
      <GlassCard className="h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          <AnimatePresence>
            {chatMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-500'
                      : 'bg-gradient-to-br from-lavender-400 to-primary-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-lavender-500 to-primary-500 text-white'
                      : 'bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-lavender-400 to-primary-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-gray-800/70">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-lavender-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-lavender-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-lavender-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your cycle..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 outline-none transition-all bg-white/50 dark:bg-gray-800/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-lavender-500 to-primary-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* AI Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="bg-gradient-to-br from-lavender-50 to-purple-50 dark:from-lavender-900/20 dark:to-purple-900/20">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            What I Can Help With
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Cycle Predictions</p>
                <p className="text-gray-600 dark:text-gray-400">Explain how predictions work and their accuracy</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Symptom Management</p>
                <p className="text-gray-600 dark:text-gray-400">Tips for managing common symptoms</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Irregular Cycles</p>
                <p className="text-gray-600 dark:text-gray-400">Understanding and managing irregularity</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Wellness Advice</p>
                <p className="text-gray-600 dark:text-gray-400">Lifestyle tips for better cycle health</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
