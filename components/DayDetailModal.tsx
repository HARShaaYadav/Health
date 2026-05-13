'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { motion } from 'framer-motion';
import { X, Plus, Save } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface DayDetailModalProps {
  date: Date;
  onClose: () => void;
}

export default function DayDetailModal({ date, onClose }: DayDetailModalProps) {
  const { getDailyLog, addDailyLog, updateDailyLog, user } = useStore();
  const existingLog = getDailyLog(date);

  const [sleepHours, setSleepHours] = useState(existingLog?.sleep.hours || 7);
  const [sleepQuality, setSleepQuality] = useState(existingLog?.sleep.quality || 3);
  const [hydration, setHydration] = useState(existingLog?.hydration.glasses || 8);
  const [exerciseDuration, setExerciseDuration] = useState(existingLog?.exercise.duration || 0);
  const [exerciseIntensity, setExerciseIntensity] = useState<'low' | 'medium' | 'high'>(existingLog?.exercise.intensity || 'medium');
  const [stressLevel, setStressLevel] = useState(existingLog?.stress.level || 3);
  const [energy, setEnergy] = useState(existingLog?.energy || 5);
  const [notes, setNotes] = useState(existingLog?.notes || '');

  const handleSave = () => {
    const logData = {
      userId: user!.id,
      date,
      sleep: {
        hours: sleepHours,
        quality: sleepQuality as 1 | 2 | 3 | 4 | 5
      },
      hydration: {
        glasses: hydration,
        liters: hydration * 0.237
      },
      exercise: {
        duration: exerciseDuration,
        intensity: exerciseIntensity
      },
      stress: {
        level: stressLevel as 1 | 2 | 3 | 4 | 5
      },
      energy,
      symptoms: [],
      mood: [],
      notes
    };

    if (existingLog) {
      updateDailyLog(existingLog.id, logData);
      toast.success('Daily log updated!');
    } else {
      addDailyLog(logData);
      toast.success('Daily log saved!');
    }

    onClose();
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
        className="relative glass rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {format(date, 'MMMM d, yyyy')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Log your daily health data
        </p>

        <div className="space-y-6">
          {/* Sleep */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sleep Hours: {sleepHours}h
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sleep Quality: {sleepQuality}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              className="w-full"
            />
          </div>

          {/* Hydration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Water Intake: {hydration} glasses
            </label>
            <input
              type="range"
              min="0"
              max="15"
              value={hydration}
              onChange={(e) => setHydration(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Exercise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exercise Duration: {exerciseDuration} minutes
            </label>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exercise Intensity
            </label>
            <div className="flex space-x-2">
              {(['low', 'medium', 'high'] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setExerciseIntensity(intensity)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    exerciseIntensity === intensity
                      ? 'bg-gradient-to-r from-lavender-500 to-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stress Level: {stressLevel}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              className="w-full"
            />
          </div>

          {/* Energy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Energy Level: {energy}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about your day..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 outline-none transition-all bg-white/50 dark:bg-gray-800/50 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Save</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
