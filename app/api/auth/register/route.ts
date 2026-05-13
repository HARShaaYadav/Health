// Registration API Route
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          periodReminders: true,
          fertileWindowAlerts: true,
          ovulationReminders: true,
          hydrationReminders: true,
          symptomTracking: true,
          predictionUpdates: true,
        },
        privacySettings: {
          dataSharing: false,
          anonymousAnalytics: true,
          communityVisible: true,
        },
      },
      healthProfile: {
        hasIrregularCycles: false,
        hasPCOS: false,
        medicalConditions: [],
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      preferences: user.preferences,
      healthProfile: user.healthProfile,
    };

    return NextResponse.json(
      { user: userData, token },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed', details: error.message },
      { status: 500 }
    );
  }
}
