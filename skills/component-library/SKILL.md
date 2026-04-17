---
name: component-library
description: Reusable UI components for Mission Control. Use when building new pages or adding features to quickly add consistent, styled components without rewriting styles.
---

# Component Library

## Available Components

### Stat Card
```tsx
<div style={{ flex: 1, padding: '16px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Icon style={{ width: '20px', height: '20px', color: '#10b981' }} />
  </div>
  <div><div style={{ fontSize: '24px', fontWeight: '700' }}>42</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Label</div></div>
</div>
```

### Agent Card
```tsx
<div style={{ padding: '16px', background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '12px', borderLeft: '4px solid #D4AF37' }}>
  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{name}</div>
  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{role}</div>
  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', background: '#D4AF3720', color: '#D4AF37' }}>Tier {tier}</span>
</div>
```

### Clickable Detail Card (with expansion)
```tsx
<div onClick={() => setExpanded(!expanded)} style={{ padding: '16px', background: 'var(--background-tertiary)', borderRadius: '12px', border: '2px solid #3b82f6', cursor: 'pointer' }}>
  <div style={{ fontWeight: '600' }}>{name}</div>
  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{role}</div>
</div>
{expanded && (
  <div style={{ marginTop: '12px', padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
    {/* Details */}
  </div>
)}
```

### Purpose Box (gold gradient)
```tsx
<div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '12px', padding: '20px' }}>
  <div style={{ fontSize: '11px', fontWeight: '600', color: '#d4af37', marginBottom: '8px', textTransform: 'uppercase' }}>Purpose</div>
  <p style={{ fontSize: '14px', margin: 0 }}>{text}</p>
</div>
```

### Filter Buttons
```tsx
<div style={{ display: 'flex', gap: '8px' }}>
  {['all', 'A', 'B', 'C'].map(tier => (
    <button key={tier} onClick={() => setFilter(tier)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)', background: filter === tier ? 'var(--accent)' : 'transparent', color: filter === tier ? 'var(--background-primary)' : 'var(--text)', cursor: 'pointer' }}>
      {tier === 'all' ? 'All' : `Tier ${tier}`}
    </button>
  ))}
</div>
```

### Grid Layout
```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
  {/* Cards */}
</div>
```

### Arrow/Connection Line
```tsx
<div style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '24px 0' }}>↓</div>
```