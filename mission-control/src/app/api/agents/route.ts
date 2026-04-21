import { NextResponse } from 'next/server';

const teamMembers = [
  {
    id: 'brendan',
    name: 'Brendan',
    role: 'Founder - Leader By Design',
    tier: 'A',
    model: 'human',
    status: 'active',
    lastActive: 'Just now',
    messages: 0,
    reportsTo: 'none'
  },
  {
    id: 'niles',
    name: 'Niles',
    role: 'Chief Agent Officer (CAO)',
    tier: 'A',
    model: 'minimax',
    status: 'active',
    lastActive: 'Just now',
    messages: 0,
    reportsTo: 'brendan'
  },
  {
    id: 'kaizen',
    name: 'Kaizen',
    role: 'Head of Improvement',
    tier: 'B',
    model: 'kimi',
    status: 'active',
    lastActive: '5 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'ops',
    name: 'Casey',
    role: 'Head of Operations',
    tier: 'B',
    model: 'flashlite',
    status: 'active',
    lastActive: '10 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'strategy',
    name: 'Marcus',
    role: 'Head of Strategy',
    tier: 'B',
    model: 'kimi',
    status: 'active',
    lastActive: '15 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'content',
    name: 'Sophie',
    role: 'Head of Content',
    tier: 'B',
    model: 'flashlite',
    status: 'idle',
    lastActive: '20 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'messaging',
    name: 'Brandon',
    role: 'Head of Messaging',
    tier: 'B',
    model: 'kimi',
    status: 'active',
    lastActive: '25 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'client-delivery',
    name: 'Jerry',
    role: 'Client Delivery Lead',
    tier: 'B',
    model: 'flashlite',
    status: 'active',
    lastActive: '30 min ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'curriculum',
    name: 'Kathy',
    role: 'Curriculum Specialist',
    tier: 'C',
    model: 'kimi',
    status: 'idle',
    lastActive: '1 hour ago',
    messages: 0,
    reportsTo: 'content'
  },
  {
    id: 'podcast',
    name: 'Ruby',
    role: 'Podcast Producer',
    tier: 'C',
    model: 'flashlite',
    status: 'active',
    lastActive: '35 min ago',
    messages: 0,
    reportsTo: 'content'
  },
  {
    id: 'newsletter',
    name: 'Mia',
    role: 'Newsletter Writer',
    tier: 'C',
    model: 'flashlite',
    status: 'idle',
    lastActive: '40 min ago',
    messages: 0,
    reportsTo: 'content'
  },
  {
    id: 'linkedin',
    name: 'Ethan',
    role: 'LinkedIn Content Strategist',
    tier: 'C',
    model: 'flashlite',
    status: 'idle',
    lastActive: '45 min ago',
    messages: 0,
    reportsTo: 'content'
  },
  {
    id: 'video',
    name: 'Lucas',
    role: 'Video Script Writer',
    tier: 'C',
    model: 'flashlite',
    status: 'idle',
    lastActive: '50 min ago',
    messages: 0,
    reportsTo: 'content'
  },
  {
    id: 'youtube',
    name: 'Jay',
    role: 'YouTube Specialist',
    tier: 'C',
    model: 'flashlite',
    status: 'idle',
    lastActive: '55 min ago',
    messages: 0,
    reportsTo: 'content'
  },
  {
    id: 'email-sequence',
    name: 'Zoe',
    role: 'Email Sequence Strategist',
    tier: 'C',
    model: 'flashlite',
    status: 'idle',
    lastActive: '1 hour ago',
    messages: 0,
    reportsTo: 'messaging'
  },
  {
    id: 'community',
    name: 'Lawrie',
    role: 'Community Manager',
    tier: 'C',
    model: 'flashlite',
    status: 'active',
    lastActive: '1 hour ago',
    messages: 0,
    reportsTo: 'niles'
  },
  {
    id: 'research',
    name: 'Tim',
    role: 'Research Analyst',
    tier: 'C',
    model: 'flashlite',
    status: 'idle',
    lastActive: '2 hours ago',
    messages: 0,
    reportsTo: 'strategy'
  }
];

export async function GET() {
  return NextResponse.json({ agents: teamMembers });
}