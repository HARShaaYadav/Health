// Global State Management with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  CycleData,
  DailyLog,
  Prediction,
  AIInsight,
  CycleAnalytics,
  ChatMessage
} from '@/types';
import { predictionEngine } from '@/lib/ai/predictionEngine';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  
  // Cycle Data
  cycles: CycleData[];
  dailyLogs: DailyLog[];
  currentPrediction: Prediction | null;
  
  // UI State
  selectedDate: Date;
  viewMode: 'calendar' | 'analytics' | 'insights' | 'community' | 'chat';
  theme: 'light' | 'dark';
  isLoading: boolean;
  
  // Analytics
  analytics: CycleAnalytics | null;
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Cycle Management
  addCycle: (cycle: Omit<CycleData, 'id'>) => void;
  updateCycle: (id: string, cycle: Partial<CycleData>) => void;
  deleteCycle: (id: string) => void;
  
  // Daily Logs
  addDailyLog: (log: Omit<DailyLog, 'id'>) => void;
  updateDailyLog: (id: string, log: Partial<DailyLog>) => void;
  getDailyLog: (date: Date) => DailyLog | undefined;
  
  // Predictions
  generatePrediction: () => Promise<void>;
  
  // Analytics
  calculateAnalytics: () => void;
  
  // UI Actions
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: 'calendar' | 'analytics' | 'insights' | 'community' | 'chat') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Chat
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      cycles: [],
      dailyLogs: [],
      currentPrediction: null,
      selectedDate: new Date(),
      viewMode: 'calendar',
      theme: 'light',
      isLoading: false,
      analytics: null,
      chatMessages: [],

      // User Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { authAPI } = await import('@/lib/api/client');
          const { user } = await authAPI.login(email, password);
          
          set({ user, isAuthenticated: true });
          
          // Load user data from MongoDB
          const { cyclesAPI, dailyLogsAPI } = await import('@/lib/api/client');
          const [cycles, dailyLogs] = await Promise.all([
            cyclesAPI.getAll(),
            dailyLogsAPI.getAll()
          ]);
          
          set({ 
            cycles: cycles.map((c: any) => ({
              ...c,
              id: c._id,
              startDate: new Date(c.startDate),
              endDate: c.endDate ? new Date(c.endDate) : undefined
            })),
            dailyLogs: dailyLogs.map((l: any) => ({
              ...l,
              id: l._id,
              date: new Date(l.date)
            }))
          });
          
          // Generate prediction
          get().generatePrediction();
          get().calculateAnalytics();
        } catch (error: any) {
          console.error('Login failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: () => {
        const { authAPI } = require('@/lib/api/client');
        authAPI.logout();
        set({ user: null, isAuthenticated: false, cycles: [], dailyLogs: [], currentPrediction: null });
      },

      // Cycle Management
      addCycle: (cycleData) => {
        const newCycle: CycleData = {
          ...cycleData,
          id: `cycle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        set((state) => ({
          cycles: [newCycle, ...state.cycles].sort(
            (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
        }));
        
        // Regenerate prediction
        get().generatePrediction();
      },
      
      updateCycle: (id, updates) => {
        set((state) => ({
          cycles: state.cycles.map((cycle) =>
            cycle.id === id ? { ...cycle, ...updates } : cycle
          )
        }));
        
        get().generatePrediction();
      },
      
      deleteCycle: (id) => {
        set((state) => ({
          cycles: state.cycles.filter((cycle) => cycle.id !== id)
        }));
        
        get().generatePrediction();
      },

      // Daily Logs
      addDailyLog: (logData) => {
        const newLog: DailyLog = {
          ...logData,
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        set((state) => ({
          dailyLogs: [newLog, ...state.dailyLogs].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        }));
        
        // Regenerate prediction with new data
        get().generatePrediction();
      },
      
      updateDailyLog: (id, updates) => {
        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) =>
            log.id === id ? { ...log, ...updates } : log
          )
        }));
        
        get().generatePrediction();
      },
      
      getDailyLog: (date) => {
        const state = get();
        return state.dailyLogs.find((log) => {
          const logDate = new Date(log.date);
          return (
            logDate.getDate() === date.getDate() &&
            logDate.getMonth() === date.getMonth() &&
            logDate.getFullYear() === date.getFullYear()
          );
        });
      },

      // Predictions
      generatePrediction: async () => {
        const state = get();
        if (!state.user) return;
        
        set({ isLoading: true });
        
        try {
          const prediction = await predictionEngine.generatePrediction(
            state.cycles,
            state.dailyLogs,
            state.user.healthProfile,
            state.user.id
          );
          
          set({ currentPrediction: prediction });
        } catch (error) {
          console.error('Prediction generation failed:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Analytics
      calculateAnalytics: () => {
        const state = get();
        const { cycles } = state;
        
        if (cycles.length === 0) {
          set({ analytics: null });
          return;
        }
        
        // Calculate average cycle length
        const cycleLengths = cycles
          .filter(c => c.cycleLength && c.cycleLength > 0)
          .map(c => c.cycleLength!);
        
        const averageCycleLength = cycleLengths.length > 0
          ? cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length
          : 28;
        
        // Calculate average period duration
        const periodDurations = cycles.map(c => c.periodDuration);
        const averagePeriodDuration = periodDurations.reduce((sum, dur) => sum + dur, 0) / periodDurations.length;
        
        // Calculate cycle variability
        const variance = cycleLengths.length > 0
          ? Math.sqrt(
              cycleLengths
                .map(len => Math.pow(len - averageCycleLength, 2))
                .reduce((sum, val) => sum + val, 0) / cycleLengths.length
            )
          : 0;
        
        // Calculate regularity score
        const regularityScore = Math.max(0, 100 - (variance * 10));
        
        // Find longest and shortest cycles
        const longestCycle = cycleLengths.length > 0 ? Math.max(...cycleLengths) : 0;
        const shortestCycle = cycleLengths.length > 0 ? Math.min(...cycleLengths) : 0;
        
        // Analyze symptoms
        const symptomMap: Record<string, { count: number; totalSeverity: number }> = {};
        cycles.forEach(cycle => {
          cycle.symptoms.forEach(symptom => {
            if (!symptomMap[symptom.type]) {
              symptomMap[symptom.type] = { count: 0, totalSeverity: 0 };
            }
            symptomMap[symptom.type].count++;
            symptomMap[symptom.type].totalSeverity += symptom.severity;
          });
        });
        
        const commonSymptoms = Object.entries(symptomMap)
          .map(([symptom, data]) => ({
            symptom: symptom as any,
            frequency: (data.count / cycles.length) * 100,
            averageSeverity: data.totalSeverity / data.count,
            cyclePhase: ['menstrual'] as any[]
          }))
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 5);
        
        // Analyze moods
        const moodMap: Record<string, number> = {};
        cycles.forEach(cycle => {
          cycle.mood.forEach(mood => {
            moodMap[mood.mood] = (moodMap[mood.mood] || 0) + 1;
          });
        });
        
        const totalMoods = Object.values(moodMap).reduce((sum, count) => sum + count, 0);
        const moodPatterns = Object.entries(moodMap)
          .map(([mood, count]) => ({
            mood: mood as any,
            frequency: (count / totalMoods) * 100,
            cyclePhase: ['menstrual'] as any[]
          }))
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 5);
        
        // Create trend data
        const cycleTrends = cycles.slice(0, 12).reverse().map(cycle => ({
          date: new Date(cycle.startDate),
          cycleLength: cycle.cycleLength || 0,
          periodDuration: cycle.periodDuration,
          symptoms: cycle.symptoms.length
        }));
        
        const analytics: CycleAnalytics = {
          averageCycleLength: Math.round(averageCycleLength),
          averagePeriodDuration: Math.round(averagePeriodDuration),
          cycleVariability: Math.round(variance * 10) / 10,
          regularityScore: Math.round(regularityScore),
          totalCycles: cycles.length,
          longestCycle,
          shortestCycle,
          commonSymptoms,
          moodPatterns,
          cycleTrends
        };
        
        set({ analytics });
      },

      // UI Actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setTheme: (theme) => set({ theme }),

      // Chat
      addChatMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date()
        };
        
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage]
        }));
      },
      
      clearChat: () => set({ chatMessages: [] })
    }),
    {
      name: 'luna-health-storage',
      partialize: (state) => ({
        user: state.user,
        cycles: state.cycles,
        dailyLogs: state.dailyLogs,
        theme: state.theme
      })
    }
  )
);

// Initialize demo data for testing
export const initializeDemoData = () => {
  const store = useStore.getState();
  
  if (store.cycles.length > 0) return; // Already has data
  
  // Generate demo cycles for the past 6 months
  const demoCycles: CycleData[] = [];
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const cycleLength = 28 + Math.floor(Math.random() * 5) - 2; // 26-32 days
    const periodDuration = 5 + Math.floor(Math.random() * 2); // 5-6 days
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (i * cycleLength));
    
    const cycle: CycleData = {
      id: `demo_cycle_${i}`,
      userId: '1',
      startDate,
      endDate: new Date(startDate.getTime() + periodDuration * 24 * 60 * 60 * 1000),
      periodDuration,
      cycleLength,
      flowIntensity: ['light', 'medium', 'heavy'][Math.floor(Math.random() * 3)] as any,
      symptoms: [
        {
          id: `symptom_${i}_1`,
          type: 'cramps',
          severity: (Math.floor(Math.random() * 3) + 2) as any,
          date: startDate,
          notes: ''
        }
      ],
      mood: [
        {
          id: `mood_${i}_1`,
          date: startDate,
          mood: ['tired', 'irritable', 'calm'][Math.floor(Math.random() * 3)] as any,
          intensity: (Math.floor(Math.random() * 3) + 2) as any,
          notes: ''
        }
      ],
      isEstimated: false,
      confidence: 0.9,
      notes: ''
    };
    
    demoCycles.push(cycle);
  }
  
  demoCycles.forEach(cycle => store.addCycle(cycle));
  store.calculateAnalytics();
};
