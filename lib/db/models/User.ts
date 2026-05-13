// User Model for MongoDB
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      periodReminders: boolean;
      fertileWindowAlerts: boolean;
      ovulationReminders: boolean;
      hydrationReminders: boolean;
      symptomTracking: boolean;
      predictionUpdates: boolean;
    };
    privacySettings: {
      dataSharing: boolean;
      anonymousAnalytics: boolean;
      communityVisible: boolean;
    };
  };
  healthProfile: {
    averageCycleLength?: number;
    averagePeriodDuration?: number;
    hasIrregularCycles: boolean;
    hasPCOS: boolean;
    contraceptionMethod?: string;
    medicalConditions: string[];
  };
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      language: {
        type: String,
        default: 'en',
      },
      notifications: {
        periodReminders: { type: Boolean, default: true },
        fertileWindowAlerts: { type: Boolean, default: true },
        ovulationReminders: { type: Boolean, default: true },
        hydrationReminders: { type: Boolean, default: true },
        symptomTracking: { type: Boolean, default: true },
        predictionUpdates: { type: Boolean, default: true },
      },
      privacySettings: {
        dataSharing: { type: Boolean, default: false },
        anonymousAnalytics: { type: Boolean, default: true },
        communityVisible: { type: Boolean, default: true },
      },
    },
    healthProfile: {
      averageCycleLength: Number,
      averagePeriodDuration: Number,
      hasIrregularCycles: { type: Boolean, default: false },
      hasPCOS: { type: Boolean, default: false },
      contraceptionMethod: String,
      medicalConditions: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
