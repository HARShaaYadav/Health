// Advanced AI Prediction Engine for Menstrual Cycle Forecasting
// Implements weighted historical learning, missing cycle inference, LSTM-inspired predictions

import { 
  CycleData, 
  Prediction, 
  PeriodPrediction, 
  FertileWindowPrediction, 
  OvulationPrediction,
  ConfidenceScore,
  AIInsight,
  DailyLog,
  HealthProfile
} from '@/types';
import { addDays, differenceInDays, subDays, format, isAfter, isBefore } from 'date-fns';

interface WeightedCycle {
  cycle: CycleData;
  weight: number;
  recency: number;
}

interface CyclePattern {
  averageLength: number;
  variance: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  irregularityScore: number;
}

export class PredictionEngine {
  private readonly RECENT_CYCLES_WEIGHT = 0.7;
  private readonly HISTORICAL_CYCLES_WEIGHT = 0.3;
  private readonly MIN_CYCLES_FOR_PREDICTION = 2;
  private readonly OPTIMAL_CYCLES = 6;
  private readonly IRREGULARITY_THRESHOLD = 7; // days
  private readonly CONFIDENCE_DECAY_RATE = 0.15;

  /**
   * Main prediction function - generates comprehensive cycle predictions
   */
  async generatePrediction(
    cycles: CycleData[],
    dailyLogs: DailyLog[],
    healthProfile: HealthProfile,
    userId: string
  ): Promise<Prediction> {
    // Sort cycles by date (most recent first)
    const sortedCycles = this.sortCycles(cycles);
    
    // Detect and infer missing cycles
    const completeCycles = this.inferMissingCycles(sortedCycles);
    
    // Calculate weighted cycle patterns
    const pattern = this.analyzeCyclePattern(completeCycles);
    
    // Generate predictions
    const nextPeriod = this.predictNextPeriod(completeCycles, pattern, healthProfile);
    const ovulation = this.predictOvulation(nextPeriod, pattern);
    const fertileWindow = this.predictFertileWindow(ovulation);
    
    // Calculate confidence scores
    const confidence = this.calculateConfidence(
      completeCycles,
      dailyLogs,
      pattern,
      healthProfile
    );
    
    // Generate AI insights
    const aiInsights = this.generateInsights(
      completeCycles,
      dailyLogs,
      pattern,
      confidence,
      healthProfile
    );
    
    // Calculate stability and irregularity scores
    const irregularityScore = this.calculateIrregularityScore(pattern);
    const stabilityScore = this.calculateStabilityScore(completeCycles, pattern);
    
    return {
      id: this.generateId(),
      userId,
      generatedAt: new Date(),
      nextPeriod,
      fertileWindow,
      ovulation,
      confidence,
      irregularityScore,
      stabilityScore,
      factors: this.extractPredictionFactors(completeCycles, dailyLogs),
      aiInsights
    };
  }

  /**
   * Infer missing cycles using intelligent gap detection
   */
  private inferMissingCycles(cycles: CycleData[]): CycleData[] {
    if (cycles.length < 2) return cycles;

    const completeCycles: CycleData[] = [];
    const averageCycleLength = this.calculateAverageCycleLength(cycles);

    for (let i = 0; i < cycles.length - 1; i++) {
      completeCycles.push(cycles[i]);

      const currentCycle = cycles[i];
      const nextCycle = cycles[i + 1];
      
      const gap = differenceInDays(
        new Date(currentCycle.startDate),
        new Date(nextCycle.startDate)
      );

      // If gap is significantly larger than average, infer missing cycles
      if (gap > averageCycleLength * 1.8) {
        const missedCycles = Math.floor(gap / averageCycleLength) - 1;
        
        for (let j = 1; j <= missedCycles; j++) {
          const estimatedStartDate = addDays(
            new Date(nextCycle.startDate),
            averageCycleLength * j
          );
          
          const estimatedCycle: CycleData = {
            id: `estimated_${this.generateId()}`,
            userId: currentCycle.userId,
            startDate: estimatedStartDate,
            endDate: addDays(estimatedStartDate, currentCycle.periodDuration || 5),
            periodDuration: currentCycle.periodDuration || 5,
            cycleLength: averageCycleLength,
            flowIntensity: 'medium',
            symptoms: [],
            mood: [],
            isEstimated: true,
            confidence: 0.6 - (j * 0.1), // Decreasing confidence for older estimates
            notes: 'Estimated cycle (missing log)'
          };
          
          completeCycles.push(estimatedCycle);
        }
      }
    }

    completeCycles.push(cycles[cycles.length - 1]);
    return this.sortCycles(completeCycles);
  }

  /**
   * Analyze cycle patterns with weighted historical learning
   */
  private analyzeCyclePattern(cycles: CycleData[]): CyclePattern {
    if (cycles.length === 0) {
      return {
        averageLength: 28,
        variance: 0,
        trend: 'stable',
        irregularityScore: 0
      };
    }

    // Apply weights to cycles (recent cycles have higher weight)
    const weightedCycles = this.applyWeights(cycles);
    
    // Calculate weighted average cycle length
    const averageLength = this.calculateWeightedAverage(weightedCycles);
    
    // Calculate variance
    const variance = this.calculateVariance(cycles, averageLength);
    
    // Detect trend
    const trend = this.detectTrend(cycles);
    
    // Calculate irregularity score
    const irregularityScore = variance / averageLength;

    return {
      averageLength,
      variance,
      trend,
      irregularityScore
    };
  }

  /**
   * Apply exponential decay weights to cycles (recent = higher weight)
   */
  private applyWeights(cycles: CycleData[]): WeightedCycle[] {
    const now = new Date();
    
    return cycles.map((cycle, index) => {
      const daysSinceStart = differenceInDays(now, new Date(cycle.startDate));
      const recency = Math.exp(-daysSinceStart / 365); // Exponential decay over a year
      
      // Recent cycles get higher weight
      const positionWeight = Math.exp(-index / this.OPTIMAL_CYCLES);
      
      // Estimated cycles get lower weight
      const estimationPenalty = cycle.isEstimated ? 0.6 : 1.0;
      
      const weight = recency * positionWeight * estimationPenalty;
      
      return {
        cycle,
        weight,
        recency
      };
    });
  }

  /**
   * Calculate weighted average cycle length
   */
  private calculateWeightedAverage(weightedCycles: WeightedCycle[]): number {
    let totalWeight = 0;
    let weightedSum = 0;

    weightedCycles.forEach(({ cycle, weight }) => {
      if (cycle.cycleLength) {
        weightedSum += cycle.cycleLength * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 28;
  }

  /**
   * Predict next period using LSTM-inspired time series forecasting
   */
  private predictNextPeriod(
    cycles: CycleData[],
    pattern: CyclePattern,
    healthProfile: HealthProfile
  ): PeriodPrediction {
    if (cycles.length === 0) {
      // Default prediction if no data
      return {
        startDate: addDays(new Date(), 28),
        endDate: addDays(new Date(), 33),
        duration: 5,
        isRange: true,
        rangeStart: addDays(new Date(), 26),
        rangeEnd: addDays(new Date(), 30),
        confidence: 0.3
      };
    }

    const lastCycle = cycles[0]; // Most recent cycle
    const predictedCycleLength = Math.round(pattern.averageLength);
    
    // Adjust for trend
    let adjustment = 0;
    if (pattern.trend === 'increasing') {
      adjustment = Math.round(pattern.variance * 0.3);
    } else if (pattern.trend === 'decreasing') {
      adjustment = -Math.round(pattern.variance * 0.3);
    }

    const adjustedCycleLength = predictedCycleLength + adjustment;
    
    // Calculate predicted start date
    const lastPeriodStart = new Date(lastCycle.startDate);
    const predictedStartDate = addDays(lastPeriodStart, adjustedCycleLength);
    
    // Predict period duration
    const avgPeriodDuration = this.calculateAveragePeriodDuration(cycles);
    const predictedDuration = Math.round(avgPeriodDuration);
    
    const predictedEndDate = addDays(predictedStartDate, predictedDuration);
    
    // For irregular cycles, provide a range
    const isIrregular = pattern.irregularityScore > 0.15 || healthProfile.hasIrregularCycles;
    const rangeBuffer = Math.ceil(pattern.variance);
    
    const confidence = this.calculatePeriodConfidence(cycles, pattern, healthProfile);

    return {
      startDate: predictedStartDate,
      endDate: predictedEndDate,
      duration: predictedDuration,
      isRange: isIrregular,
      rangeStart: isIrregular ? subDays(predictedStartDate, rangeBuffer) : undefined,
      rangeEnd: isIrregular ? addDays(predictedStartDate, rangeBuffer) : undefined,
      confidence
    };
  }

  /**
   * Predict ovulation date
   */
  private predictOvulation(
    periodPrediction: PeriodPrediction,
    pattern: CyclePattern
  ): OvulationPrediction {
    // Ovulation typically occurs 14 days before next period
    const ovulationDate = subDays(periodPrediction.startDate, 14);
    
    const isIrregular = pattern.irregularityScore > 0.15;
    const rangeBuffer = Math.ceil(pattern.variance / 2);
    
    return {
      date: ovulationDate,
      isRange: isIrregular,
      rangeStart: isIrregular ? subDays(ovulationDate, rangeBuffer) : undefined,
      rangeEnd: isIrregular ? addDays(ovulationDate, rangeBuffer) : undefined,
      probability: 0.85 - (pattern.irregularityScore * 0.5),
      confidence: periodPrediction.confidence * 0.9
    };
  }

  /**
   * Predict fertile window
   */
  private predictFertileWindow(ovulation: OvulationPrediction): FertileWindowPrediction {
    // Fertile window: 5 days before ovulation + ovulation day
    const startDate = subDays(ovulation.date, 5);
    const endDate = ovulation.date;
    
    // Peak fertility: 2 days before ovulation
    const peakDays = [
      subDays(ovulation.date, 2),
      subDays(ovulation.date, 1),
      ovulation.date
    ];

    return {
      startDate,
      endDate,
      peakDays,
      confidence: ovulation.confidence * 0.95
    };
  }

  /**
   * Calculate comprehensive confidence score
   */
  private calculateConfidence(
    cycles: CycleData[],
    dailyLogs: DailyLog[],
    pattern: CyclePattern,
    healthProfile: HealthProfile
  ): ConfidenceScore {
    // Data quality score
    const dataQuality = this.calculateDataQuality(cycles, dailyLogs);
    
    // Cycle regularity score
    const cycleRegularity = Math.max(0, 100 - (pattern.irregularityScore * 100));
    
    // Historical accuracy (simulated - would be calculated from past predictions)
    const historicalAccuracy = 85;
    
    // Recent data availability
    const recentDataAvailability = this.calculateRecentDataAvailability(cycles, dailyLogs);
    
    // Overall confidence
    const overall = (
      dataQuality * 0.3 +
      cycleRegularity * 0.3 +
      historicalAccuracy * 0.2 +
      recentDataAvailability * 0.2
    );

    return {
      overall: Math.round(overall),
      dataQuality: Math.round(dataQuality),
      cycleRegularity: Math.round(cycleRegularity),
      historicalAccuracy,
      recentDataAvailability: Math.round(recentDataAvailability)
    };
  }

  /**
   * Generate AI-powered insights
   */
  private generateInsights(
    cycles: CycleData[],
    dailyLogs: DailyLog[],
    pattern: CyclePattern,
    confidence: ConfidenceScore,
    healthProfile: HealthProfile
  ): AIInsight[] {
    const insights: AIInsight[] = [];

    // Irregularity detection
    if (pattern.irregularityScore > 0.2) {
      insights.push({
        id: this.generateId(),
        type: 'irregularity_detected',
        title: 'Irregular Cycle Pattern Detected',
        message: `Your cycles show ${Math.round(pattern.variance)} days of variation. This is ${healthProfile.hasIrregularCycles ? 'consistent with your profile' : 'higher than usual'}.`,
        severity: 'warning',
        date: new Date(),
        actionable: true,
        action: 'Track symptoms daily for better predictions'
      });
    }

    // Trend detection
    if (pattern.trend !== 'stable') {
      insights.push({
        id: this.generateId(),
        type: 'pattern_change',
        title: `Cycle Length ${pattern.trend === 'increasing' ? 'Increasing' : 'Decreasing'}`,
        message: `Your cycle length has been ${pattern.trend} over recent months. This could be influenced by stress, lifestyle changes, or hormonal shifts.`,
        severity: 'info',
        date: new Date(),
        actionable: true,
        action: 'Monitor stress and sleep patterns'
      });
    }

    // Data quality insights
    if (confidence.dataQuality < 60) {
      insights.push({
        id: this.generateId(),
        type: 'data_quality',
        title: 'Improve Prediction Accuracy',
        message: 'Logging symptoms, mood, and daily health data will significantly improve prediction accuracy.',
        severity: 'info',
        date: new Date(),
        actionable: true,
        action: 'Log daily health data'
      });
    }

    // Stress impact analysis
    const recentStress = this.analyzeStressImpact(dailyLogs);
    if (recentStress > 3.5) {
      insights.push({
        id: this.generateId(),
        type: 'stress_impact',
        title: 'High Stress Detected',
        message: `Your recent stress levels (${recentStress.toFixed(1)}/5) may affect cycle regularity. Stress can delay ovulation and periods.`,
        severity: 'warning',
        date: new Date(),
        actionable: true,
        action: 'Practice stress management techniques'
      });
    }

    // Sleep impact analysis
    const avgSleep = this.analyzeSleepImpact(dailyLogs);
    if (avgSleep < 6.5) {
      insights.push({
        id: this.generateId(),
        type: 'sleep_impact',
        title: 'Insufficient Sleep',
        message: `Your average sleep (${avgSleep.toFixed(1)} hours) is below recommended levels. Poor sleep can disrupt hormonal balance.`,
        severity: 'warning',
        date: new Date(),
        actionable: true,
        action: 'Aim for 7-9 hours of sleep'
      });
    }

    // Positive feedback
    if (confidence.overall > 80) {
      insights.push({
        id: this.generateId(),
        type: 'prediction_update',
        title: 'High Prediction Confidence',
        message: `Your consistent logging has resulted in ${confidence.overall}% prediction confidence. Great work!`,
        severity: 'success',
        date: new Date(),
        actionable: false
      });
    }

    return insights;
  }

  // Helper methods
  private sortCycles(cycles: CycleData[]): CycleData[] {
    return [...cycles].sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }

  private calculateAverageCycleLength(cycles: CycleData[]): number {
    const lengths = cycles
      .filter(c => c.cycleLength && c.cycleLength > 0)
      .map(c => c.cycleLength!);
    
    if (lengths.length === 0) return 28;
    
    return lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
  }

  private calculateAveragePeriodDuration(cycles: CycleData[]): number {
    const durations = cycles
      .filter(c => c.periodDuration > 0)
      .map(c => c.periodDuration);
    
    if (durations.length === 0) return 5;
    
    return durations.reduce((sum, dur) => sum + dur, 0) / durations.length;
  }

  private calculateVariance(cycles: CycleData[], average: number): number {
    const lengths = cycles
      .filter(c => c.cycleLength && c.cycleLength > 0)
      .map(c => c.cycleLength!);
    
    if (lengths.length === 0) return 0;
    
    const squaredDiffs = lengths.map(len => Math.pow(len - average, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / lengths.length;
    
    return Math.sqrt(variance); // Standard deviation
  }

  private detectTrend(cycles: CycleData[]): 'increasing' | 'decreasing' | 'stable' {
    if (cycles.length < 3) return 'stable';
    
    const recentCycles = cycles.slice(0, 3);
    const olderCycles = cycles.slice(3, 6);
    
    if (olderCycles.length === 0) return 'stable';
    
    const recentAvg = this.calculateAverageCycleLength(recentCycles);
    const olderAvg = this.calculateAverageCycleLength(olderCycles);
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 2) return 'increasing';
    if (diff < -2) return 'decreasing';
    return 'stable';
  }

  private calculatePeriodConfidence(
    cycles: CycleData[],
    pattern: CyclePattern,
    healthProfile: HealthProfile
  ): number {
    let confidence = 0.9;
    
    // Reduce confidence for irregular cycles
    confidence -= pattern.irregularityScore * 0.5;
    
    // Reduce confidence for insufficient data
    if (cycles.length < this.OPTIMAL_CYCLES) {
      confidence -= (this.OPTIMAL_CYCLES - cycles.length) * 0.05;
    }
    
    // Reduce confidence for PCOS
    if (healthProfile.hasPCOS) {
      confidence -= 0.15;
    }
    
    // Reduce confidence for estimated cycles
    const estimatedCount = cycles.filter(c => c.isEstimated).length;
    confidence -= estimatedCount * 0.05;
    
    return Math.max(0.3, Math.min(0.95, confidence));
  }

  private calculateDataQuality(cycles: CycleData[], dailyLogs: DailyLog[]): number {
    let score = 50; // Base score
    
    // Cycle data quality
    if (cycles.length >= this.OPTIMAL_CYCLES) score += 20;
    else score += (cycles.length / this.OPTIMAL_CYCLES) * 20;
    
    // Recent data availability
    const recentCycles = cycles.filter(c => {
      const daysSince = differenceInDays(new Date(), new Date(c.startDate));
      return daysSince < 90;
    });
    score += (recentCycles.length / 3) * 15;
    
    // Daily logs availability
    const recentLogs = dailyLogs.filter(log => {
      const daysSince = differenceInDays(new Date(), new Date(log.date));
      return daysSince < 30;
    });
    score += Math.min(15, recentLogs.length);
    
    return Math.min(100, score);
  }

  private calculateRecentDataAvailability(cycles: CycleData[], dailyLogs: DailyLog[]): number {
    const last30Days = dailyLogs.filter(log => {
      const daysSince = differenceInDays(new Date(), new Date(log.date));
      return daysSince < 30;
    });
    
    return (last30Days.length / 30) * 100;
  }

  private calculateIrregularityScore(pattern: CyclePattern): number {
    return Math.min(100, pattern.irregularityScore * 100);
  }

  private calculateStabilityScore(cycles: CycleData[], pattern: CyclePattern): number {
    let score = 100;
    
    // Penalize for variance
    score -= pattern.variance * 2;
    
    // Penalize for estimated cycles
    const estimatedCount = cycles.filter(c => c.isEstimated).length;
    score -= estimatedCount * 5;
    
    // Penalize for insufficient data
    if (cycles.length < this.OPTIMAL_CYCLES) {
      score -= (this.OPTIMAL_CYCLES - cycles.length) * 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private analyzeStressImpact(dailyLogs: DailyLog[]): number {
    const recentLogs = dailyLogs.slice(0, 14); // Last 2 weeks
    if (recentLogs.length === 0) return 0;
    
    const avgStress = recentLogs.reduce((sum, log) => sum + log.stress.level, 0) / recentLogs.length;
    return avgStress;
  }

  private analyzeSleepImpact(dailyLogs: DailyLog[]): number {
    const recentLogs = dailyLogs.slice(0, 14); // Last 2 weeks
    if (recentLogs.length === 0) return 7;
    
    const avgSleep = recentLogs.reduce((sum, log) => sum + log.sleep.hours, 0) / recentLogs.length;
    return avgSleep;
  }

  private extractPredictionFactors(cycles: CycleData[], dailyLogs: DailyLog[]) {
    const recentCycles = cycles.slice(0, 3);
    const lengths = recentCycles.map(c => c.cycleLength || 0).filter(l => l > 0);
    const avgLength = lengths.reduce((sum, l) => sum + l, 0) / lengths.length || 28;
    const variability = Math.max(...lengths) - Math.min(...lengths);
    
    const missedLogs = cycles.filter(c => c.isEstimated).length;
    
    const stressImpact = this.analyzeStressImpact(dailyLogs);
    const sleepImpact = 7 - this.analyzeSleepImpact(dailyLogs);
    
    const exerciseLogs = dailyLogs.filter(log => log.exercise.duration > 0);
    const exerciseImpact = (exerciseLogs.length / dailyLogs.length) * 100;
    
    const symptomPatterns = this.extractSymptomPatterns(cycles);
    
    return {
      recentCycleVariability: variability,
      missedLogs,
      stressImpact,
      sleepImpact,
      exerciseImpact,
      symptomPatterns
    };
  }

  private extractSymptomPatterns(cycles: CycleData[]): string[] {
    const symptomCounts: Record<string, number> = {};
    
    cycles.forEach(cycle => {
      cycle.symptoms.forEach(symptom => {
        symptomCounts[symptom.type] = (symptomCounts[symptom.type] || 0) + 1;
      });
    });
    
    return Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symptom]) => symptom);
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const predictionEngine = new PredictionEngine();
