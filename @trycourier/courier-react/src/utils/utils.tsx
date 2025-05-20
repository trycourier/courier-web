// A tiny global registry for web-component -> React callbacks
let cbSeed = 0;

/**
 * Turns a real function into a string the custom element can execute.
 * The function itself is stored on `window` so it still has access to
 * React-side variables that were in scope when it was created.
 */
export const serializeHandler = <T extends Function>(
  fn?: T
): string | undefined => {
  if (!fn) return undefined;

  const key = `__courier_cb_${++cbSeed}`;
  (window as any)[key] = fn;          // keep the closure alive
  return `window['${key}'](props)`;   // what the attribute will execute
};