import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
	const navigate = useNavigate();
	const emailRef = useRef();
	const passwordRef = useRef();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async function (e) {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			const userCred = await signInWithEmailAndPassword(
				auth,
				emailRef.current.value,
				passwordRef.current.value
			);
			console.log("loggedin as " + userCred.user);
			setSuccess(true);
			navigate("/");
		} catch (err) {
			console.error(err);
			setError(err.message);
			e.target.reset();
			setLoading(false);
		}
	};

	return (
		<div className="h-100 py-5">
			<div style={{ maxWidth: "400px" }} className="card mx-auto">
				<Link to="/">
					<img
						width="175px"
						className="mx-auto my-5"
						src="https://uxwing.com/wp-content/themes/uxwing/download/10-brands-and-social-media/instagram-text.svg"
					/>
				</Link>
				<form className="mx-4 card-body" onSubmit={handleSubmit}>
					<div className="d-grid">
						<Link to="/signup/google" type="link" className="btn btn-primary btn-sm">
							<i className="bi bi-google" /> Continue with Google
						</Link>
					</div>
					<div className="my-3 row justify-content-around">
						<hr className="col-4 mt-3" /> or <hr className="col-4 mt-3" />
					</div>
					{error && <div className="p-2 alert alert-danger" role="alert">
						<i className="bi bi-exclamation-triangle-fill mx-1"></i>{error}
					</div>}
					{success && <div className="p-2 alert alert-success" role="alert">
						<i className="bi bi-check-circle-fill mx-1"></i> Success
					</div>}
					<input
						type="email"
						className={"form-control my-3" + (error&&" is-invalid")}
						placeholder="email"
						ref={emailRef}
						required
					/>
					<input
						type="password"
						className={"form-control my-2"  + (error&&" is-invalid")}
						minLength={6}
						placeholder="password"
						ref={passwordRef}
						required
					/>
					<div className="text-end my-2">
						<Link to="/fwtpsd" className="link-primary text-decoration-none">
							<span>Forgot password?</span>
						</Link>
					</div>
					<div className="d-grid">
						<button type="submit" disabled={loading} className="btn btn-primary">
							{loading && <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true"></span>}
							Log In
						</button>
					</div>
					<div className="mt-4 text-center text-muted">
						<span>
							Don't have an account?
							<Link to="/signup" className="link-primary text-decoration-none"> Sign Up</Link>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;