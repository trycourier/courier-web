import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import InboxDefault from './InboxDefault';
import InboxPopupMenuDefault from './InboxPopupMenuDefault';
import InboxActions from './InboxActions';
import InboxStyles from './InboxStyles';
import CustomHeight from './CustomHeight';
import InboxTheme from './InboxTheme';
import PopupMenuTheme from './PopupMenuTheme';
import Alignment from './Alignment';
import CustomListItems from './CustomListItems';
import CustomHeader from './CustomHeader';
import ElementRef from './ElementRef';
import CustomMenuButton from './CustomMenuButton';
import CustomOther from './CustomOther';
import PopupCustomListItem from './PopupCustomListItem';
import MarkdownListItemInbox from './MarkdownListItem';
import ToastBasic from './ToastBasic';
import ToastThemed from './ToastThemed';
import ToastCustom from './ToastCustom';
import ToastAutoDismiss from './ToastAutoDismiss';
import Hooks from './Hooks';
import InboxCustomFeed from './InboxCustomFeed';
import InboxCustomTabs from './InboxCustomTabs';
import PhotoShootInbox from './PhotoShootInbox';
import PhotoShootPopup from './PhotoShootPopup';
import PhotoShootSplit from './PhotoShootSplit';
import PhotoShootDelivered from './PhotoShootDelivered';
import PhotoShootTheme from './PhotoShootTheme';
import PhotoShootCustomRender from './PhotoShootCustomRender';
import PhotoShootToast from './PhotoShootToast';
import PhotoShootToastTheme from './PhotoShootToastTheme';
import PhotoShootPreferences from './PhotoShootPreferences';
import PhotoShootPreferencesTheme from './PhotoShootPreferencesTheme';
import PopupCustomFeed from './PopupCustomFeed';
import PreferencesDefault from './PreferencesDefault';
import PreferencesStyled from './PreferencesStyled';
import Examples from './Examples';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root index (matches next-latest pattern) */}
        <Route path="/" element={<Home />} />
        <Route path="/examples" element={<Examples />} />

        {/* Photo shoot — 788x444 screenshot stages */}
        <Route path="/examples/photo-shoot/inbox" element={<PhotoShootInbox />} />
        <Route path="/examples/photo-shoot/popup" element={<PhotoShootPopup />} />
        <Route path="/examples/photo-shoot/split" element={<PhotoShootSplit />} />
        <Route path="/examples/photo-shoot/delivered" element={<PhotoShootDelivered />} />
        <Route path="/examples/photo-shoot/theme" element={<PhotoShootTheme />} />
        <Route path="/examples/photo-shoot/custom-render" element={<PhotoShootCustomRender />} />
        <Route path="/examples/photo-shoot/toast" element={<PhotoShootToast />} />
        <Route path="/examples/photo-shoot/toast-theme" element={<PhotoShootToastTheme />} />
        <Route path="/examples/photo-shoot/preferences" element={<PhotoShootPreferences />} />
        <Route path="/examples/photo-shoot/preferences-theme" element={<PhotoShootPreferencesTheme />} />

        {/* Inbox default */}
        <Route path="/examples/inbox" element={<InboxDefault />} />

        {/* Default / popup menu examples */}
        <Route path="/examples/inbox-popup-menu" element={<InboxPopupMenuDefault />} />

        {/* Custom feeds & combinations */}
        <Route path="/examples/inbox-custom-feed" element={<InboxCustomFeed />} />
        <Route path="/examples/inbox-custom-tabs" element={<InboxCustomTabs />} />
        <Route path="/examples/inbox-popup-menu-custom-feed" element={<PopupCustomFeed />} />

        {/* Themed / layout examples */}
        <Route path="/examples/inbox-custom-height" element={<CustomHeight />} />
        <Route path="/examples/inbox-theme" element={<InboxTheme />} />
        <Route path="/examples/inbox-popup-menu-theme" element={<PopupMenuTheme />} />

        {/* Alignment & positioning */}
        <Route path="/examples/inbox-actions" element={<InboxActions />} />
        <Route path="/examples/inbox-styles" element={<InboxStyles />} />
        <Route path="/examples/alignment" element={<Alignment />} />

        {/* Custom renderers */}
        <Route path="/examples/inbox-list-item" element={<CustomListItems />} />
        <Route path="/examples/inbox-header" element={<CustomHeader />} />

        {/* Element ref / advanced */}
        <Route path="/examples/element-ref" element={<ElementRef />} />

        {/* Popup menu customization */}
        <Route path="/examples/inbox-popup-menu-button" element={<CustomMenuButton />} />
        <Route path="/examples/inbox-popup-list-item" element={<PopupCustomListItem />} />
        <Route path="/examples/inbox-popup-everything-else" element={<CustomOther />} />

        {/* Content / markdown examples */}
        <Route path="/examples/markdown" element={<MarkdownListItemInbox />} />

        {/* Toast & hooks */}
        <Route path="/examples/toast-basic" element={<ToastBasic />} />
        <Route path="/examples/toast-themed" element={<ToastThemed />} />
        <Route path="/examples/toast-custom" element={<ToastCustom />} />
        <Route path="/examples/toast-auto-dismiss" element={<ToastAutoDismiss />} />
        <Route path="/examples/toast" element={<ToastCustom />} />
        <Route path="/examples/hooks" element={<Hooks />} />

        {/* Preferences */}
        <Route path="/examples/preferences" element={<PreferencesDefault />} />
        <Route path="/examples/preferences-styled" element={<PreferencesStyled />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
