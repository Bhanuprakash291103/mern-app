
import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Signup from './pages/Signup';
import Home from './pages/Home';
import Login from './pages/Login';
import NoteDetails from './pages/NoteDetails';
import AddNote from './pages/AddNote';
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path="/notes/:id" element={<NoteDetails />} />
        <Route path="/add-note" element={<AddNote />} />
      </Routes>
    </Router>
  );
}

export default App;
