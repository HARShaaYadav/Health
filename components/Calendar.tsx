'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import GlassCard from './GlassCard';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  isWithinInterval,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DayDetailModal from './DayDetailModal';
import LogPeriodModal from './LogPeriodModal';

export default function Calendar() {
  const { cycles, currentPrediction, selectedDate, setSelectedDate } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [showLogPeriod, setShowLogPeriod] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days for calendar grid
  const startDay = monthStart.getDay();
  const paddingDays = Array(startDay).fill(null);

  const getDayStatus = (date: Date) => {
    const dayStart = startOfDay(date);
    
    // Check if it's a period day
    const isPeriodDay = cycles.some(cycle => {
      if (!cycle.endDate) return false;
      return isWithinInterval(dayStart, {
        start: startOfDay(new Date(cycle.startDate)),
        end: startOfDay(new Date(cycle.endDate))
      });
    });

    if (isPeriodDay) return 'period';

    // Check predicted period
    if (currentPrediction) {
      const isPredictedPeriod = isWithinInterval(dayStart, {
        start: startOfDay(new Date(currentPrediction.nextPeriod.startDate)),
        end: startOfDay(new Date(currentPrediction.nextPeriod.endDate))
      });
      
      if (isPredictedPeriod) return 'predicted-period';

      // Check ovulation
      const isOvulationDay = isSameDay(dayStart, startOfDay(new Date(currentPrediction.ovulation.date)));
      if (isOvulationDay) return 'ovulation';

      // Check fertile window
      const isFertileDay = isWithinInterval(dayStart, {
        start: startOfDay(new Date(currentPrediction.fertileWindow.startDate)),
        end: startOfDay(new Date(currentPrediction.fertileWindow.endDate))
      });
      
      if (isFertileDay) return 'fertile';
    }

    return 'normal';
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayDetail(true);
  };

  return (
    <>
      <GlassCard>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-lavender-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 rounded-lg hover:bg-lavender-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Today
            </button>
            
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-lavender-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-red-400 to-pink-400"></div>
            <span className="text-gray-600 dark:text-gray-400">Period</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-red-200 to-pink-200 border-2 border-dashed border-red-300"></div>
            <span className="text-gray-600 dark:text-gray-400">Predicted Period</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-400 to-lavender-400"></div>
            <span className="text-gray-600 dark:text-gray-400">Ovulation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-300 to-emerald-300"></div>
            <span className="text-gray-600 dark:text-gray-400">Fertile Window</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}

          {/* Padding Days */}
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="aspect-square" />
          ))}

          {/* Calendar Days */}
          {daysInMonth.map((date, index) => {
            const status = getDayStatus(date);
            const isCurrentDay = isToday(date);
            const isCurrentMonth = isSameMonth(date, currentMonth);

            return (
              <motion.button
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => handleDayClick(date)}
                className={`calendar-day ${status} ${isCurrentDay ? 'today' : ''} ${
                  !isCurrentMonth ? 'opacity-50' : ''
                }`}
              >
                <span className="relative z-10">{format(date, 'd')}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Add Button */}
        <button 
          onClick={() => setShowLogPeriod(true)}
          className="mt-6 w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Log Period</span>
        </button>
      </GlassCard>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {showDayDetail && (
          <DayDetailModal
            date={selectedDate}
            onClose={() => setShowDayDetail(false)}
          />
        )}
      </AnimatePresence>

      {/* Log Period Modal */}
      <AnimatePresence>
        {showLogPeriod && (
          <LogPeriodModal
            onClose={() => setShowLogPeriod(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
