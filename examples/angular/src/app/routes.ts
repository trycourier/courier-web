import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home.component';
import { ExamplesComponent } from './pages/examples.component';
import { InboxDefaultComponent } from './pages/inbox-default.component';
import { InboxPopupMenuDefaultComponent } from './pages/inbox-popup-menu-default.component';
import { InboxCustomFeedComponent } from './pages/inbox-custom-feed.component';
import { InboxCustomTabsComponent } from './pages/inbox-custom-tabs.component';
import { PopupCustomFeedComponent } from './pages/popup-custom-feed.component';
import { CustomHeightComponent } from './pages/custom-height.component';
import { InboxThemeComponent } from './pages/inbox-theme.component';
import { PopupMenuThemeComponent } from './pages/popup-menu-theme.component';
import { InboxActionsComponent } from './pages/inbox-actions.component';
import { AlignmentComponent } from './pages/alignment.component';
import { CustomListItemsComponent } from './pages/custom-list-items.component';
import { CustomHeaderComponent } from './pages/custom-header.component';
import { ElementRefComponent } from './pages/element-ref.component';
import { CustomMenuButtonComponent } from './pages/custom-menu-button.component';
import { PopupCustomListItemComponent } from './pages/popup-custom-list-item.component';
import { CustomOtherComponent } from './pages/custom-other.component';
import { MarkdownListItemComponent } from './pages/markdown-list-item.component';
import { ToastBasicComponent } from './pages/toast-basic.component';
import { ToastThemedComponent } from './pages/toast-themed.component';
import { ToastCustomComponent } from './pages/toast-custom.component';
import { HooksComponent } from './pages/hooks.component';
import { PreferencesDefaultComponent } from './pages/preferences-default.component';
import { PreferencesStyledComponent } from './pages/preferences-styled.component';

export const routes: Routes = [
  // Root index (matches next-latest pattern)
  { path: '', component: HomeComponent },
  { path: 'examples', component: ExamplesComponent },

  // Inbox default
  { path: 'examples/inbox', component: InboxDefaultComponent },

  // Default / popup menu examples
  { path: 'examples/inbox-popup-menu', component: InboxPopupMenuDefaultComponent },

  // Custom feeds & combinations
  { path: 'examples/inbox-custom-feed', component: InboxCustomFeedComponent },
  { path: 'examples/inbox-custom-tabs', component: InboxCustomTabsComponent },
  { path: 'examples/inbox-popup-menu-custom-feed', component: PopupCustomFeedComponent },

  // Themed / layout examples
  { path: 'examples/inbox-custom-height', component: CustomHeightComponent },
  { path: 'examples/inbox-theme', component: InboxThemeComponent },
  { path: 'examples/inbox-popup-menu-theme', component: PopupMenuThemeComponent },

  // Alignment & positioning
  { path: 'examples/inbox-actions', component: InboxActionsComponent },
  { path: 'examples/alignment', component: AlignmentComponent },

  // Custom renderers
  { path: 'examples/inbox-list-item', component: CustomListItemsComponent },
  { path: 'examples/inbox-header', component: CustomHeaderComponent },

  // Element ref / advanced
  { path: 'examples/element-ref', component: ElementRefComponent },

  // Popup menu customization
  { path: 'examples/inbox-popup-menu-button', component: CustomMenuButtonComponent },
  { path: 'examples/inbox-popup-list-item', component: PopupCustomListItemComponent },
  { path: 'examples/inbox-popup-everything-else', component: CustomOtherComponent },

  // Content / markdown examples
  { path: 'examples/markdown', component: MarkdownListItemComponent },

  // Toast & hooks
  { path: 'examples/toast-basic', component: ToastBasicComponent },
  { path: 'examples/toast-themed', component: ToastThemedComponent },
  { path: 'examples/toast-custom', component: ToastCustomComponent },
  { path: 'examples/toast', component: ToastCustomComponent },
  { path: 'examples/hooks', component: HooksComponent },

  // Preferences
  { path: 'examples/preferences', component: PreferencesDefaultComponent },
  { path: 'examples/preferences-styled', component: PreferencesStyledComponent },
];
