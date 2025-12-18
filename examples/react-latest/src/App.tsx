import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Default from './Default';
import PopupMenu from './PopupMenu';
import Canvas from './Canvas';
import InboxActions from './InboxActions';
import CustomHeight from './CustomHeight';
import Themes from './Themes';
import Alignment from './Alignment';
import CustomListItems from './CustomListItems';
import CustomHeader from './CustomHeader';
import ElementRef from './ElementRef';
import CustomMenuButton from './CustomMenuButton';
import CustomOther from './CustomOther';
import MarkdownListItemInbox from './MarkdownListItem';
import DatastoreListener from './DatastoreListener';
import Toast from './Toast';
import Hooks from './Hooks';
import CustomFeeds from './CustomFeeds';
import Examples from './Examples';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Inbox default */}
        <Route path="/" element={<Default />} />
        <Route path="/inbox" element={<Default />} />

        {/* Index of examples */}
        <Route path="/examples" element={<Examples />} />

        {/* Default / popup menu examples */}
        <Route path="/inbox-popup-menu" element={<PopupMenu />} />
        <Route path="/popup-menu" element={<PopupMenu />} />

        {/* Custom feeds & combinations */}
        <Route path="/inbox-custom-feed" element={<CustomFeeds />} />
        <Route path="/inbox-popup-menu-custom-feed" element={<CustomFeeds />} />
        <Route path="/custom-feeds" element={<CustomFeeds />} />

        {/* Themed / layout examples */}
        <Route path="/inbox-custom-height" element={<CustomHeight />} />
        <Route path="/custom-height" element={<CustomHeight />} />
        <Route path="/inbox-theme" element={<Themes />} />
        <Route path="/themes" element={<Themes />} />

        {/* Alignment & positioning */}
        <Route path="/actions" element={<InboxActions />} />
        <Route path="/alignment" element={<Alignment />} />

        {/* Custom renderers */}
        <Route path="/inbox-list-item" element={<CustomListItems />} />
        <Route path="/custom-list-items" element={<CustomListItems />} />
        <Route path="/inbox-header" element={<CustomHeader />} />
        <Route path="/custom-header" element={<CustomHeader />} />

        {/* Element ref / advanced */}
        <Route path="/element-ref" element={<ElementRef />} />

        {/* Popup menu customization */}
        <Route path="/inbox-popup-menu-button" element={<CustomMenuButton />} />
        <Route path="/custom-menu-button" element={<CustomMenuButton />} />
        <Route path="/inbox-popup-list-item" element={<CustomOther />} />
        <Route path="/inbox-popup-everything-else" element={<CustomOther />} />
        <Route path="/custom-other" element={<CustomOther />} />

        {/* Advanced canvas demo */}
        <Route path="/canvas" element={<Canvas />} />

        {/* Content / markdown examples */}
        <Route path="/markdown" element={<MarkdownListItemInbox />} />

        {/* Data / datastore examples */}
        <Route path="/datastore-listener" element={<DatastoreListener />} />

        {/* Toast & hooks */}
        <Route path="/toast" element={<Toast />} />
        <Route path="/hooks" element={<Hooks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
