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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Default />} />
        <Route path="/popup-menu" element={<PopupMenu />} />
        <Route path="/actions" element={<InboxActions />} />
        <Route path="/custom-height" element={<CustomHeight />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/alignment" element={<Alignment />} />
        <Route path="/custom-list-items" element={<CustomListItems />} />
        <Route path="/custom-header" element={<CustomHeader />} />
        <Route path="/element-ref" element={<ElementRef />} />
        <Route path="/custom-menu-button" element={<CustomMenuButton />} />
        <Route path="/custom-other" element={<CustomOther />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/markdown" element={<MarkdownListItemInbox />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
