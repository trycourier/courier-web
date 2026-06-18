import { createRouter, createWebHistory } from 'vue-router';

import Home from './Home.vue';
import Examples from './Examples.vue';
import InboxDefault from './InboxDefault.vue';
import InboxPopupMenuDefault from './InboxPopupMenuDefault.vue';
import InboxActions from './InboxActions.vue';
import CustomHeight from './CustomHeight.vue';
import InboxTheme from './InboxTheme.vue';
import PopupMenuTheme from './PopupMenuTheme.vue';
import Alignment from './Alignment.vue';
import CustomListItems from './CustomListItems.vue';
import CustomHeader from './CustomHeader.vue';
import ElementRef from './ElementRef.vue';
import CustomMenuButton from './CustomMenuButton.vue';
import CustomOther from './CustomOther.vue';
import PopupCustomListItem from './PopupCustomListItem.vue';
import MarkdownListItem from './MarkdownListItem.vue';
import ToastBasic from './ToastBasic.vue';
import ToastThemed from './ToastThemed.vue';
import ToastCustom from './ToastCustom.vue';
import Hooks from './Hooks.vue';
import InboxCustomFeed from './InboxCustomFeed.vue';
import InboxCustomTabs from './InboxCustomTabs.vue';
import PopupCustomFeed from './PopupCustomFeed.vue';
import PreferencesDefault from './PreferencesDefault.vue';
import PreferencesStyled from './PreferencesStyled.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Root index (matches next-latest pattern)
    { path: '/', component: Home },
    { path: '/examples', component: Examples },

    // Inbox default
    { path: '/examples/inbox', component: InboxDefault },

    // Default / popup menu examples
    { path: '/examples/inbox-popup-menu', component: InboxPopupMenuDefault },

    // Custom feeds & combinations
    { path: '/examples/inbox-custom-feed', component: InboxCustomFeed },
    { path: '/examples/inbox-custom-tabs', component: InboxCustomTabs },
    { path: '/examples/inbox-popup-menu-custom-feed', component: PopupCustomFeed },

    // Themed / layout examples
    { path: '/examples/inbox-custom-height', component: CustomHeight },
    { path: '/examples/inbox-theme', component: InboxTheme },
    { path: '/examples/inbox-popup-menu-theme', component: PopupMenuTheme },

    // Alignment & positioning
    { path: '/examples/inbox-actions', component: InboxActions },
    { path: '/examples/alignment', component: Alignment },

    // Custom renderers
    { path: '/examples/inbox-list-item', component: CustomListItems },
    { path: '/examples/inbox-header', component: CustomHeader },

    // Element ref / advanced
    { path: '/examples/element-ref', component: ElementRef },

    // Popup menu customization
    { path: '/examples/inbox-popup-menu-button', component: CustomMenuButton },
    { path: '/examples/inbox-popup-list-item', component: PopupCustomListItem },
    { path: '/examples/inbox-popup-everything-else', component: CustomOther },

    // Content / markdown examples
    { path: '/examples/markdown', component: MarkdownListItem },

    // Toast & hooks
    { path: '/examples/toast-basic', component: ToastBasic },
    { path: '/examples/toast-themed', component: ToastThemed },
    { path: '/examples/toast-custom', component: ToastCustom },
    { path: '/examples/toast', component: ToastCustom },
    { path: '/examples/hooks', component: Hooks },

    // Preferences
    { path: '/examples/preferences', component: PreferencesDefault },
    { path: '/examples/preferences-styled', component: PreferencesStyled },
  ],
});

export default router;
