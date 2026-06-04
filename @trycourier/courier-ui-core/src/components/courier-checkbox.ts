import { CourierBaseElement } from './courier-base-element';
import { registerElement, injectGlobalStyle } from '../utils/registeration';
import { isDarkColor, COURIER_DEFAULT_PRIMARY_COLOR } from '../utils/courier-colors';

const STYLE_ID = 'courier-checkbox';

const STYLES = `
  courier-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    line-height: 0;
  }
  .courier-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border-style: solid;
    border-width: 1.5px;
    background-color: transparent;
    box-sizing: border-box;
    transition: background-color 150ms ease, border-color 150ms ease;
  }
  .courier-checkbox[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .courier-checkbox-mark {
    display: block;
    width: 10px;
    height: 10px;
    opacity: 0;
    transform: scale(0.5);
    transform-origin: center;
    transform-box: fill-box;
    transition:
      opacity 200ms cubic-bezier(0.2, 0, 0.13, 1.5),
      transform 200ms cubic-bezier(0.2, 0, 0.13, 1.5);
  }
  .courier-checkbox[aria-checked="true"] .courier-checkbox-mark {
    opacity: 1;
    transform: scale(1);
  }
`;

const CHECK_PATH = 'M13.8125 3.3125C14.2188 3.6875 14.2188 4.34375 13.8125 4.71875L5.8125 12.7188C5.4375 13.125 4.78125 13.125 4.40625 12.7188L0.40625 8.71875C0 8.34375 0 7.6875 0.40625 7.3125C0.78125 6.90625 1.4375 6.90625 1.8125 7.3125L5.125 10.5938L12.4062 3.3125C12.7812 2.90625 13.4375 2.90625 13.8125 3.3125Z';

const DEFAULT_BORDER_COLOR = '#D4D4D4';
const DEFAULT_CHECKED_COLOR = COURIER_DEFAULT_PRIMARY_COLOR;
const DEFAULT_CHECKMARK_COLOR = '#FFFFFF';

/**
 * Themeable checkbox indicator (visual only; no native input).
 *
 * Renders a 16x16 box with an animated checkmark matching the Courier
 * preferences page design. Toggle via the `checked` property.
 *
 * @public
 */
export class CourierCheckbox extends CourierBaseElement {
  static get id(): string {
    return 'courier-checkbox';
  }

  private _checked = false;
  private _disabled = false;
  private _checkedColor = DEFAULT_CHECKED_COLOR;

  private _rootEl?: HTMLSpanElement;
  private _markPathEl?: SVGPathElement;
  private _mounted = false;

  set checked(val: boolean) {
    this._checked = val;
    this._applyState();
  }

  get checked(): boolean {
    return this._checked;
  }

  set disabled(val: boolean) {
    this._disabled = val;
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
    this._markPathEl = undefined;
  }

  private _build() {
    this.innerHTML = '';

    const root = document.createElement('span');
    root.className = 'courier-checkbox';
    root.setAttribute('role', 'checkbox');

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'courier-checkbox-mark');
    svg.setAttribute('viewBox', '0 0 15 16');
    svg.setAttribute('fill', 'none');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', CHECK_PATH);
    svg.appendChild(path);
    root.appendChild(svg);
    this.appendChild(root);

    this._rootEl = root;
    this._markPathEl = path;

    this._applyState();
  }

  private _applyState() {
    if (!this._mounted || !this._rootEl || !this._markPathEl) return;
    this._rootEl.setAttribute('aria-checked', String(this._checked));
    this._rootEl.setAttribute('aria-disabled', String(this._disabled));
    this._rootEl.style.borderColor = this._checked ? this._checkedColor : DEFAULT_BORDER_COLOR;
    this._rootEl.style.backgroundColor = this._checked ? this._checkedColor : 'transparent';
    this._markPathEl.setAttribute('fill', isDarkColor(this._checkedColor) ? DEFAULT_CHECKMARK_COLOR : '#171717');
  }
}

registerElement(CourierCheckbox);
