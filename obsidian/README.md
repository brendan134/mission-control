# Obsidian Vault - OpenClaw Memory System

## Purpose
This vault provides Layer 4 of the OpenClaw memory system, enabling:
- Compaction-proof memory
- On-demand retrieval of past sessions
- Multi-agent collaboration
- Self-improvement through mistake logging

## Structure

### 01-daily-logs/
Auto-generated summaries of each session. Format: `YYYY-MM-DD.md`

### 02-mistakes/
Learning log of errors and improvements. Format: `YYYY-MM-mistakes.md`

### 03-shared/
Agent-accessible workspace for cross-session context
- `knowledge/` - Facts, concepts, references
- `projects/` - Active project context
- `templates/` - Reusable templates

### 04-knowledge/
Personal wiki for visual exploration of memories

### prompts/
System prompts for agent behavior

## Usage
See `prompts/memory-system-prompt.md` for agent integration instructions.