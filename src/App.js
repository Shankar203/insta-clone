import logo from './logo.svg';
import './App.css';

import Navbar from "./Navbar";
import Login from './components/Login';

function App() {
  return (
    <div style={{background: "rgb(245, 245, 255)"}} className="App">
      {/* <Navbar/> */}
      <Login/>
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
  );
}

export default App;
