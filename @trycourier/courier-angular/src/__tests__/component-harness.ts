// Import from the stub directly (not "@angular/core"): these helpers and the
// simplified token/view types only exist in the mock. At runtime Jest maps
// "@angular/core" to this same file, so `ElementRef`/`ViewContainerRef` here are
// the exact identities the components resolve via `inject()`.
import {
  ElementRef,
  ViewContainerRef,
  clearInjectionContext,
  setInjectionContext,
  type EmbeddedViewRef,
} from "../__mocks__/angular-core";

/**
 * Test harness for the Courier Angular components.
 *
 * The components resolve `ElementRef`/`ViewContainerRef` via `inject()` in their
 * field initializers, so we populate the stubbed injection context immediately
 * before construction (see `__mocks__/angular-core.ts`). This mirrors the
 * "instantiate directly, no TestBed" approach the CourierService tests use, while
 * still exercising the real `<courier-*>` web component as the host element.
 */
export function createComponent<T>(
  Ctor: new () => T,
  element: HTMLElement,
  viewContainerRef: ViewContainerRef
): T {
  setInjectionContext(
    new Map<unknown, unknown>([
      [ElementRef, new ElementRef(element)],
      [ViewContainerRef, viewContainerRef],
    ])
  );
  try {
    return new Ctor();
  } finally {
    clearInjectionContext();
  }
}

export type FakeEmbeddedView = EmbeddedViewRef<unknown> & {
  rootNodes: Node[];
  detectChanges: jest.Mock;
  destroy: jest.Mock;
};

/**
 * A fake `ViewContainerRef` whose `createEmbeddedView` yields a view wrapping the
 * nodes from `buildNodes()`. The returned `views` array records every view
 * created so tests can assert teardown (`destroy`) on `ngOnDestroy`.
 */
export function createFakeViewContainerRef(buildNodes: () => Node[] = () => [document.createElement("div")]): {
  viewContainerRef: ViewContainerRef;
  views: FakeEmbeddedView[];
} {
  const views: FakeEmbeddedView[] = [];
  const viewContainerRef = {
    createEmbeddedView: () => {
      const view: FakeEmbeddedView = {
        rootNodes: buildNodes(),
        detectChanges: jest.fn(),
        destroy: jest.fn(),
      };
      views.push(view);
      return view;
    },
  } as unknown as ViewContainerRef;

  return { viewContainerRef, views };
}

/** Resolves after the next microtask, flushing a component's `queueMicrotask` work. */
export function tick(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(() => resolve()));
}
