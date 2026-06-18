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
  CourierInboxPopupMenu as CourierInboxPopupMenuElement,
  type CourierInboxFeed,
  type CourierInboxHeaderFactoryProps,
  type CourierInboxListItemActionFactoryProps,
  type CourierInboxListItemFactoryProps,
  type CourierInboxMenuButtonFactoryProps,
  type CourierInboxPaginationItemFactoryProps,
  type CourierInboxPopupAlignment,
  type CourierInboxStateEmptyFactoryProps,
  type CourierInboxStateErrorFactoryProps,
  type CourierInboxStateLoadingFactoryProps,
  type CourierInboxTheme,
} from "@trycourier/courier-ui-inbox";
import type { CourierComponentThemeMode } from "@trycourier/courier-ui-core";
import { setAttr, setJsonAttr } from "../utils/attributes";
import { templateToHTMLElement } from "../utils/render-factory";

/**
 * CourierInboxPopupMenu Angular component — renders the inbox as a popup menu
 * anchored to a toggle button. The host element IS the
 * `<courier-inbox-popup-menu>` custom element.
 */
@Component({
  selector: "courier-inbox-popup-menu",
  standalone: true,
  template: "<ng-content></ng-content>",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierInboxPopupMenuComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly el = inject(ElementRef).nativeElement as CourierInboxPopupMenuElement;
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly views: EmbeddedViewRef<unknown>[] = [];
  private ready = false;

  /** Alignment of the popup menu relative to its anchor. */
  @Input() popupAlignment?: CourierInboxPopupAlignment;
  /** Width of the popup menu container. */
  @Input() popupWidth?: string;
  /** Height of the popup menu container. */
  @Input() popupHeight?: string;
  /** CSS left position for the popup menu. */
  @Input() left?: string;
  /** CSS top position for the popup menu. */
  @Input() top?: string;
  /** CSS right position for the popup menu. */
  @Input() right?: string;
  /** CSS bottom position for the popup menu. */
  @Input() bottom?: string;
  /** Theme object for light mode. */
  @Input() lightTheme?: CourierInboxTheme;
  /** Theme object for dark mode. */
  @Input() darkTheme?: CourierInboxTheme;
  /** Theme mode: "light", "dark", or "system". */
  @Input() mode?: CourierComponentThemeMode;
  /** Array of feeds to display in the inbox. */
  @Input() feeds?: CourierInboxFeed[];

  /** Emits when a message is clicked. */
  @Output() messageClick = new EventEmitter<CourierInboxListItemFactoryProps>();
  /** Emits when a message action (e.g., button) is clicked. */
  @Output() messageActionClick = new EventEmitter<CourierInboxListItemActionFactoryProps>();
  /** Emits when a message is long-pressed. */
  @Output() messageLongPress = new EventEmitter<CourierInboxListItemFactoryProps>();

  /** `<ng-template #header>` rendered as a custom header. */
  @ContentChild("header", { read: TemplateRef }) headerTpl?: TemplateRef<unknown>;
  /** `<ng-template #listItem>` rendered as a custom list item. */
  @ContentChild("listItem", { read: TemplateRef }) listItemTpl?: TemplateRef<unknown>;
  /** `<ng-template #emptyState>` rendered as a custom empty state. */
  @ContentChild("emptyState", { read: TemplateRef }) emptyStateTpl?: TemplateRef<unknown>;
  /** `<ng-template #loadingState>` rendered as a custom loading state. */
  @ContentChild("loadingState", { read: TemplateRef }) loadingStateTpl?: TemplateRef<unknown>;
  /** `<ng-template #errorState>` rendered as a custom error state. */
  @ContentChild("errorState", { read: TemplateRef }) errorStateTpl?: TemplateRef<unknown>;
  /** `<ng-template #paginationItem>` rendered as a custom pagination list item. */
  @ContentChild("paginationItem", { read: TemplateRef }) paginationItemTpl?: TemplateRef<unknown>;
  /** `<ng-template #menuButton>` rendered as the menu toggle button. */
  @ContentChild("menuButton", { read: TemplateRef }) menuButtonTpl?: TemplateRef<unknown>;

  ngAfterViewInit(): void {
    this.ready = true;
    queueMicrotask(() => {
      this.syncAttributes();

      this.el.onMessageClick((props) => this.messageClick.emit(props));
      this.el.onMessageActionClick((props) => this.messageActionClick.emit(props));
      this.el.onMessageLongPress((props) => this.messageLongPress.emit(props));

      if (this.headerTpl) {
        this.el.setHeader((props: CourierInboxHeaderFactoryProps | undefined | null) =>
          this.renderTemplate(this.headerTpl!, props)
        );
      }
      if (this.listItemTpl) {
        this.el.setListItem((props: CourierInboxListItemFactoryProps | undefined | null) =>
          this.renderTemplate(this.listItemTpl!, props)
        );
      }
      if (this.emptyStateTpl) {
        this.el.setEmptyState((props: CourierInboxStateEmptyFactoryProps | undefined | null) =>
          this.renderTemplate(this.emptyStateTpl!, props)
        );
      }
      if (this.loadingStateTpl) {
        this.el.setLoadingState((props: CourierInboxStateLoadingFactoryProps | undefined | null) =>
          this.renderTemplate(this.loadingStateTpl!, props)
        );
      }
      if (this.errorStateTpl) {
        this.el.setErrorState((props: CourierInboxStateErrorFactoryProps | undefined | null) =>
          this.renderTemplate(this.errorStateTpl!, props)
        );
      }
      if (this.paginationItemTpl) {
        this.el.setPaginationItem((props: CourierInboxPaginationItemFactoryProps | undefined | null) =>
          this.renderTemplate(this.paginationItemTpl!, props)
        );
      }
      if (this.menuButtonTpl) {
        this.el.setMenuButton((props: CourierInboxMenuButtonFactoryProps | undefined | null) =>
          this.renderTemplate(this.menuButtonTpl!, props)
        );
      }
    });
  }

  ngOnChanges(): void {
    if (this.ready) {
      this.syncAttributes();
    }
  }

  private syncAttributes(): void {
    setAttr(this.el, "popup-alignment", this.popupAlignment);
    setAttr(this.el, "popup-width", this.popupWidth);
    setAttr(this.el, "popup-height", this.popupHeight);
    setAttr(this.el, "left", this.left);
    setAttr(this.el, "top", this.top);
    setAttr(this.el, "right", this.right);
    setAttr(this.el, "bottom", this.bottom);
    setJsonAttr(this.el, "light-theme", this.lightTheme);
    setJsonAttr(this.el, "dark-theme", this.darkTheme);
    setAttr(this.el, "mode", this.mode);
    setJsonAttr(this.el, "feeds", this.feeds);
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
