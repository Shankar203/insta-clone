import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import logo from './logo.svg';
import './App.css';

import Navbar from "./components/Navbar";
import Login from './components/Login';
import NewPost from './components/NewPost';

function App() {
  return (
    <Router>
      <div className="App bg-light">
        <Navbar />
        <NewPost />
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button type="button" class="btn btn-primary">Primary</button>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </Router>
  );
}

export default App;
