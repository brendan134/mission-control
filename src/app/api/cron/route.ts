import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    const output = execSync('openclaw cron list --json 2>/dev/null', { encoding: 'utf8', timeout: 10000 });
    let jobs = [];
    try {
      jobs = JSON.parse(output);
    } catch {
      // If not JSON, parse manually
      const lines = output.split('\n').filter(l => l.includes('cron'));
      jobs = lines.map((line: string) => {
        const parts = line.split(/\s+/);
        return {
          id: parts[0] || '',
          name: parts.slice(1).join(' ').split('cron')[0].trim() || 'Unnamed',
          schedule: { expr: line.includes('cron') ? line.match(/cron\s+(\S+)/)?.[1] || '* * * * *' : '* * * * *' },
          enabled: !line.includes('disabled'),
        };
      });
    }
    return NextResponse.json({ jobs });
  } catch (error: any) {
    return NextResponse.json({ jobs: [], error: error.message }, { status: 200 });
  }
}