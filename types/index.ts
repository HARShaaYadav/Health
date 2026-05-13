// Core Types for Luna Health AI

export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: Date;
  createdAt: Date;
  preferences: UserPreferences;
  healthProfile: HealthProfile;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  privacySettings: PrivacySettings;
}

export interface NotificationSettings {
  periodReminders: boolean;
  fertileWindowAlerts: boolean;
  ovulationReminders: boolean;
  hydrationReminders: boolean;
  symptomTracking: boolean;
  predictionUpdates: boolean;
}

export interface PrivacySettings {
  dataSharing: boolean;
  anonymousAnalytics: boolean;
  communityVisible: boolean;
}

export interface HealthProfile {
  averageCycleLength?: number;
  averagePeriodDuration?: number;
  hasIrregularCycles: boolean;
  hasPCOS: boolean;
  contraceptionMethod?: string;
  medicalConditions: string[];
}

export interface CycleData {
  id: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  periodDuration: number;
  cycleLength?: number;
  flowIntensity: FlowIntensity;
  symptoms: Symptom[];
  mood: MoodEntry[];
  notes?: string;
  isEstimated: boolean;
  confidence: number;
}

export type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy';

export interface Symptom {
  id: string;
  type: SymptomType;
  severity: 1 | 2 | 3 | 4 | 5;
  date: Date;
  notes?: string;
}

export type SymptomType =
  | 'cramps'
  | 'bloating'
  | 'acne'
  | 'fatigue'
  | 'headache'
  | 'backache'
  | 'breast_tenderness'
  | 'nausea'
  | 'diarrhea'
  | 'constipation'
  | 'insomnia';

export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodType;
  intensity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export type MoodType =
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'irritable'
  | 'energetic'
  | 'tired'
  | 'calm'
  | 'stressed';

export interface DailyLog {
  id: string;
  userId: string;
  date: Date;
  sleep: SleepData;
  hydration: HydrationData;
  exercise: ExerciseData;
  stress: StressData;
  energy: number; // 1-10
  symptoms: Symptom[];
  mood: MoodEntry[];
  notes?: string;
}

export interface SleepData {
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  bedTime?: string;
  wakeTime?: string;
}

export interface HydrationData {
  glasses: number; // 8oz glasses
  liters: number;
}

export interface ExerciseData {
  type?: string;
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
}

export interface StressData {
  level: 1 | 2 | 3 | 4 | 5;
  triggers?: string[];
}

export interface Prediction {
  id: string;
  userId: string;
  generatedAt: Date;
  nextPeriod: PeriodPrediction;
  fertileWindow: FertileWindowPrediction;
  ovulation: OvulationPrediction;
  confidence: ConfidenceScore;
  irregularityScore: number;
  stabilityScore: number;
  factors: PredictionFactors;
  aiInsights: AIInsight[];
}

export interface PeriodPrediction {
  startDate: Date;
  endDate: Date;
  duration: number;
  isRange: boolean;
  rangeStart?: Date;
  rangeEnd?: Date;
  confidence: number;
}

export interface FertileWindowPrediction {
  startDate: Date;
  endDate: Date;
  peakDays: Date[];
  confidence: number;
}

export interface OvulationPrediction {
  date: Date;
  isRange: boolean;
  rangeStart?: Date;
  rangeEnd?: Date;
  probability: number;
  confidence: number;
}

export interface ConfidenceScore {
  overall: number; // 0-100
  dataQuality: number;
  cycleRegularity: number;
  historicalAccuracy: number;
  recentDataAvailability: number;
}

export interface PredictionFactors {
  recentCycleVariability: number;
  missedLogs: number;
  stressImpact: number;
  sleepImpact: number;
  exerciseImpact: number;
  symptomPatterns: string[];
}

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
  date: Date;
  actionable: boolean;
  action?: string;
}

export type InsightType =
  | 'cycle_delay'
  | 'cycle_early'
  | 'irregularity_detected'
  | 'stress_impact'
  | 'sleep_impact'
  | 'pattern_change'
  | 'prediction_update'
  | 'data_quality'
  | 'health_recommendation';

export interface CycleAnalytics {
  averageCycleLength: number;
  averagePeriodDuration: number;
  cycleVariability: number;
  regularityScore: number;
  totalCycles: number;
  longestCycle: number;
  shortestCycle: number;
  commonSymptoms: SymptomFrequency[];
  moodPatterns: MoodPattern[];
  cycleTrends: TrendData[];
}

export interface SymptomFrequency {
  symptom: SymptomType;
  frequency: number;
  averageSeverity: number;
  cyclePhase: CyclePhase[];
}

export interface MoodPattern {
  mood: MoodType;
  frequency: number;
  cyclePhase: CyclePhase[];
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface TrendData {
  date: Date;
  cycleLength: number;
  periodDuration: number;
  symptoms: number;
}

export interface WearableData {
  id: string;
  userId: string;
  date: Date;
  source: 'fitbit' | 'apple_watch' | 'garmin' | 'other';
  heartRate?: HeartRateData;
  steps?: number;
  activeMinutes?: number;
  sleepData?: SleepData;
  temperature?: number;
}

export interface HeartRateData {
  resting: number;
  average: number;
  max: number;
}

export interface AIModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrainedAt: Date;
  totalPredictions: number;
  correctPredictions: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string;
}
