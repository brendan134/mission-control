/**
 * Mission Control Configuration
 * 
 * Central source for all configurable values.
 * Environment variables take precedence over defaults.
 */

// ==================== BUDGET ====================

export const BUDGET_CONFIG = {
  /** Default monthly spend budget in USD */
  monthly: parseInt(process.env.MONTHLY_BUDGET || '100'),
  /** Daily spend threshold for over-budget warning */
  dailyThreshold: parseFloat(process.env.DAILY_SPEND_THRESHOLD || '4'),
};

// ==================== PRICING ====================

/** Model pricing per 1M tokens (USD) */
export const MODEL_PRICING: Record<string, number> = {
  'minimax/minimax-m2.5': 0.40,
  'google/gemini-2.5-flite': 0.10,
  'google/gemini-2.5-flash': 0.30,
  'openai/gpt-5-nano': 0.15,
  'anthropic/claude-haiku-4-5': 0.80,
  'anthropic/claude-sonnet-4-6': 3.00,
  'anthropic/claude-opus-4-6': 15.00,
  'openrouter/deepseek/deepseek-v3.2': 0.35,
  'default': 1.00,
};

/** Get price for a model, with fallback */
export function getModelPrice(model: string): number {
  if (MODEL_PRICING[model]) return MODEL_PRICING[model];
  for (const [key, price] of Object.entries(MODEL_PRICING)) {
    if (model.toLowerCase().includes(key.toLowerCase())) {
      return price;
    }
  }
  return MODEL_PRICING['default'];
}

// ==================== TIMEZONE ====================

export const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || 'Australia/Brisbane';

// ==================== API CONFIG ====================

export const API_CONFIG = {
  openRouterKey: process.env.OPENROUTER_MANAGEMENT_KEY || '',
  openRouterBaseUrl: 'https://openrouter.ai/api/v1',
};

// ==================== UI CONFIG ====================

export const UI_CONFIG = {
  /** Default view for tasks page */
  defaultTasksView: 'board' as 'board' | 'leadership',
  /** Max priorities per week */
  maxWeeklyPriorities: 5,
  /** Show debugging info in console */
  debugMode: process.env.NODE_ENV !== 'production',
};

// ==================== SOURCE OF TRUTH DEFINITIONS ====================

/**
 * Defines the authoritative source for each data type.
 * This is the contract for data flow - do not bypass.
 */
export const DATA_SOURCE_OF_TRUTH = {
  cronJobs: {
    source: 'openclaw',
    path: 'openclaw cron list --json',
    description: 'OpenClaw gateway manages all cron jobs',
  },
  tasks: {
    source: 'not-connected',
    path: null,
    description: 'Task storage not yet implemented - use explicit placeholder',
  },
  weeklyPriorities: {
    source: 'not-connected',
    path: null,
    description: 'Priority storage not yet implemented - use explicit placeholder',
  },
  spendData: {
    source: 'openrouter',
    path: 'openrouter.ai API + openclaw gateway session data',
    description: 'Live spending data from OpenRouter and gateway',
  },
  agents: {
    source: 'openclaw',
    path: 'openclaw status --json',
    description: 'Agent list from OpenClaw gateway',
  },
  config: {
    source: 'config-file',
    path: 'lib/config.ts + environment variables',
    description: 'Configuration from this file and env vars',
  },
} as const;