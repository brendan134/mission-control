# Mission Control Architecture Rules

## 1. SOURCE OF TRUTH RULES

| Data Type | Authoritative Source | Required Action |
|-----------|---------------------|-----------------|
| Cron Jobs | OpenClaw gateway (`openclaw cron list`) | Fetch via CLI, never duplicate |
| Spend Data | OpenRouter API + OpenClaw gateway | Use shared API routes |
| Tasks | NOT CONNECTED | Show explicit placeholder, no fake data |
| Priorities | NOT CONNECTED | Show explicit placeholder, no fake data |
| Agents | OpenClaw gateway (`openclaw status`) | Fetch from gateway |
| Config | `lib/config.ts` + env vars | Single source |

**Rule:** Every data type MUST have exactly ONE authoritative source. Do not create local copies.

## 2. PERSISTENCE RULES

- **Never use component state as a database.** Local `useState` with complex objects is a code smell.
- **If data doesn't persist across page refreshes, it's not connected.** Show placeholder state.
- **Session storage is temporary.** Don't rely on it for production data.
- **API routes should fetch, not store.** Storage belongs in the backend (OpenClaw, database).

## 3. CONFIG RULES

All configurable values MUST live in `src/lib/config.ts`:
- Budget amounts
- Spending thresholds
- Model pricing
- Timezones
- API keys (via environment variables)
- Feature flags

**Never hardcode:**
- `budget: 100` → use `BUDGET_CONFIG.monthly`
- `todaySpend > 4` → use `BUDGET_CONFIG.dailyThreshold`
- `MODEL_PRICING` → use `@/lib/config`

## 4. HARDCODE RULES

### Critical (Must Fix)
- Budget values
- Owner names (Brendan, AI Agent, PH Team)
- Template defaults
- Agent IDs

### Risky (Review)
- Threshold values (e.g., > 4 for over budget)
- Color codes
- Feature flags

### Acceptable
- Stage names (Capture, Define, In Progress, etc.)
- Priority levels (High, Medium, Low)
- Event types

## 5. COMPONENT RULES

- **Import from `lib/data-model.ts`** for all type definitions
- **Don't redefine types** that already exist in data-model.ts
- **Server components by default** for data-fetching pages
- **Client components only** when interactivity is required (forms, handlers)

## 6. STATE RULES

- **Fetch on mount** via `useEffect` or server component
- **Loading states are mandatory** - never show fake data while loading
- **Error boundaries** - wrap API calls in try/catch, show graceful error
- **Empty states** - show meaningful message, not blank space

## 7. NAMING RULES

- **Files:** kebab-case (`my-week/page.tsx`)
- **Components:** PascalCase (`MyWeekPage`)
- **Interfaces:** PascalCase with meaningful suffix (`Task`, `Priority`, `Agent`)
- **Constants:** SCREAMING_SNAKE_CASE where appropriate
- **Enums:** PascalCase with descriptive names (`Stage`, `Priority`)

## 8. WORKFLOW RULES

1. **Before adding data to a page:**
   - Identify the authoritative source
   - If source doesn't exist, add explicit "NOT CONNECTED" placeholder
   
2. **Before creating a new type:**
   - Check `lib/data-model.ts` first
   - If gap exists, extend the model with justification
   
3. **Before hardcoding a value:**
   - Can it come from config?
   - Can it come from environment?
   - If not, document why it's acceptable

## 9. ERROR HANDLING RULES

- **API failures** → Show error message, not broken UI
- **Timeout** → Show timeout message with retry option
- **Validation** → Show inline errors, not alerts
- **Missing data** → Show empty/placeholder state

## 10. EXTENSION RULES

When extending the architecture:

1. **Add to data-model.ts** if it's a new data type
2. **Add to config.ts** if it's a configurable value  
3. **Add to API route** if it needs server-side processing
4. **Create a hook** if multiple pages need the same data pattern

---

**Enforcement:** These rules are non-negotiable. Code review should check for violations.