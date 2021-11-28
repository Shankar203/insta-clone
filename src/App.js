import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import NewPost from "./components/NewPost";
import SignUp from "./components/SignUp";
import Logout from "./components/Logout";
import ForgetPassword from "./components/ForgetPassword";

import PrivateRoute from "./PrivateRoute";

function App() {
	const currentUser = auth.currentUser;
	return (
		<Router>
			<div className="App bg-light min-vh-100">
				<Navbar />
				<NewPost />
				<Routes>
					<Route path="/logout" element={<Logout />} />
					<Route path="/fwtpsd" element={<ForgetPassword />} />
						<Route path="/signup" element={<SignUp />} />
					<Route path="/" element={<PrivateRoute />}>
					</Route>
						<Route path="/login" element={<Login />} />
				</Routes>
				{/* <header className="App-header">
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
        </header> */}
			</div>
		</Router>
	);
}

export default App;
