// Daily Logs API Route
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import DailyLog from '@/lib/db/models/DailyLog';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET - Fetch all daily logs for user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const logs = await DailyLog.find({ userId })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ logs }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch daily logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily logs', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new daily log
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const logData = await request.json();

    // Check if log already exists for this date
    const existingLog = await DailyLog.findOne({
      userId,
      date: new Date(logData.date),
    });

    if (existingLog) {
      // Update existing log
      const updatedLog = await DailyLog.findByIdAndUpdate(
        existingLog._id,
        logData,
        { new: true }
      );
      return NextResponse.json({ log: updatedLog }, { status: 200 });
    }

    // Create new log
    const log = await DailyLog.create({
      ...logData,
      userId,
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error: any) {
    console.error('Create daily log error:', error);
    return NextResponse.json(
      { error: 'Failed to create daily log', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update daily log
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id, ...updateData } = await request.json();

    const log = await DailyLog.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!log) {
      return NextResponse.json({ error: 'Daily log not found' }, { status: 404 });
    }

    return NextResponse.json({ log }, { status: 200 });
  } catch (error: any) {
    console.error('Update daily log error:', error);
    return NextResponse.json(
      { error: 'Failed to update daily log', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete daily log
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Log ID required' }, { status: 400 });
    }

    const log = await DailyLog.findOneAndDelete({ _id: id, userId });

    if (!log) {
      return NextResponse.json({ error: 'Daily log not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Daily log deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete daily log error:', error);
    return NextResponse.json(
      { error: 'Failed to delete daily log', details: error.message },
      { status: 500 }
    );
  }
}
