// Daily Log Model for MongoDB
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  sleep: {
    hours: number;
    quality: 1 | 2 | 3 | 4 | 5;
    bedTime?: string;
    wakeTime?: string;
  };
  hydration: {
    glasses: number;
    liters: number;
  };
  exercise: {
    type?: string;
    duration: number;
    intensity: 'low' | 'medium' | 'high';
  };
  stress: {
    level: 1 | 2 | 3 | 4 | 5;
    triggers?: string[];
  };
  energy: number;
  symptoms: Array<{
    type: string;
    severity: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  }>;
  mood: Array<{
    mood: string;
    intensity: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DailyLogSchema = new Schema<IDailyLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    sleep: {
      hours: {
        type: Number,
        required: true,
        min: 0,
        max: 24,
      },
      quality: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      bedTime: String,
      wakeTime: String,
    },
    hydration: {
      glasses: {
        type: Number,
        required: true,
        min: 0,
      },
      liters: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    exercise: {
      type: String,
      duration: {
        type: Number,
        required: true,
        min: 0,
      },
      intensity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
    },
    stress: {
      level: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      triggers: [String],
    },
    energy: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
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
        notes: String,
      },
    ],
    mood: [
      {
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
  },
  {
    timestamps: true,
  }
);

// Compound index for unique date per user
DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });
DailyLogSchema.index({ userId: 1, createdAt: -1 });

const DailyLog: Model<IDailyLog> = mongoose.models.DailyLog || mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);

export default DailyLog;
