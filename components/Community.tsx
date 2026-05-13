'use client';

import { useState } from 'react';
import GlassCard from './GlassCard';
import { Users, MessageCircle, Heart, Send, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const mockPosts = [
  {
    id: '1',
    authorName: 'Sarah M.',
    content: 'Just wanted to share that tracking my stress levels really helped improve my cycle regularity! The AI insights were spot on about the connection.',
    category: 'experience',
    likes: 24,
    replies: 8,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isAnonymous: false
  },
  {
    id: '2',
    authorName: 'Anonymous',
    content: 'Has anyone else experienced irregular cycles after starting a new exercise routine? Looking for advice.',
    category: 'question',
    likes: 15,
    replies: 12,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isAnonymous: true
  },
  {
    id: '3',
    authorName: 'Emma L.',
    content: 'The AI prediction was accurate to the day this month! This app is amazing for planning ahead.',
    category: 'support',
    likes: 42,
    replies: 6,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isAnonymous: false
  },
  {
    id: '4',
    authorName: 'Anonymous',
    content: 'Dealing with PCOS and the irregular cycle support has been a game changer. Finally an app that understands!',
    category: 'experience',
    likes: 38,
    replies: 15,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isAnonymous: true
  }
];

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPost, setNewPost] = useState('');

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'support', label: 'Support' },
    { id: 'question', label: 'Questions' },
    { id: 'experience', label: 'Experiences' },
    { id: 'wellness', label: 'Wellness' }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? mockPosts 
    : mockPosts.filter(post => post.category === selectedCategory);

  const getTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Community</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect, share, and support each other
        </p>
      </motion.div>

      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Share Your Thoughts
          </h3>
          <div className="space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind? Share your experience, ask a question, or offer support..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 outline-none transition-all bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded" />
                <span>Post anonymously</span>
              </label>
              <button className="btn-primary flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-lavender-500 to-primary-500 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-lavender-50 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <GlassCard className="card-hover">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400 to-primary-500 flex items-center justify-center text-white font-semibold">
                    {post.isAnonymous ? '?' : post.authorName.charAt(0)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {post.authorName}
                      </h4>
                      <p className="text-xs text-gray-500">{getTimeAgo(post.createdAt)}</p>
                    </div>
                    <span className="badge badge-primary text-xs">
                      {post.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-lavender-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.replies} replies</span>
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <GlassCard className="bg-gradient-to-br from-lavender-50 to-purple-50 dark:from-lavender-900/20 dark:to-purple-900/20">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Community Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Be respectful and supportive of all members</li>
            <li>• Share experiences, not medical advice</li>
            <li>• Respect privacy and anonymity</li>
            <li>• Report inappropriate content</li>
            <li>• Celebrate each other's journeys</li>
          </ul>
        </GlassCard>
      </motion.div>
    </div>
  );
}
