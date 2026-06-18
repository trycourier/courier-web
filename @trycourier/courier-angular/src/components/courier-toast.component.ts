import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import {
  CourierToast as CourierToastElement,
  type CourierToastDismissButtonOption,
  type CourierToastItemActionClickEvent,
  type CourierToastItemClickEvent,
  type CourierToastItemFactoryProps,
  type CourierToastTheme,
} from "@trycourier/courier-ui-toast";
import type { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { setAttr, setBoolAttr, setJsonAttr } from "../utils/attributes";
import { templateToHTMLElement } from "../utils/render-factory";

/**
 * CourierToast Angular component — renders incoming inbox messages as transient
 * toast notifications. The host element IS the `<courier-toast>` custom element.
 */
@Component({
  selector: "courier-toast",
  standalone: true,
  template: "<ng-content></ng-content>",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierToastComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly el = inject(ElementRef).nativeElement as CourierToastElement;
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly views: EmbeddedViewRef<unknown>[] = [];
  private ready = false;

  /** Theme object for light mode. */
  @Input() lightTheme?: CourierToastTheme;
  /** Theme object for dark mode. */
  @Input() darkTheme?: CourierToastTheme;
  /** Theme mode: "light", "dark", or "system". Defaults to "system". */
  @Input() mode?: CourierComponentThemeMode;
  /** Enable toasts to auto-dismiss, including a timer bar. Defaults to false. */
  @Input() autoDismiss?: boolean;
  /** Timeout before a toast auto-dismisses, when `autoDismiss` is enabled. Defaults to 5000ms. */
  @Input() autoDismissTimeoutMs?: number;
  /** Dismiss button visibility. Defaults to "auto". */
  @Input() dismissButton?: CourierToastDismissButtonOption;

  /** Emits when a toast item is clicked. */
  @Output() toastItemClick = new EventEmitter<CourierToastItemClickEvent>();
  /** Emits when a toast item action button is clicked. */
  @Output() toastItemActionClick = new EventEmitter<CourierToastItemActionClickEvent>();
  /** Emits once the component has registered its handlers and render templates. */
  @Output() ready$ = new EventEmitter<boolean>();

  /** `<ng-template #toastItem>` rendered as an entire toast item. */
  @ContentChild("toastItem", { read: TemplateRef }) toastItemTpl?: TemplateRef<unknown>;
  /** `<ng-template #toastItemContent>` rendered as the toast item's content. */
  @ContentChild("toastItemContent", { read: TemplateRef }) toastItemContentTpl?: TemplateRef<unknown>;

  ngAfterViewInit(): void {
    this.ready = true;
    queueMicrotask(() => {
      this.syncAttributes();

      this.el.onToastItemClick((props) => this.toastItemClick.emit(props));
      this.el.onToastItemActionClick((props) => this.toastItemActionClick.emit(props));

      if (this.toastItemTpl) {
        this.el.setToastItem((props: CourierToastItemFactoryProps) => this.renderTemplate(this.toastItemTpl!, props));
      }
      if (this.toastItemContentTpl) {
        this.el.setToastItemContent((props: CourierToastItemFactoryProps) =>
          this.renderTemplate(this.toastItemContentTpl!, props)
        );
      }

      this.ready$.emit(true);
    });
  }

  ngOnChanges(): void {
    if (this.ready) {
      this.syncAttributes();
    }
  }

  private syncAttributes(): void {
    setJsonAttr(this.el, "light-theme", this.lightTheme);
    setJsonAttr(this.el, "dark-theme", this.darkTheme);
    setAttr(this.el, "mode", this.mode);
    setBoolAttr(this.el, "auto-dismiss", this.autoDismiss);
    setAttr(this.el, "auto-dismiss-timeout-ms", this.autoDismissTimeoutMs == null ? undefined : String(this.autoDismissTimeoutMs));
    setAttr(this.el, "dismiss-button", this.dismissButton);
  }

  private renderTemplate<P>(tpl: TemplateRef<unknown>, props: P): HTMLElement {
    const { element, view } = templateToHTMLElement(this.viewContainerRef, tpl, { $implicit: props, props });
    this.views.push(view);
    return element;
  }

  ngOnDestroy(): void {
    this.views.forEach((view) => view.destroy());
  }
}
