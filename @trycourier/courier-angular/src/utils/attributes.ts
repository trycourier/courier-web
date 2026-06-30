/** Sets or removes a plain string attribute on an element. */
export function setAttr(el: HTMLElement, name: string, value: string | undefined | null): void {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, value);
  }
}

/** JSON-stringifies an object onto an attribute, or removes it when absent. */
export function setJsonAttr(el: HTMLElement, name: string, value: unknown): void {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, JSON.stringify(value));
  }
}

/** Sets or removes a boolean attribute (present when true). */
export function setBoolAttr(el: HTMLElement, name: string, value: boolean | undefined | null): void {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, String(value));
  }
}
