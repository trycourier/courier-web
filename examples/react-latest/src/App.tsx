import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InboxDefault from './InboxDefault';
import InboxPopupMenuDefault from './InboxPopupMenuDefault';
import InboxActions from './InboxActions';
import CustomHeight from './CustomHeight';
import InboxTheme from './InboxTheme';
import PopupMenuTheme from './PopupMenuTheme';
import Alignment from './Alignment';
import CustomListItems from './CustomListItems';
import CustomHeader from './CustomHeader';
import ElementRef from './ElementRef';
import CustomMenuButton from './CustomMenuButton';
import CustomOther from './CustomOther';
import MarkdownListItemInbox from './MarkdownListItem';
import ToastBasic from './ToastBasic';
import ToastThemed from './ToastThemed';
import ToastCustom from './ToastCustom';
import Hooks from './Hooks';
import InboxCustomFeed from './InboxCustomFeed';
import InboxCustomTabs from './InboxCustomTabs';
import PopupCustomFeed from './PopupCustomFeed';
import Examples from './Examples';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root index of examples (matches Web JS index layout) */}
        <Route path="/" element={<Examples />} />
        <Route path="/examples" element={<Examples />} />

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
        <Route path="/examples/alignment" element={<Alignment />} />

        {/* Custom renderers */}
        <Route path="/examples/inbox-list-item" element={<CustomListItems />} />
        <Route path="/examples/inbox-header" element={<CustomHeader />} />

        {/* Element ref / advanced */}
        <Route path="/examples/element-ref" element={<ElementRef />} />

        {/* Popup menu customization */}
        <Route path="/examples/inbox-popup-menu-button" element={<CustomMenuButton />} />
        <Route path="/examples/inbox-popup-list-item" element={<CustomOther />} />
        <Route path="/examples/inbox-popup-everything-else" element={<CustomOther />} />

        {/* Content / markdown examples */}
        <Route path="/examples/markdown" element={<MarkdownListItemInbox />} />

        {/* Toast & hooks */}
        <Route path="/examples/toast-basic" element={<ToastBasic />} />
        <Route path="/examples/toast-themed" element={<ToastThemed />} />
        <Route path="/examples/toast-custom" element={<ToastCustom />} />
        <Route path="/examples/toast" element={<ToastCustom />} />
        <Route path="/examples/hooks" element={<Hooks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
