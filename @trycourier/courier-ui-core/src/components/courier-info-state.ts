import { CourierElement } from "./courier-element";
import { CourierButton, CourierButtonProps, CourierButtonVariants } from "./courier-button";
import { SystemThemeMode } from "../utils/system-theme-mode";

export type CourierInfoStateProps = {
  title?: {
    text?: string,
    textColor?: string,
    fontSize?: string,
    fontWeight?: string,
    fontFamily?: string
  };
  button: CourierButtonProps;
};

export class CourierInfoState extends CourierElement {

  // Props
  private _props: CourierInfoStateProps;

  // Components
  private _title?: HTMLElement;
  private _button?: CourierButton;
  private _style?: HTMLStyleElement;

  // Callbacks
  private _buttonClickCallback: (() => void) | null = null;

  constructor(props: CourierInfoStateProps) {
    super();
    this._props = props;
  }

  defaultElement(): HTMLElement {
    const container = document.createElement('div');

    // Title
    this._title = document.createElement('h2');
    if (this._props.title?.text) {
      this._title.textContent = this._props.title.text;
    }

    // Button
    this._button = new CourierButton(this._props.button ?? CourierButtonVariants.secondary(this.currentSystemTheme));

    this._style = document.createElement('style');
    this._style.textContent = this.getStyles(this._props);

    container.className = 'container';
    container.appendChild(this._style);
    container.appendChild(this._title);
    container.appendChild(this._button);
    this.shadow.appendChild(container);

    this._button?.addEventListener('click', () => {
      if (this._buttonClickCallback) {
        this._buttonClickCallback();
      }
    });

    return container;
  }

  protected onSystemThemeChange(_: SystemThemeMode) {
    this.updateStyles(this._props);
  }

  private getStyles(props: CourierInfoStateProps): string {

    return `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        text-align: center;
        padding: 24px;
      }

      .container h2 {
        margin: 0;
        color: ${props.title?.textColor ?? 'red'};
        font-size: ${props.title?.fontSize ?? '16px'};
        font-weight: ${props.title?.fontWeight ?? '500'};
        font-family: ${props.title?.fontFamily ?? 'inherit'};
      }
    `;
  }

  public updateStyles(props: CourierInfoStateProps) {
    this._props = props;
    if (this._style) {
      this._style.textContent = this.getStyles(props);
    }
    if (this._button) {
      this._button.updateButton(props.button);
    }
  }

  public setButtonClickCallback(callback: () => void) {
    this._buttonClickCallback = callback;
  }

}
