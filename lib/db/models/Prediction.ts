// Prediction Model for MongoDB
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrediction extends Document {
  userId: mongoose.Types.ObjectId;
  generatedAt: Date;
  nextPeriod: {
    startDate: Date;
    endDate: Date;
    duration: number;
    isRange: boolean;
    rangeStart?: Date;
    rangeEnd?: Date;
    confidence: number;
  };
  fertileWindow: {
    startDate: Date;
    endDate: Date;
    peakDays: Date[];
    confidence: number;
  };
  ovulation: {
    date: Date;
    isRange: boolean;
    rangeStart?: Date;
    rangeEnd?: Date;
    probability: number;
    confidence: number;
  };
  confidence: {
    overall: number;
    dataQuality: number;
    cycleRegularity: number;
    historicalAccuracy: number;
    recentDataAvailability: number;
  };
  irregularityScore: number;
  stabilityScore: number;
  factors: {
    recentCycleVariability: number;
    missedLogs: number;
    stressImpact: number;
    sleepImpact: number;
    exerciseImpact: number;
    symptomPatterns: string[];
  };
  aiInsights: Array<{
    type: string;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'success';
    date: Date;
    actionable: boolean;
    action?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const PredictionSchema = new Schema<IPrediction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    generatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextPeriod: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      duration: { type: Number, required: true },
      isRange: { type: Boolean, default: false },
      rangeStart: Date,
      rangeEnd: Date,
      confidence: { type: Number, required: true },
    },
    fertileWindow: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      peakDays: [Date],
      confidence: { type: Number, required: true },
    },
    ovulation: {
      date: { type: Date, required: true },
      isRange: { type: Boolean, default: false },
      rangeStart: Date,
      rangeEnd: Date,
      probability: { type: Number, required: true },
      confidence: { type: Number, required: true },
    },
    confidence: {
      overall: { type: Number, required: true },
      dataQuality: { type: Number, required: true },
      cycleRegularity: { type: Number, required: true },
      historicalAccuracy: { type: Number, required: true },
      recentDataAvailability: { type: Number, required: true },
    },
    irregularityScore: {
      type: Number,
      required: true,
    },
    stabilityScore: {
      type: Number,
      required: true,
    },
    factors: {
      recentCycleVariability: Number,
      missedLogs: Number,
      stressImpact: Number,
      sleepImpact: Number,
      exerciseImpact: Number,
      symptomPatterns: [String],
    },
    aiInsights: [
      {
        type: String,
        title: String,
        message: String,
        severity: {
          type: String,
          enum: ['info', 'warning', 'success'],
        },
        date: Date,
        actionable: Boolean,
        action: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
PredictionSchema.index({ userId: 1, generatedAt: -1 });
PredictionSchema.index({ userId: 1, createdAt: -1 });

const Prediction: Model<IPrediction> = mongoose.models.Prediction || mongoose.model<IPrediction>('Prediction', PredictionSchema);

export default Prediction;
