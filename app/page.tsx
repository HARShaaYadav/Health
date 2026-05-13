'use client';

import { useEffect, useState } from 'react';
import { useStore, initializeDemoData } from '@/lib/store/useStore';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Calendar from '@/components/Calendar';
import Analytics from '@/components/Analytics';
import Insights from '@/components/Insights';
import Community from '@/components/Community';
import AIChat from '@/components/AIChat';
import LandingPage from '@/components/LandingPage';
import AuthModal from '@/components/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { isAuthenticated, viewMode, theme, generatePrediction, calculateAnalytics } = useStore();
  const [showAuth, setShowAuth] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isInitialized) {
      // Initialize demo data and generate predictions
      initializeDemoData();
      generatePrediction();
      calculateAnalytics();
      setIsInitialized(true);
    }
  }, [isAuthenticated, isInitialized, generatePrediction, calculateAnalytics]);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowAuth(true)} />
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {viewMode === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
              <div className="mt-8">
                <Calendar />
              </div>
            </motion.div>
          )}
          
          {viewMode === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Analytics />
            </motion.div>
          )}
          
          {viewMode === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Insights />
            </motion.div>
          )}
          
          {viewMode === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Community />
            </motion.div>
          )}
          
          {viewMode === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIChat />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
