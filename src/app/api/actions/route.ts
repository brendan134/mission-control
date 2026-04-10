import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'health-check') {
      const output = execSync('openclaw doctor --non-interactive 2>/dev/null', { encoding: 'utf8', timeout: 30000 });
      return NextResponse.json({ success: true, output });
    }

    if (action === 'security-audit') {
      const output = execSync('openclaw security audit --deep 2>/dev/null', { encoding: 'utf8', timeout: 60000 });
      return NextResponse.json({ success: true, output });
    }

    if (action === 'cost-audit') {
      const output = execSync('openclaw gateway usage-cost 2>/dev/null', { encoding: 'utf8', timeout: 10000 });
      return NextResponse.json({ success: true, output });
    }

    if (action === 'run-command') {
      const { command } = body;
      if (!command) return NextResponse.json({ error: 'No command provided' }, { status: 400 });
      const output = execSync(command, { encoding: 'utf8', timeout: 30000 });
      return NextResponse.json({ success: true, output });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}