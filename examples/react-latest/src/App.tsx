import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Default from './Default';
import PopupMenu from './PopupMenu';
import Canvas from './Canvas';
import InboxActions from './InboxActions';
import CustomHeight from './CustomHeight';
import Themes from './Themes';
import Alignment from './Alignment';
import CustomListItems from './CustomListItems';

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
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
