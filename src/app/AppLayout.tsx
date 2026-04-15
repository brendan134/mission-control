'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Wrench,
  CheckSquare,
  Circle,
  Calendar,
  Zap,
  Settings,
  Folder,
  Target,
  Database,
  Building2
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/strategy', label: 'Strategy', icon: Target },
  { href: '/projects', label: 'Projects', icon: Folder },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/my-week', label: 'My Week', icon: Calendar },
  { href: '/agents', label: 'Team', icon: Users },
  { href: '/office', label: 'Office', icon: Building2 },
  { href: '/automations', label: 'Cron Calendar', icon: Clock },
  { href: '/automation-builder', label: 'Automation Builder', icon: Zap },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        background: 'var(--background-secondary)', 
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent))', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              color: 'var(--background-primary)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
            }}>L</div>
            <span style={{ fontWeight: 600, fontSize: '15px' }}>Leader By Design</span>
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: 'var(--text-muted)', 
            marginTop: '4px',
            marginLeft: '38px'
          }}>Mission Control</div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  color: isActive ? 'var(--text)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--background-tertiary)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 500 : 400,
                  marginBottom: '2px'
                }}
              >
                <Icon size={16} style={{ opacity: isActive ? 1 : 0.7 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 12px',
            color: 'var(--text-secondary)',
            fontSize: '12px'
          }}>
            <Circle size={14} />
            <span>System Online</span>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              background: 'var(--success)', 
              borderRadius: '50%',
              marginLeft: 'auto'
            }} />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}