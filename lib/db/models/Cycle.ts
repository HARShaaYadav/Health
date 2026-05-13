// Cycle Model for MongoDB
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICycle extends Document {
  userId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  periodDuration: number;
  cycleLength?: number;
  flowIntensity: 'spotting' | 'light' | 'medium' | 'heavy';
  symptoms: Array<{
    type: string;
    severity: 1 | 2 | 3 | 4 | 5;
    date: Date;
    notes?: string;
  }>;
  mood: Array<{
    date: Date;
    mood: string;
    intensity: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  }>;
  notes?: string;
  isEstimated: boolean;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const CycleSchema = new Schema<ICycle>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    periodDuration: {
      type: Number,
      required: true,
      min: 1,
      max: 15,
    },
    cycleLength: {
      type: Number,
      min: 15,
      max: 60,
    },
    flowIntensity: {
      type: String,
      enum: ['spotting', 'light', 'medium', 'heavy'],
      default: 'medium',
    },
    symptoms: [
      {
        type: {
          type: String,
          required: true,
        },
        severity: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        date: {
          type: Date,
          required: true,
        },
        notes: String,
      },
    ],
    mood: [
      {
        date: {
          type: Date,
          required: true,
        },
        mood: {
          type: String,
          required: true,
        },
        intensity: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        notes: String,
      },
    ],
    notes: String,
    isEstimated: {
      type: Boolean,
      default: false,
    },
    confidence: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
CycleSchema.index({ userId: 1, startDate: -1 });
CycleSchema.index({ userId: 1, createdAt: -1 });

const Cycle: Model<ICycle> = mongoose.models.Cycle || mongoose.model<ICycle>('Cycle', CycleSchema);

export default Cycle;
