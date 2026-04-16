import { NextRequest, NextResponse } from 'next/server';
import { updateProjectStrategicAlignment } from '@/lib/strategy-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, priorityId } = body;
    updateProjectStrategicAlignment(projectId, priorityId || null);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to link project' }, { status: 500 });
  }
}