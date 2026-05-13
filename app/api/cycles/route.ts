// Cycles API Route
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongodb';
import Cycle from '@/lib/db/models/Cycle';

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

// GET - Fetch all cycles for user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const cycles = await Cycle.find({ userId })
      .sort({ startDate: -1 })
      .lean();

    return NextResponse.json({ cycles }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch cycles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cycles', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new cycle
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const cycleData = await request.json();

    const cycle = await Cycle.create({
      ...cycleData,
      userId,
    });

    return NextResponse.json({ cycle }, { status: 201 });
  } catch (error: any) {
    console.error('Create cycle error:', error);
    return NextResponse.json(
      { error: 'Failed to create cycle', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update cycle
export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id, ...updateData } = await request.json();

    const cycle = await Cycle.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!cycle) {
      return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });
    }

    return NextResponse.json({ cycle }, { status: 200 });
  } catch (error: any) {
    console.error('Update cycle error:', error);
    return NextResponse.json(
      { error: 'Failed to update cycle', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete cycle
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
      return NextResponse.json({ error: 'Cycle ID required' }, { status: 400 });
    }

    const cycle = await Cycle.findOneAndDelete({ _id: id, userId });

    if (!cycle) {
      return NextResponse.json({ error: 'Cycle not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cycle deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete cycle error:', error);
    return NextResponse.json(
      { error: 'Failed to delete cycle', details: error.message },
      { status: 500 }
    );
  }
}
