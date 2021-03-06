import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import NewPost from "./components/NewPost";
import SignUp from "./components/SignUp";
import Logout from "./components/Logout";
import ForgetPassword from "./components/ForgetPassword";

import PrivateRoute from "./PrivateRoute";
import Post from "./components/Post";
import Home from "./components/Home";
import ThirdPartyAuth from "./components/ThirdPartyAuth";
import EditProfile from "./components/EditProfile";
import ProfilePage from "./components/ProfilePage";
import Chat from "./components/Chat";
import Favourites from "./components/Favourites";

function App() {
	const [currentUser, setCurrentUser] = useState(auth.currentUser);
	onAuthStateChanged(auth, (user) => setCurrentUser(user));
	return (
		<Router>
			<div className="bg-light min-vh-100 text-center">
				<Routes>
					<Route path="/" element={
						<>
							<Navbar currentUser={currentUser} />
							<NewPost currentUser={currentUser} />
							<PrivateRoute />
						</>
					}>
						<Route path="/" element={<Home currentUser={currentUser} />} />
						<Route path="/favourites" element={<Favourites currentUser={currentUser} />} />
						<Route path="/chat" element={<Chat />} />
						<Route path="profile/edit" element={<EditProfile currentUser={currentUser} />} />
						<Route path="p/:postId" element={<Post currentUser={currentUser} />} />
						<Route path=":uid" element={<ProfilePage currentUser={currentUser} />} />
					</Route>
					<Route path="/logout" element={<Logout />} />
					<Route path="/signup/:by" element={<ThirdPartyAuth />} />
					<Route path="/fwtpsd" element={<ForgetPassword />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
