import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const SignUp = () => {
	const navigate = useNavigate();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async function (e) {
		e.preventDefault();
		try {
			if (passwordRef.current.value !== passwordConfirmRef.current.value) {
				throw new Error("Passwords do not match");
			} else {
				setError("");
				setLoading(true);
				const userCred = await createUserWithEmailAndPassword(
					auth,
					emailRef.current.value,
					passwordRef.current.value
				);
				await setDoc(doc(db, "users", userCred.user.uid), {
					email: userCred.user.email,
					name: "no name",
					likes: [],
					following: [],
					followers: [],
					createdAt: serverTimestamp()
				})
				console.log("loggedin as " + userCred.user);
				setSuccess(true);
				navigate("/");
			}
		} catch (err) {
			console.error(err);
			setError(err.message);
			e.target.reset();
			setLoading(false);
		}
	};
	
	return (
		<div style={{ maxWidth: "400px" }} className="card my-5 mx-auto">
			<form className="mx-4 card-body" onSubmit={handleSubmit}>
				<h3 className="text-start card-title pt-4 pb-3">Create Account</h3>
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
					required
					ref={emailRef}
					disabled={loading}
				/>
				<input
					type="password"
					className={"form-control my-2"  + (error&&" is-invalid")}
					minLength={6}
					placeholder="password"
					required
					ref={passwordRef}
					disabled={loading}
				/>
				<input
					type="password"
					className={"form-control my-2"  + (error&&" is-invalid")}
					minLength={6}
					placeholder="confirm password"
					required
					ref={passwordConfirmRef}
					disabled={loading}
				/>
				<div className="d-grid mt-4">
					<button type="submit" disabled={loading} className="btn btn-primary">
						{loading && <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true"></span>}
						Sign Up
					</button>
				</div>
				<div className="my-1 row justify-content-around">
					<hr className="col-4 mt-3" /> or <hr className="col-4 mt-3" />
				</div>
				<div className="fs-5">
					<Link to="/signup/google">
						<i className="bi bi-google mx-1"></i>
					</Link>
					<Link to="/signup/facebook">
						<i className="bi bi-facebook mx-1"></i>
					</Link>
					<Link to="/signup/twitter">
						<i className="bi bi-twitter mx-1"></i>
					</Link>
				</div>
				<div className="mt-3 text-center text-muted">
					<span>
						Already have an account?
						<Link to="/login" className="link-primary text-decoration-none"> Login</Link>
					</span>
				</div>
			</form>
		</div>
	);
};

export default SignUp;