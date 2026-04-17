import { NextResponse } from 'next/server';

const teamMembers = [
  {
    id: 'niles',
    name: 'Niles',
    role: 'Chief Agent Officer (CAO)',
    tier: 'A',
    model: 'Sonnet',
    status: 'online',
    lastActive: 'Just now',
    messages: 0,
    reportsTo: 'brendan'
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Head of Strategy',
    tier: 'B',
    model: 'MiniMax',
    status: 'idle',
    lastActive: '5 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'chloe',
    name: 'Chloe',
    role: 'Head of Content',
    tier: 'B',
    model: 'MiniMax',
    status: 'idle',
    lastActive: '10 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'zoe',
    name: 'Zoe',
    role: 'Head of Sales',
    tier: 'B',
    model: 'MiniMax',
    status: 'idle',
    lastActive: '15 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'dex',
    name: 'Dex',
    role: 'Head of Operations',
    tier: 'B',
    model: 'MiniMax',
    status: 'idle',
    lastActive: '20 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'sage',
    name: 'Sage',
    role: 'Chief Happiness Officer',
    tier: 'C',
    model: 'MiniMax',
    status: 'offline',
    lastActive: '1 hour ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Creative Director',
    tier: 'C',
    model: 'MiniMax',
    status: 'offline',
    lastActive: '2 hours ago',
    messages: 0,
    reportsTo: 'chloe'
  },
  {
    id: 'blake',
    name: 'Blake',
    role: 'Data Analyst',
    tier: 'C',
    model: 'MiniMax',
    status: 'offline',
    lastActive: '3 hours ago',
    messages: 0,
    reportsTo: 'dex'
  },
  {
    id: 'echo',
    name: 'Echo',
    role: 'Communications Lead',
    tier: 'C',
    model: 'MiniMax',
    status: 'offline',
    lastActive: '4 hours ago',
    messages: 0,
    reportsTo: 'chloe'
  }
];

export async function GET() {
  return NextResponse.json({ agents: teamMembers });
}