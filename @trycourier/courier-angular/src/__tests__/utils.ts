export function env(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

/**
 * Polls `assertion` until it stops throwing or the timeout elapses. Mirrors
 * React Testing Library's `waitFor`, which this package can't depend on.
 */
export async function waitFor(
  assertion: () => void,
  { timeout = 5_000, interval = 50 }: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const start = Date.now();
  let lastError: unknown;
  for (;;) {
    try {
      assertion();
      return;
    } catch (err) {
      lastError = err;
      if (Date.now() - start >= timeout) {
        throw lastError;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}
