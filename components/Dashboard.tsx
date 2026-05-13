'use client';

import { useStore } from '@/lib/store/useStore';
import GlassCard from './GlassCard';
import { Calendar, Heart, Droplet, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { currentPrediction, cycles, user } = useStore();

  if (!currentPrediction) {
    return (
      <div className="text-center py-12">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-600">Generating your personalized predictions...</p>
      </div>
    );
  }

  const { nextPeriod, ovulation, fertileWindow, confidence, irregularityScore, stabilityScore } = currentPrediction;
  
  const daysUntilPeriod = differenceInDays(new Date(nextPeriod.startDate), new Date());
  const daysUntilOvulation = differenceInDays(new Date(ovulation.date), new Date());

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getConfidenceBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your personalized cycle overview
        </p>
      </motion.div>

      {/* Main Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Next Period */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className={`badge ${getConfidenceBg(nextPeriod.confidence * 100)}`}>
                {Math.round(nextPeriod.confidence * 100)}% confident
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Next Period
            </h3>
            
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {daysUntilPeriod > 0 ? `${daysUntilPeriod} days` : 'Today'}
              </p>
              
              {nextPeriod.isRange ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expected: {format(new Date(nextPeriod.rangeStart!), 'MMM d')} - {format(new Date(nextPeriod.rangeEnd!), 'MMM d')}
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expected: {format(new Date(nextPeriod.startDate), 'MMM d, yyyy')}
                </p>
              )}
              
              <p className="text-xs text-gray-500">
                Duration: ~{nextPeriod.duration} days
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Ovulation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-lavender-500 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className={`badge ${getConfidenceBg(ovulation.confidence * 100)}`}>
                {Math.round(ovulation.probability * 100)}% likely
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Ovulation
            </h3>
            
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {daysUntilOvulation > 0 ? `${daysUntilOvulation} days` : daysUntilOvulation === 0 ? 'Today' : 'Passed'}
              </p>
              
              {ovulation.isRange ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expected: {format(new Date(ovulation.rangeStart!), 'MMM d')} - {format(new Date(ovulation.rangeEnd!), 'MMM d')}
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expected: {format(new Date(ovulation.date), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Fertile Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <span className={`badge ${getConfidenceBg(fertileWindow.confidence * 100)}`}>
                {Math.round(fertileWindow.confidence * 100)}%
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Fertile Window
            </h3>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(fertileWindow.startDate), 'MMM d')} - {format(new Date(fertileWindow.endDate), 'MMM d')}
              </p>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>Peak days:</span>
                {fertileWindow.peakDays.slice(0, 2).map((day, i) => (
                  <span key={i} className="font-semibold">
                    {format(new Date(day), 'd')}{i < 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Cycle Health */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Cycle Health
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Stability</span>
                  <span className={`font-semibold ${getConfidenceColor(stabilityScore)}`}>
                    {Math.round(stabilityScore)}%
                  </span>
                </div>
                <div className="confidence-meter">
                  <div 
                    className={`confidence-fill ${stabilityScore >= 80 ? 'high' : stabilityScore >= 60 ? 'medium' : 'low'}`}
                    style={{ width: `${stabilityScore}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Regularity</span>
                  <span className={`font-semibold ${getConfidenceColor(100 - irregularityScore)}`}>
                    {Math.round(100 - irregularityScore)}%
                  </span>
                </div>
                <div className="confidence-meter">
                  <div 
                    className={`confidence-fill ${irregularityScore < 20 ? 'high' : irregularityScore < 40 ? 'medium' : 'low'}`}
                    style={{ width: `${100 - irregularityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Confidence Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Prediction Confidence
            </h3>
            <span className={`text-3xl font-bold ${getConfidenceColor(confidence.overall)}`}>
              {confidence.overall}%
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Quality</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 confidence-meter">
                  <div 
                    className="confidence-fill high"
                    style={{ width: `${confidence.dataQuality}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{confidence.dataQuality}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Regularity</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 confidence-meter">
                  <div 
                    className="confidence-fill medium"
                    style={{ width: `${confidence.cycleRegularity}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{confidence.cycleRegularity}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Accuracy</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 confidence-meter">
                  <div 
                    className="confidence-fill high"
                    style={{ width: `${confidence.historicalAccuracy}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{confidence.historicalAccuracy}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recent Data</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 confidence-meter">
                  <div 
                    className="confidence-fill medium"
                    style={{ width: `${confidence.recentDataAvailability}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{confidence.recentDataAvailability}%</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Insights */}
      {currentPrediction.aiInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              AI Insights
            </h3>
            
            <div className="space-y-3">
              {currentPrediction.aiInsights.slice(0, 3).map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-xl border-l-4 ${
                    insight.severity === 'success'
                      ? 'bg-green-50 border-green-500 dark:bg-green-900/20'
                      : insight.severity === 'warning'
                      ? 'bg-amber-50 border-amber-500 dark:bg-amber-900/20'
                      : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {insight.severity === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {insight.message}
                      </p>
                      {insight.actionable && insight.action && (
                        <button className="mt-2 text-sm font-medium text-lavender-600 hover:text-lavender-700">
                          {insight.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
