import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import {
  CourierPreferences as CourierPreferencesElement,
  type CourierPreferencesTheme,
} from "@trycourier/courier-ui-preferences";
import type { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { setAttr, setJsonAttr } from "../utils/attributes";

/**
 * CourierPreferences Angular component — renders the user's notification
 * preferences. The host element IS the `<courier-preferences>` custom element.
 */
@Component({
  selector: "courier-preferences",
  standalone: true,
  template: "<ng-content></ng-content>",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierPreferencesComponent implements AfterViewInit, OnChanges {
  private readonly el = inject(ElementRef).nativeElement as CourierPreferencesElement;
  private ready = false;

  /** Theme object for light mode. */
  @Input() lightTheme?: CourierPreferencesTheme;
  /** Theme object for dark mode. */
  @Input() darkTheme?: CourierPreferencesTheme;
  /** Theme mode: "light", "dark", or "system". Defaults to "system". */
  @Input() mode?: CourierComponentThemeMode;
  /** Title displayed above the preferences. */
  @Input() title?: string;
  /** Subtitle displayed below the title. */
  @Input() subtitle?: string;
  /** Brand id used to theme the preferences. */
  @Input() brandId?: string;
  /**
   * Scope preferences to a specific tenant/account. Overrides the tenant set at
   * `signIn` for this component only. Falls back to the client's `tenantId`.
   */
  @Input() tenantId?: string;
  /** Map of channel keys to display labels. */
  @Input() channelLabels?: Record<string, string>;

  /** Emits when the component encounters an error. */
  @Output() error = new EventEmitter<Error>();

  ngAfterViewInit(): void {
    this.ready = true;
    queueMicrotask(() => this.syncAttributes());
  }

  ngOnChanges(): void {
    if (this.ready) {
      this.syncAttributes();
    }
  }

  private syncAttributes(): void {
    setJsonAttr(this.el, "light-theme", this.lightTheme);
    setJsonAttr(this.el, "dark-theme", this.darkTheme);
    setAttr(this.el, "title", this.title);
    setAttr(this.el, "subtitle", this.subtitle);
    setAttr(this.el, "brand-id", this.brandId);
    setAttr(this.el, "tenant-id", this.tenantId);

    if (this.channelLabels) {
      this.el.setChannelLabels(this.channelLabels);
    }

    // When themes change, the web component's setDarkTheme/setLightTheme only
    // calls updateTheme() when _systemMode matches — it ignores an explicit
    // _userMode override. Re-calling setMode() always triggers updateTheme(),
    // picking up the new theme values.
    if (this.mode) {
      this.el.setMode(this.mode);
    } else {
      setAttr(this.el, "mode", this.mode);
    }
  }
}
