import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Default from './Default';
import PopupMenu from './PopupMenu';
import Canvas from './Canvas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Default />} />
        <Route path="/popup-menu" element={<PopupMenu />} />
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
