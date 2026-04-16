import { NextRequest, NextResponse } from 'next/server';
import { getUnalignedProjects, updateProjectStrategicAlignment, getProjectAlignment } from '@/lib/strategy-service';

export async function GET() {
  try {
    const unaligned = getUnalignedProjects();
    return NextResponse.json(unaligned);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load unaligned projects' }, { status: 500 });
  }
}