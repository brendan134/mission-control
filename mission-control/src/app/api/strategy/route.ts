import { NextRequest, NextResponse } from 'next/server';
import { createPriority, updatePriority, deletePriority, getPriorities, getUnalignedProjects, updateProjectStrategicAlignment } from '@/lib/strategy-service';

export async function GET() {
  try {
    const priorities = getPriorities();
    return NextResponse.json(priorities);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load priorities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const priority = createPriority(body);
    return NextResponse.json(priority);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create priority' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const priority = updatePriority(id, updates);
    if (!priority) return NextResponse.json({ error: 'Priority not found' }, { status: 404 });
    return NextResponse.json(priority);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update priority' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const deleted = deletePriority(body.id);
    if (!deleted) return NextResponse.json({ error: 'Priority not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete priority' }, { status: 500 });
  }
}