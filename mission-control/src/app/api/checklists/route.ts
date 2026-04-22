import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CHECKLISTS_FILE = '/data/.openclaw/workspace/checklists.json';

export async function GET() {
  try {
    if (!fs.existsSync(CHECKLISTS_FILE)) {
      return NextResponse.json({ checklists: {} });
    }
    const data = JSON.parse(fs.readFileSync(CHECKLISTS_FILE, 'utf-8'));
    return NextResponse.json({ checklists: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read checklists' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { episodeId, itemId, done } = body;
    
    if (!fs.existsSync(CHECKLISTS_FILE)) {
      return NextResponse.json({ error: 'Checklists file not found' }, { status: 404 });
    }
    
    const data = JSON.parse(fs.readFileSync(CHECKLISTS_FILE, 'utf-8'));
    
    if (data[episodeId] && data[episodeId].items) {
      data[episodeId].items = data[episodeId].items.map((item: any) => 
        item.id === itemId ? { ...item, done } : item
      );
      fs.writeFileSync(CHECKLISTS_FILE, JSON.stringify(data, null, 2));
    }
    
    return NextResponse.json({ success: true, checklists: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update checklist' }, { status: 500 });
  }
}
