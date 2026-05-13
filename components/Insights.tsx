'use client';

import { useStore } from '@/lib/store/useStore';
import GlassCard from './GlassCard';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function Insights() {
  const { currentPrediction } = useStore();

  if (!currentPrediction) {
    return (
      <div className="text-center py-12">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-600">Loading AI insights...</p>
      </div>
    );
  }

  const { aiInsights, factors, confidence } = currentPrediction;

  const getInsightIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-amber-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getInsightBg = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20';
      case 'warning':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-lavender-400 to-primary-500 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">AI-Powered Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized recommendations based on your cycle data
        </p>
      </motion.div>

      {/* Prediction Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-lavender-600" />
            Factors Affecting Your Cycle
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-lavender-50 dark:from-purple-900/20 dark:to-lavender-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cycle Variability</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ±{factors.recentCycleVariability} days
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {factors.recentCycleVariability < 3 ? 'Very stable' : factors.recentCycleVariability < 5 ? 'Stable' : 'Variable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Missed Logs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {factors.missedLogs}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {factors.missedLogs === 0 ? 'Perfect tracking!' : 'AI estimated missing cycles'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Stress Impact</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {factors.stressImpact.toFixed(1)}/5
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {factors.stressImpact < 2 ? 'Low stress' : factors.stressImpact < 3.5 ? 'Moderate' : 'High stress'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sleep Impact</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {factors.sleepImpact.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {factors.sleepImpact < 1 ? 'Good sleep' : factors.sleepImpact < 2 ? 'Fair' : 'Poor sleep'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Exercise Activity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {factors.exerciseImpact.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {factors.exerciseImpact > 70 ? 'Very active' : factors.exerciseImpact > 40 ? 'Moderately active' : 'Low activity'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Common Symptoms</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
                {factors.symptomPatterns.slice(0, 2).join(', ')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Most frequent</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-lavender-600" />
            Personalized Insights
          </h3>
          
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-5 rounded-xl border-2 ${getInsightBg(insight.severity)} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.severity)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {insight.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {format(new Date(insight.date), 'MMM d')}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {insight.message}
                    </p>
                    
                    {insight.actionable && insight.action && (
                      <button className="inline-flex items-center space-x-2 text-sm font-medium text-lavender-600 hover:text-lavender-700 transition-colors">
                        <span>{insight.action}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Recommendations for Better Predictions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-lavender-50 to-purple-50 dark:from-lavender-900/20 dark:to-purple-900/20">
              <CheckCircle className="w-8 h-8 text-lavender-600 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Log Daily Symptoms
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track symptoms, mood, and energy levels daily for more accurate predictions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20">
              <CheckCircle className="w-8 h-8 text-pink-600 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Monitor Sleep Quality
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consistent sleep patterns help regulate your menstrual cycle.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Manage Stress Levels
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                High stress can delay ovulation and affect cycle regularity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CheckCircle className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Stay Hydrated
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Proper hydration supports hormonal balance and overall health.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Confidence Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Prediction Confidence Breakdown
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Confidence</span>
                <span className="text-sm font-bold text-lavender-600">{confidence.overall}%</span>
              </div>
              <div className="confidence-meter h-3">
                <div 
                  className={`confidence-fill ${confidence.overall >= 80 ? 'high' : confidence.overall >= 60 ? 'medium' : 'low'}`}
                  style={{ width: `${confidence.overall}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Data Quality</span>
                  <span className="text-sm font-semibold">{confidence.dataQuality}%</span>
                </div>
                <div className="confidence-meter">
                  <div className="confidence-fill high" style={{ width: `${confidence.dataQuality}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cycle Regularity</span>
                  <span className="text-sm font-semibold">{confidence.cycleRegularity}%</span>
                </div>
                <div className="confidence-meter">
                  <div className="confidence-fill medium" style={{ width: `${confidence.cycleRegularity}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Historical Accuracy</span>
                  <span className="text-sm font-semibold">{confidence.historicalAccuracy}%</span>
                </div>
                <div className="confidence-meter">
                  <div className="confidence-fill high" style={{ width: `${confidence.historicalAccuracy}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recent Data</span>
                  <span className="text-sm font-semibold">{confidence.recentDataAvailability}%</span>
                </div>
                <div className="confidence-meter">
                  <div className="confidence-fill medium" style={{ width: `${confidence.recentDataAvailability}%` }} />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
