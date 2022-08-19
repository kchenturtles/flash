import logo from './logo.svg';
import './App.css';
import {Homepage} from './Homepage';
import {BrowserRouter, Routes, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
          <Route path = "*" element = {<Homepage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
