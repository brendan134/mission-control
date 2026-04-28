#!/bin/bash
# Add tasks from a template to a project
# Usage: ./add-template-tasks.sh <project-id> <template-name>

PROJECT_ID=$1
TEMPLATE=$2
TEMPLATES_FILE="/data/.openclaw/workspace/project-templates.json"
TASKS_FILE="/data/.openclaw/workspace/tasks.json"

node << NODEEOF
const fs = require('fs');
const templates = JSON.parse(fs.readFileSync('$TEMPLATES_FILE', 'utf-8'));
const tasks = JSON.parse(fs.readFileSync('$TASKS_FILE', 'utf-8'));

if (!templates['$TEMPLATE']) {
  console.log("Template '$TEMPLATE' not found");
  process.exit(1);
}

const templateTasks = templates['$TEMPLATE'];
const today = new Date();

templateTasks.forEach((t, i) => {
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + t.due_days);
  
  tasks.push({
    title: t.title,
    description: t.description,
    project_id: '$PROJECT_ID',
    priority: t.priority,
    task_type: 'Project',
    stage: t.stage,
    primary_owner_id: 'Brendan',
    next_action: t.description,
    status: 'Todo',
    blocked: false,
    supporting_owner_ids: [],
    assigned_agent_ids: [],
    requires_human_input: true,
    requires_decision: false,
    created_by: 'Niles',
    primary_owner_type: 'Brendan',
    related_task_ids: [],
    tag_ids: [],
    review_required: false,
    id: 'task-' + Date.now() + '-tpl' + i,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    due_date: dueDate.toISOString().split('T')[0]
  });
  console.log('✅ Added: ' + t.title + ' (due: ' + dueDate.toISOString().split('T')[0] + ')');
});

fs.writeFileSync('$TASKS_FILE', JSON.stringify(tasks, null, 2));
console.log('\nAdded ' + templateTasks.length + ' tasks from "$TEMPLATE"');
NODEEOF