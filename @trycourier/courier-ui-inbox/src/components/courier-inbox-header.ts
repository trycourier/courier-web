import { CourierInboxFeedType } from "../types/feed-type";
import { CourierIconSVGs, CourierFactoryElement, registerElement, CourierColors, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { CourierInboxOptionMenu, CourierInboxMenuOption } from "./courier-inbox-option-menu";
import { CourierInboxHeaderTitle } from "./courier-inbox-header-title";
import { CourierInboxHeaderFactoryProps } from "../types/factories";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export type CourierInboxHeaderMenuItemId = CourierInboxFeedType | 'markAllRead' | 'archiveAll' | 'archiveRead';

export class CourierInboxHeader extends CourierFactoryElement {

  static get id(): string {
    return 'courier-inbox-header';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _feedType: CourierInboxFeedType = 'inbox';
  private _unreadCount: number = 0;

  // Components
  private _titleSection?: CourierInboxHeaderTitle;
  private _filterMenu?: CourierInboxOptionMenu;
  private _actionMenu?: CourierInboxOptionMenu;
  private _style?: HTMLStyleElement;

  // Callbacks
  private _onFeedTypeChange: (feedType: CourierInboxFeedType) => void;

  static get observedAttributes() {
    return ['icon', 'title', 'feed-type'];
  }

  private get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(props: { themeManager: CourierInboxThemeManager, onFeedTypeChange: (feedType: CourierInboxFeedType) => void }) {
    super();

    // Subscribe to the theme bus
    this._themeSubscription = props.themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Set the on feed type change callback
    this._onFeedTypeChange = props.onFeedTypeChange;
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxHeader.id, CourierInboxHeader.getStyles(this.theme));
  }

  onComponentUmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  private getFilterOptions(): CourierInboxMenuOption[] {
    const theme = this._themeSubscription.manager.getTheme();
    const filterMenu = theme.inbox?.header?.menus?.filters;

    return [
      {
        id: 'inbox',
        text: filterMenu?.inbox?.text ?? 'Inbox',
        icon: {
          color: filterMenu?.inbox?.icon?.color ?? 'red',
          svg: filterMenu?.inbox?.icon?.svg ?? CourierIconSVGs.inbox
        },
        selectionIcon: {
          color: theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.color ?? 'red',
          svg: theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.svg ?? CourierIconSVGs.check
        },
        onClick: (option: CourierInboxMenuOption) => {
          this.handleOptionMenuItemClick('inbox', option);
        }
      },
      {
        id: 'archive',
        text: filterMenu?.archive?.text ?? 'Archive',
        icon: {
          color: filterMenu?.archive?.icon?.color ?? 'red',
          svg: filterMenu?.archive?.icon?.svg ?? CourierIconSVGs.archive
        },
        selectionIcon: {
          color: theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.color ?? 'red',
          svg: theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.svg ?? CourierIconSVGs.check
        },
        onClick: (option: CourierInboxMenuOption) => {
          this.handleOptionMenuItemClick('archive', option);
        }
      }
    ];
  }

  private getActionOptions(): CourierInboxMenuOption[] {
    const theme = this._themeSubscription.manager.getTheme();
    const actionMenu = theme.inbox?.header?.menus?.actions;

    return [
      {
        id: 'markAllRead',
        text: actionMenu?.markAllRead?.text ?? 'Mark All as Read',
        icon: {
          color: actionMenu?.markAllRead?.icon?.color ?? 'red',
          svg: actionMenu?.markAllRead?.icon?.svg ?? CourierIconSVGs.inbox
        },
        selectionIcon: null,
        onClick: (_: CourierInboxMenuOption) => {
          CourierInboxDatastore.shared.readAllMessages({ canCallApi: true });
        }
      },
      {
        id: 'archiveAll',
        text: actionMenu?.archiveAll?.text ?? 'Archive All',
        icon: {
          color: actionMenu?.archiveAll?.icon?.color ?? 'red',
          svg: actionMenu?.archiveAll?.icon?.svg ?? CourierIconSVGs.archive
        },
        selectionIcon: null,
        onClick: (_: CourierInboxMenuOption) => {
          CourierInboxDatastore.shared.archiveAllMessages({ canCallApi: true });
        }
      },
      {
        id: 'archiveRead',
        text: actionMenu?.archiveRead?.text ?? 'Archive Read',
        icon: {
          color: actionMenu?.archiveRead?.icon?.color ?? 'red',
          svg: actionMenu?.archiveRead?.icon?.svg ?? CourierIconSVGs.archive
        },
        selectionIcon: null,
        onClick: (_: CourierInboxMenuOption) => {
          CourierInboxDatastore.shared.archiveReadMessages({ canCallApi: true });
        }
      }
    ];
  }

  private refreshTheme() {

    if (this._style) {
      this._style.textContent = CourierInboxHeader.getStyles(this.theme);
    }

    // Update menus
    this._filterMenu?.setOptions(this.getFilterOptions());
    this._actionMenu?.setOptions(this.getActionOptions());
  }

  private handleOptionMenuItemClick(feedType: CourierInboxFeedType, option: CourierInboxMenuOption) {
    this._feedType = feedType;
    if (this._titleSection) {
      this._titleSection.updateSelectedOption(option, this._feedType, this._feedType === 'inbox' ? this._unreadCount : 0);
    }
    this._onFeedTypeChange(feedType);
  }

  public render(props: CourierInboxHeaderFactoryProps): void {
    this._feedType = props.feedType;
    this._unreadCount = props.unreadCount;
    const option = this.getFilterOptions().find(opt => ['inbox', 'archive'].includes(opt.id) && opt.id === this._feedType);
    if (option) {
      this._titleSection?.updateSelectedOption(option, this._feedType, this._feedType === 'inbox' ? this._unreadCount : 0);
      this._filterMenu?.selectOption(option);
    }
  }

  build(newElement: HTMLElement | undefined | null) {
    super.build(newElement);
    this.refreshTheme();
  }

  defaultElement(): HTMLElement {
    const filterOptions = this.getFilterOptions();

    this._titleSection = new CourierInboxHeaderTitle(this._themeSubscription.manager, filterOptions[0]);
    this._filterMenu = new CourierInboxOptionMenu(this._themeSubscription.manager, 'filters', true, filterOptions, () => {
      this._actionMenu?.closeMenu();
    });
    this._actionMenu = new CourierInboxOptionMenu(this._themeSubscription.manager, 'actions', false, this.getActionOptions(), () => {
      this._filterMenu?.closeMenu();
    });

    // Selected default menu
    this._filterMenu.selectOption(filterOptions[0]);

    // Create flexible spacer
    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    // Create and setup actions section
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.appendChild(this._filterMenu);
    actions.appendChild(this._actionMenu);

    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';
    headerContent.appendChild(this._titleSection);
    headerContent.appendChild(spacer);
    headerContent.appendChild(actions);

    return headerContent;
  }

  static getStyles(theme: CourierInboxTheme): string {

    return `
      ${CourierInboxHeader.id} {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      ${CourierInboxHeader.id} .header-content {
        padding: 10px 10px 10px 16px;
        background-color: ${theme.inbox?.header?.backgroundColor ?? CourierColors.white[500]};
        box-shadow: ${theme.inbox?.header?.shadow ?? `0px 1px 0px 0px red`};
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        z-index: 100;
      }

      ${CourierInboxHeader.id} .spacer {
        flex: 1;
      }

      ${CourierInboxHeader.id} .actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    `;
  }

}

registerElement(CourierInboxHeader);
