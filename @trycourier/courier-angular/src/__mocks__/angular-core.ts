// `@angular/core` ships ESM-only (`.mjs`) bundles that Jest can't load as
// CommonJS. The CourierService only needs the `Injectable` decorator at runtime
// (and `OnDestroy` is an interface, erased at compile time), and the E2E tests
// instantiate the service directly rather than through Angular's DI. So we stub
// `@angular/core` with a no-op decorator instead of pulling in the full Angular
// runtime (and zone.js / TestBed) just to exercise the service's logic.

export function Injectable(): ClassDecorator {
  return () => {
    // no-op: DI metadata is irrelevant to direct instantiation
  };
}
