// `@angular/core` ships ESM-only (`.mjs`) bundles that Jest can't load as
// CommonJS, and pulling in the full Angular runtime (zone.js / TestBed) just to
// exercise our thin wrappers is heavy and brittle. So we stub `@angular/core`
// with the minimum surface our code touches and drive components by direct
// instantiation — the same approach the CourierService E2E tests use.
//
// For the service that means just the `Injectable` decorator. For the
// components it additionally means: no-op class/property decorators, a real
// `EventEmitter`, value tokens for `inject()`, and a tiny injection context the
// tests populate before constructing a component (see `setInjectionContext`).

/** No-op `@Injectable()` — DI metadata is irrelevant to direct instantiation. */
export function Injectable(): ClassDecorator {
  return () => {
    // no-op
  };
}

/** No-op `@Component({...})`. */
export function Component(_config?: unknown): ClassDecorator {
  return () => {
    // no-op
  };
}

/** No-op property decorators. */
export function Input(): PropertyDecorator {
  return () => {
    // no-op
  };
}
export function Output(): PropertyDecorator {
  return () => {
    // no-op
  };
}
export function ContentChild(_selector: unknown, _opts?: unknown): PropertyDecorator {
  return () => {
    // no-op
  };
}

/** Mirrors Angular's `ChangeDetectionStrategy` enum (only `OnPush` is referenced). */
export const ChangeDetectionStrategy = { OnDefault: 1, OnPush: 0 } as const;

/** Schema marker referenced in `@Component` metadata. */
export const CUSTOM_ELEMENTS_SCHEMA = { name: "custom-elements" };

/** Minimal `EventEmitter` — supports `.emit()` and `.subscribe()`. */
export class EventEmitter<T> {
  private listeners: Array<(value: T) => void> = [];

  emit(value: T): void {
    this.listeners.slice().forEach((listener) => listener(value));
  }

  subscribe(next: (value: T) => void): { unsubscribe: () => void } {
    this.listeners.push(next);
    return {
      unsubscribe: () => {
        this.listeners = this.listeners.filter((listener) => listener !== next);
      },
    };
  }
}

// Injection tokens. These are referenced both as `inject(X)` arguments and as
// types, so they must exist as runtime values.
export class ElementRef<T = unknown> {
  constructor(public nativeElement: T) {}
}
export class ViewContainerRef {}
export class TemplateRef<C = unknown> {}

// Type-only members — erased at compile time, declared so imports resolve.
export interface EmbeddedViewRef<C> {
  rootNodes: unknown[];
  detectChanges(): void;
  destroy(): void;
}
export interface AfterViewInit {
  ngAfterViewInit(): void;
}
export interface OnChanges {
  ngOnChanges(): void;
}
export interface OnDestroy {
  ngOnDestroy(): void;
}

// --- Lightweight injection context used by tests -------------------------------
// Components call `inject(ElementRef)` / `inject(ViewContainerRef)` in their field
// initializers (the constructor). Tests set the active context immediately before
// `new Component()`; `inject()` resolves tokens against it.

let activeInjector: Map<unknown, unknown> | null = null;

/** Sets the injection context resolved by `inject()` for the next construction. */
export function setInjectionContext(providers: Map<unknown, unknown>): void {
  activeInjector = providers;
}

/** Clears the active injection context. */
export function clearInjectionContext(): void {
  activeInjector = null;
}

export function inject<T>(token: unknown): T {
  if (!activeInjector || !activeInjector.has(token)) {
    throw new Error(
      "inject() called outside of a test injection context. Wrap construction with setInjectionContext()."
    );
  }
  return activeInjector.get(token) as T;
}
