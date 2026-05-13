'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { motion } from 'framer-motion';
import { X, Calendar, Save } from 'lucide-react';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';

interface LogPeriodModalProps {
  onClose: () => void;
}

export default function LogPeriodModal({ onClose }: LogPeriodModalProps) {
  const { addCycle, user } = useStore();
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [periodDuration, setPeriodDuration] = useState(5);
  const [flowIntensity, setFlowIntensity] = useState<'spotting' | 'light' | 'medium' | 'heavy'>('medium');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      const start = new Date(startDate);
      const end = addDays(start, periodDuration);

      const cycleData = {
        userId: user.id,
        startDate: start,
        endDate: end,
        periodDuration,
        flowIntensity,
        symptoms: [],
        mood: [],
        notes,
        isEstimated: false,
        confidence: 1.0,
      };

      addCycle(cycleData);
      toast.success('Period logged successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error logging period:', error);
      toast.error('Failed to log period. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative glass rounded-3xl p-6 max-w-md w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Log Period
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your menstrual cycle
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Period Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Period Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Period Duration: {periodDuration} days
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={periodDuration}
              onChange={(e) => setPeriodDuration(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 day</span>
              <span>10 days</span>
            </div>
          </div>

          {/* Flow Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Flow Intensity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['spotting', 'light', 'medium', 'heavy'] as const).map((intensity) => (
                <button
                  key={intensity}
                  type="button"
                  onClick={() => setFlowIntensity(intensity)}
                  className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                    flowIntensity === intensity
                      ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about your period..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 outline-none transition-all bg-white/50 dark:bg-gray-800/50 resize-none"
              rows={3}
            />
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-lavender-50 to-purple-50 dark:from-lavender-900/20 dark:to-purple-900/20">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Summary:</strong> Period from{' '}
              <span className="font-semibold text-lavender-600">
                {format(new Date(startDate), 'MMM d')}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-lavender-600">
                {format(addDays(new Date(startDate), periodDuration), 'MMM d')}
              </span>
              {' '}({periodDuration} days, {flowIntensity} flow)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Period</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
