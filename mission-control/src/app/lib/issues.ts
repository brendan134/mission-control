// Issue definitions and fix logic for known issues
export interface Issue {
  id: string;
  category: 'health' | 'security';
  severity: 'critical' | 'warn' | 'info';
  title: string;
  description: string;
  whyItMatters: string;
  fixCommand: string;
  securityImpact?: string; // Warning if this fix affects security
}

export const ISSUE_LIBRARY: Issue[] = [
  // Health Check Issues
  {
    id: 'startup-performance',
    category: 'health',
    severity: 'warn',
    title: 'Startup Performance Optimization',
    description: 'NODE_COMPILE_CACHE and OPENCLAW_NO_RESPAWN are not set',
    whyItMatters: 'On small hosts (Pi/VM), CLI commands run slower without these. Adds extra startup overhead.',
    fixCommand: `echo 'export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
export OPENCLAW_NO_RESPAWN=1' >> ~/.bashrc && mkdir -p /var/tmp/openclaw-compile-cache`,
    securityImpact: 'None - purely performance optimization'
  },
  {
    id: 'whatsapp-config-warning',
    category: 'health',
    severity: 'info',
    title: 'WhatsApp Config Warning',
    description: 'WhatsApp plugin disabled but config is present',
    whyItMatters: 'Just a leftover config line - no functional impact but shows warning on every health check.',
    fixCommand: `node -e "const fs=require('fs'); const c=JSON.parse(fs.readFileSync('/data/.openclaw/openclaw.json','utf8')); delete c.plugins.entries.whatsapp; fs.writeFileSync('/data/.openclaw/openclaw.json',JSON.stringify(c,null,2));"`,
    securityImpact: 'None - removes unused config'
  },
  {
    id: 'telegram-pairing-mode',
    category: 'health',
    severity: 'warn',
    title: 'Telegram First-Time Setup Mode',
    description: 'Telegram is in pairing mode - new DMs need approval, group messages blocked',
    whyItMatters: 'You won\'t receive messages from new people automatically, and group chats won\'t work until configured.',
    fixCommand: `sed -i 's/"dmPolicy": "pairing"/"dmPolicy": "open"/g' /data/.openclaw/openclaw.json`,
    securityImpact: 'WARNING: Changing to "open" will allow any Telegram user to message you. Security audit may flag this.'
  },
  // Security Issues
  {
    id: 'open-groups-elevated',
    category: 'security',
    severity: 'critical',
    title: 'Open Group Policy with Elevated Tools',
    description: 'groupPolicy="open" with tools.elevated enabled',
    whyItMatters: 'A prompt injection in open groups can become a high-impact incident. Anyone can potentially send commands.',
    fixCommand: `sed -i 's/"groupPolicy": "open"/"groupPolicy": "allowlist"/g' /data/.openclaw/openclaw.json`,
    securityImpact: 'SECURITY FIX: This IS the security fix - essential to keep system secure'
  },
  {
    id: 'open-groups-runtime-fs',
    category: 'security',
    severity: 'critical',
    title: 'Open Group Policy with Runtime/Filesystem Tools',
    description: 'groupPolicy="open" with exec, process, read, write tools exposed',
    whyItMatters: 'Prompt injection in open groups can trigger dangerous file/command actions. This is very risky.',
    fixCommand: `sed -i 's/"groupPolicy": "open"/"groupPolicy": "allowlist"/g' /data/.openclaw/openclaw.json`,
    securityImpact: 'SECURITY FIX: This IS the security fix - essential to keep system secure'
  },
  {
    id: 'trusted-proxies-missing',
    category: 'security',
    severity: 'warn',
    title: 'Trusted Proxies Not Configured',
    description: 'gateway.trustedProxies is empty',
    whyItMatters: 'If using reverse proxy, local-client checks can be spoofed. Only matters if exposing Control UI externally.',
    fixCommand: `# Only needed if using reverse proxy:
# sed -i 's/"gateway": {/"gateway": { "trustedProxies": ["YOUR_PROXY_IP"],/' /data/.openclaw/openclaw.json`,
    securityImpact: 'None for local-only setup'
  },
  {
    id: 'multi-user-heuristic',
    category: 'security',
    severity: 'warn',
    title: 'Potential Multi-User Setup Detected',
    description: 'Personal-assistant model but groupPolicy="open"',
    whyItMatters: 'Runtime/process tools exposed without full sandboxing in multi-user context.',
    fixCommand: `sed -i 's/"groupPolicy": "open"/"groupPolicy": "allowlist"/g' /data/.openclaw/openclaw.json`,
    securityImpact: 'SECURITY FIX: Restricts access to allowed users only'
  }
];

// Parse output and extract issues
export function parseIssues(healthOutput: string, securityOutput: string): { 
  issues: Issue[]; 
  rawHealth: string; 
  rawSecurity: string;
} {
  const foundIssues: Issue[] = [];
  
  // Check health output
  if (healthOutput.includes('NODE_COMPILE_CACHE') || healthOutput.includes('OPENCLAW_NO_RESPAWN')) {
    foundIssues.push(ISSUE_LIBRARY.find(i => i.id === 'startup-performance')!);
  }
  if (healthOutput.includes('whatsapp') && healthOutput.includes('disabled')) {
    foundIssues.push(ISSUE_LIBRARY.find(i => i.id === 'whatsapp-config-warning')!);
  }
  if (healthOutput.includes('first-time setup') || healthOutput.includes('pairing mode')) {
    foundIssues.push(ISSUE_LIBRARY.find(i => i.id === 'telegram-pairing-mode')!);
  }
  
  // Check security output
  if (securityOutput.includes('open_groups_with_elevated') || securityOutput.includes('groupPolicy="open"')) {
    foundIssues.push(ISSUE_LIBRARY.find(i => i.id === 'open-groups-elevated')!);
  }
  if (securityOutput.includes('open_groups_with_runtime_or_fs')) {
    foundIssues.push(ISSUE_LIBRARY.find(i => i.id === 'open-groups-runtime-fs')!);
  }
  if (securityOutput.includes('trusted_proxies_missing')) {
    foundIssues.push(ISSUE_LIBRARY.find(i => i.id === 'trusted-proxies-missing')!);
  }
  if (securityOutput.includes('multi_user_heuristic') || securityOutput.includes('Potential multi-user')) {
    foundIssues.push(ISSUE_LIBRARY.find(i => i.id === 'multi-user-heuristic')!);
  }
  
  // Dedupe by id
  const uniqueIssues = foundIssues.filter((issue, index, self) => 
    index === self.findIndex(i => i.id === issue.id)
  );
  
  return {
    issues: uniqueIssues,
    rawHealth: healthOutput,
    rawSecurity: securityOutput
  };
}