'use client';

import { useStore } from '@/lib/store/useStore';
import GlassCard from './GlassCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analytics() {
  const { analytics, cycles } = useStore();

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available yet. Log more cycles to see insights.</p>
      </div>
    );
  }

  const COLORS = ['#a855f7', '#ec4899', '#f97316', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Cycle Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive insights into your menstrual health
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <GlassCard className="card-hover">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-lavender-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.averageCycleLength}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Cycle Length</p>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <GlassCard className="card-hover">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-pink-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.averagePeriodDuration}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Period Duration</p>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <GlassCard className="card-hover">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.regularityScore}%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Regularity Score</p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.regularityScore >= 80 ? 'Excellent' : analytics.regularityScore >= 60 ? 'Good' : 'Needs attention'}
            </p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <GlassCard className="card-hover">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ±{analytics.cycleVariability}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cycle Variability</p>
            <p className="text-xs text-gray-500 mt-1">days variation</p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Cycle Length Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GlassCard>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Cycle Length Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.cycleTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                stroke="#9ca3af"
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="cycleLength" 
                stroke="#a855f7" 
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Symptoms and Mood */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Symptoms */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <GlassCard>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Most Common Symptoms
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.commonSymptoms}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="symptom" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="frequency" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Mood Patterns */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
          <GlassCard>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Mood Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.moodPatterns}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ mood, frequency }) => `${mood}: ${frequency.toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="frequency"
                >
                  {analytics.moodPatterns.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Cycle Statistics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <GlassCard>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Cycle Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-lavender-600">{analytics.totalCycles}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Cycles Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-600">{analytics.longestCycle}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Longest Cycle</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{analytics.shortestCycle}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Shortest Cycle</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {analytics.regularityScore >= 80 ? '↑' : analytics.regularityScore >= 60 ? '→' : '↓'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {analytics.regularityScore >= 80 ? 'Improving' : analytics.regularityScore >= 60 ? 'Stable' : 'Variable'}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
