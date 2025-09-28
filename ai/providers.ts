import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// Export a shared OpenRouter instance that can create any model by ID at runtime
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY! || '',
});

// The app now supports arbitrary OpenRouter model IDs fetched at runtime.
// Keep a conservative default as fallback when the UI has not fetched yet.
export const DEFAULT_MODEL_ID = "openrouter/auto";
