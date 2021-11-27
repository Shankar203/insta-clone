import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../firebase/auth";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = function(e) {
		e.preventDefault();
		const user = { email, password };
		const userCred = signUp(user);
		console.log(userCred.user, 'done');
	}

	return (
		<div style={{ maxWidth: "400px" }} className="card my-5 mx-auto">
			<img
				width="175px"
				className="mx-auto py-5"
				src="https://uxwing.com/wp-content/themes/uxwing/download/10-brands-and-social-media/instagram-text.svg"
			/>
			<form className="mx-4 card-body" onSubmit={handleSubmit}>
				<div className="d-grid">
					<button type="link" className="btn btn-primary btn-sm">
						<i className="bi bi-facebook" /> Continue with Facebook
					</button>
				</div>
				<div className="my-3 row justify-content-around">
					<hr className="col-4 mt-3" /> or <hr className="col-4 mt-3" />
				</div>
				<input
					type="email"
					className="form-control"
					id="email"
					placeholder="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					className="form-control my-2"
					id="password"
					minLength={6}
					placeholder="password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<div className="text-end my-2">
					<Link to="/fwtpsd" className="link-primary text-decoration-none">
						<span>Forgot password?</span>
					</Link>
				</div>
				<div className="d-grid">
					<button type="submit" className="btn btn-primary">Log In</button>
				</div>
				<div className="mt-4 text-center text-muted">
					<span>
						Don't have an account?
						<Link to="/signup" className="link-primary text-decoration-none"> Sign Up</Link>
					</span>
				</div>
			</form>
		</div>
	);
};

export default Login;
