// During SSR there is no HTMLElement, so fall back to a no-op class
type HTMLElementCtor = {
  new(): HTMLElement;          // instance type
  prototype: HTMLElement;       // ensures methods like attachShadow are visible
};

/**
 * During SSR we fall back to a zero-cost dummy constructor, **but**
 * we still cast it to `HTMLElementCtor` so the *type* remains correct.
 */
export const BaseElement: HTMLElementCtor =
  (typeof window === 'undefined'
    ? (class { } as unknown)
    : HTMLElement) as HTMLElementCtor;