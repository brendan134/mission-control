import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = '/data/.openclaw/workspace/output/all-action-items.json';

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ 
        error: 'No action items found. Run batch extraction first.' 
      }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    return NextResponse.json({
      success: true,
      count: data.length,
      totalActions: data.reduce((sum: number, r: any) => sum + r.actions.length, 0),
      data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client, limit } = body;
    
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ 
        error: 'No action items found' 
      }, { status: 404 });
    }

    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    // Filter by client if specified
    if (client) {
      data = data.filter((r: any) => 
        r.client?.toLowerCase().includes(client.toLowerCase())
      );
    }
    
    // Limit results
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return NextResponse.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}