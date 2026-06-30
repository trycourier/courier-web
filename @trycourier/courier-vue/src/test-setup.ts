import { vi } from "vitest";

// Load env vars from a local .env (no-op in CI, where they come from secrets).
import "dotenv/config";

// jsdom does not provide fetch; courier-js uses it for HTTP.
import "cross-fetch/polyfill";

// jsdom does not provide matchMedia; the web components use it for theming.
global.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
