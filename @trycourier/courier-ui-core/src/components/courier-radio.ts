import { CourierBaseElement } from './courier-base-element';
import { registerElement, injectGlobalStyle } from '../utils/registeration';
import { COURIER_DEFAULT_PRIMARY_COLOR } from '../utils/courier-colors';

const STYLE_ID = 'courier-radio';

const STYLES = `
  courier-radio {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    line-height: 0;
  }
  .courier-radio {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    line-height: 0;
    transition: all 150ms ease;
  }
  .courier-radio svg {
    display: block;
  }
  .courier-radio-ring {
    transition: stroke 150ms ease;
  }
  .courier-radio-dot {
    opacity: 0;
    transform: scale(0.5);
    transform-origin: center;
    transform-box: fill-box;
    transition:
      opacity 200ms cubic-bezier(0.2, 0, 0.13, 1.5),
      transform 200ms cubic-bezier(0.2, 0, 0.13, 1.5);
  }
  .courier-radio[aria-checked="true"] .courier-radio-dot {
    opacity: 1;
    transform: scale(1);
  }
`;

const DEFAULT_RING_COLOR = '#D4D4D4';
const DEFAULT_CHECKED_COLOR = COURIER_DEFAULT_PRIMARY_COLOR;

/**
 * Themeable radio indicator (visual only; no native input).
 *
 * Renders a 16x16 SVG matching the Courier preferences page design with
 * overshoot animation on selection. Toggle via the `checked` property.
 *
 * @public
 */
export class CourierRadio extends CourierBaseElement {
  static get id(): string {
    return 'courier-radio';
  }

  private _checked = false;
  private _ringColor = DEFAULT_RING_COLOR;
  private _checkedColor = DEFAULT_CHECKED_COLOR;

  private _rootEl?: HTMLSpanElement;
  private _ringEl?: SVGCircleElement;
  private _dotEl?: SVGCircleElement;
  private _mounted = false;

  set checked(val: boolean) {
    this._checked = val;
    this._applyState();
  }

  get checked(): boolean {
    return this._checked;
  }

  set ringColor(val: string) {
    this._ringColor = val || DEFAULT_RING_COLOR;
    this._applyState();
  }

  set checkedColor(val: string) {
    this._checkedColor = val || DEFAULT_CHECKED_COLOR;
    this._applyState();
  }

  protected onComponentMounted(): void {
    injectGlobalStyle(STYLE_ID, STYLES);
    this._build();
    this._mounted = true;
  }

  protected onComponentUnmounted(): void {
    this._mounted = false;
    this._rootEl = undefined;
    this._ringEl = undefined;
    this._dotEl = undefined;
  }

  private _build() {
    this.innerHTML = '';

    const root = document.createElement('span');
    root.className = 'courier-radio';
    root.setAttribute('role', 'radio');

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');

    const ring = document.createElementNS(svgNS, 'circle');
    ring.setAttribute('cx', '8');
    ring.setAttribute('cy', '8');
    ring.setAttribute('r', '7');
    ring.setAttribute('stroke-width', '1.5');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('class', 'courier-radio-ring');
    svg.appendChild(ring);

    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('cx', '8');
    dot.setAttribute('cy', '8');
    dot.setAttribute('r', '4');
    dot.setAttribute('class', 'courier-radio-dot');
    svg.appendChild(dot);

    root.appendChild(svg);
    this.appendChild(root);

    this._rootEl = root;
    this._ringEl = ring;
    this._dotEl = dot;

    this._applyState();
  }

  private _applyState() {
    if (!this._mounted || !this._rootEl || !this._ringEl || !this._dotEl) return;
    this._rootEl.setAttribute('aria-checked', String(this._checked));
    this._ringEl.setAttribute('stroke', this._checked ? this._checkedColor : this._ringColor);
    this._dotEl.setAttribute('fill', this._checkedColor);
  }
}

registerElement(CourierRadio);
