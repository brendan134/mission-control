'use client';

import { useState, useEffect } from 'react';

export default function MyWeek() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => setTasks(Array.isArray(d) ? d : []))
      .catch(() => setTasks([]));
      
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding:32}}>Loading...</div>;

  const active = tasks.filter((t:any) => t.status === 'Active');
  const blocked = tasks.filter((t:any) => t.blocked || t.status === 'Blocked');
  const due = tasks.filter((t:any) => {
    if (!t.due_date) return false;
    const dueDate = new Date(t.due_date);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate <= weekFromNow;
  });
  const done = tasks.filter((t:any) => t.status === 'Completed' || t.stage === 'Done');

  return (
    <div style={{padding:24, maxWidth:1400}}>
      <h1 style={{fontSize:28, fontWeight:600}}>My Week</h1>
      <p style={{color:'#6b7280', margin:'4px 0 24px'}}>{new Date().toLocaleDateString()}</p>
      
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32}}>
        <Card label="Active" value={active.length} color="#3b82f6" />
        <Card label="Due" value={due.length} color="#8b5cf6" />
        <Card label="Blocked" value={blocked.length} color="#ef4444" />
        <Card label="Done" value={done.length} color="#22c55e" />
      </div>
      
      {/* Active Tasks */}
      <h2 style={{fontSize:18, fontWeight:600, margin:'0 0 16px'}}>Active</h2>
      <div style={{background:'#1f2937', borderRadius:12, padding:20, marginBottom:24}}>
        {active.length === 0 ? <p style={{color:'#6b7280'}}>No active tasks</p> : 
          active.map((t:any) => (
            <div key={t.id} style={{padding:12, background:'#111827', borderRadius:8, marginBottom:8}}>
              <div style={{fontWeight:500}}>{t.title}</div>
              <div style={{fontSize:12, color:'#6b7280', marginTop:4}}>{t.priority}</div>
            </div>
          ))
        }
      </div>

      {/* Due Tasks */}
      <h2 style={{fontSize:18, fontWeight:600, margin:'0 0 16px'}}>Due This Week</h2>
      <div style={{background:'#1f2937', borderRadius:12, padding:20, marginBottom:24}}>
        {due.length === 0 ? <p style={{color:'#6b7280'}}>No tasks due this week</p> : 
          due.map((t:any) => (
            <div key={t.id} style={{padding:12, background:'#111827', borderRadius:8, marginBottom:8}}>
              <div style={{fontWeight:500}}>{t.title}</div>
              <div style={{fontSize:12, color:'#8b5cf6', marginTop:4}}>Due: {new Date(t.due_date).toLocaleDateString()}</div>
            </div>
          ))
        }
      </div>

      {/* Blocked Tasks */}
      <h2 style={{fontSize:18, fontWeight:600, margin:'0 0 16px'}}>Blocked</h2>
      <div style={{background:'#1f2937', borderRadius:12, padding:20, marginBottom:24}}>
        {blocked.length === 0 ? <p style={{color:'#6b7280'}}>No blocked tasks</p> : 
          blocked.map((t:any) => (
            <div key={t.id} style={{padding:12, background:'#111827', borderRadius:8, marginBottom:8, borderLeft:'3px solid #ef4444'}}>
              <div style={{fontWeight:500}}>{t.title}</div>
              <div style={{fontSize:12, color:'#ef4444', marginTop:4}}>{t.blocked_reason || 'Blocked'}</div>
            </div>
          ))
        }
      </div>
      
      <h2 style={{fontSize:18, fontWeight:600, margin:'0 0 16px'}}>Projects</h2>
      <div style={{background:'#1f2937', borderRadius:12, padding:20}}>
        {projects.length === 0 ? <p style={{color:'#6b7280'}}>No projects</p> : 
          projects.map((p:any) => (
            <div key={p.id} style={{padding:16, background:'#111827', borderRadius:8, marginBottom:8}}>
              <div style={{fontWeight:500}}>{p.name}</div>
              <div style={{fontSize:12, color:'#6b7280', marginTop:4}}>{p.status}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function Card({label,value,color}:{label:string,value:number,color:string}) {
  return (
    <div style={{background:'#1f2937', borderRadius:12, padding:20, borderLeft:'4px solid '+color}}>
      <div style={{fontSize:28, fontWeight:600}}>{value}</div>
      <div style={{fontSize:13, color:'#6b7280'}}>{label}</div>
    </div>
  );
}
