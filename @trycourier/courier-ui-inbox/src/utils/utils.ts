export function replaceElementInShadowRoot(
  shadowRoot: ShadowRoot,
  elementId: string,
  newElement: HTMLElement
): void {
  const existingElement = shadowRoot.getElementById(elementId);
  if (existingElement) {
    const index = Array.from(shadowRoot.children).indexOf(existingElement);
    shadowRoot.removeChild(existingElement);
    shadowRoot.insertBefore(newElement, shadowRoot.children[index] || null);
  } else {
    shadowRoot.appendChild(newElement);
  }
}