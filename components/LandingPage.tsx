'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Shield, TrendingUp, Calendar, Heart, Users, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Advanced LSTM neural networks predict your cycle with up to 95% accuracy, even with irregular patterns.'
    },
    {
      icon: TrendingUp,
      title: 'Adaptive Learning',
      description: 'Our AI continuously learns from your data, improving predictions and handling missed logs intelligently.'
    },
    {
      icon: Calendar,
      title: 'Smart Cycle Tracking',
      description: 'Track periods, symptoms, mood, and health data with an intuitive, beautiful interface.'
    },
    {
      icon: Heart,
      title: 'PCOS Support',
      description: 'Specialized algorithms for irregular cycles and PCOS, providing accurate predictions with confidence ranges.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data is encrypted and secure. We never share your personal information.'
    },
    {
      icon: MessageCircle,
      title: 'AI Health Assistant',
      description: 'Chat with our AI assistant for personalized insights, wellness tips, and cycle education.'
    }
  ];

  const benefits = [
    'Predict next period with 85-95% accuracy',
    'Handle irregular cycles and missing logs',
    'Identify fertile windows and ovulation',
    'Track symptoms and mood patterns',
    'Get personalized AI insights',
    'Join supportive community',
    'Export health reports',
    'Dark mode support'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-lavender-100 via-pink-50 to-peach-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-peach-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-lavender-400 to-primary-500 mb-6 pulse-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Luna Health AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
              The Most Intelligent Menstrual Cycle Tracker
            </p>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              AI-powered predictions that adapt to your unique cycle, handle irregular patterns, and learn from missing logs. Experience the future of women's health tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free forever • Privacy guaranteed
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Unlike traditional period trackers, Luna uses machine learning to provide accurate predictions even with irregular cycles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender-400 to-primary-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                Everything You Need for Cycle Health
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Track, predict, and understand your menstrual cycle like never before with our comprehensive AI-powered platform.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                    95%
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Prediction Accuracy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Industry-leading AI precision</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-lavender-500 flex items-center justify-center text-white font-bold text-2xl">
                    50K+
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Active Users</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trusted by women worldwide</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl">
                    4.9
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">User Rating</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Highest rated health app</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-lavender-500 via-primary-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Take Control of Your Cycle?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of women using AI to understand their bodies better
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-lavender-600 font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg flex items-center space-x-2 mx-auto"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-lavender-400" />
            <span className="text-xl font-bold">Luna Health AI</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering women with intelligent cycle tracking
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Luna Health AI. All rights reserved. • Privacy Policy • Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
}
