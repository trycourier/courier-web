import { onMounted, watch, type Ref, type VNodeChild, type WatchSource } from "vue";
import { vNodeToHTMLElement } from "./render";

/**
 * Runs `cb` once the custom element referenced by `elRef` is mounted and
 * upgraded. Mirrors React's `elementReady` + `queueMicrotask` readiness pattern:
 * the microtask defers until after the custom element has been registered and
 * its imperative API is available.
 */
export function onElementReady<T extends HTMLElement>(
  elRef: Ref<T | null>,
  cb: (el: T) => void
): void {
  onMounted(() => {
    queueMicrotask(() => {
      const el = elRef.value;
      if (el) {
        cb(el);
      }
    });
  });
}

/**
 * Registers an event/setter callback on the element and re-registers it
 * whenever the source handler changes. The web components expect a single
 * registration call per handler (e.g. `el.onMessageClick(cb)`).
 */
export function bindCallback<H>(
  source: WatchSource<H>,
  register: (handler: H) => void
): void {
  watch(source, (handler) => register(handler), { immediate: true });
}

/**
 * Bridges a Vue render prop `(props) => VNodeChild` into the web component's
 * `(props) => HTMLElement` render factory, (re)registering whenever the render
 * prop changes. No-ops while the render prop is undefined, matching React's
 * "only set when provided" behavior.
 */
export function bindRenderSlot<P>(
  source: WatchSource<((props: P) => VNodeChild) | undefined>,
  setFactory: (factory: (props: P) => HTMLElement) => void
): void {
  watch(
    source,
    (renderFn) => {
      if (!renderFn) {
        return;
      }
      queueMicrotask(() => {
        setFactory((props: P) => vNodeToHTMLElement(renderFn(props)));
      });
    },
    { immediate: true }
  );
}

/** JSON-stringifies an object onto an attribute, or `undefined` when absent. */
export function jsonAttr(value: unknown): string | undefined {
  return value == null ? undefined : JSON.stringify(value);
}
