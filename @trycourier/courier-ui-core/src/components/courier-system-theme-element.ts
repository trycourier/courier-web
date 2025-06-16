import { addSystemThemeModeListener, getSystemThemeMode, SystemThemeMode } from "../utils/system-theme-mode";
import { CourierBaseElement } from "./courier-base-element";

export class CourierSystemThemeElement extends CourierBaseElement {

  static get id(): string {
    return 'courier-system-theme-element';
  }

  // State
  private _currentSystemTheme: SystemThemeMode;
  public get currentSystemTheme() {
    return this._currentSystemTheme;
  }

  // System theme
  private _systemThemeCleanup: (() => void) | undefined;

  constructor() {
    super();

    // Get the initial system theme
    this._currentSystemTheme = getSystemThemeMode();

    // Set up the system theme listener
    this._systemThemeCleanup = addSystemThemeModeListener(mode => {
      this._currentSystemTheme = mode;
      this.onSystemThemeChange(mode);
    });
  }

  disconnectedCallback() {
    if (this._systemThemeCleanup) {
      this._systemThemeCleanup();
    }
  }

  protected onSystemThemeChange(_: SystemThemeMode): void {
    // Default implementation does nothing
  }

}