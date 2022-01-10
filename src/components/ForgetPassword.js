import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ForgetPassword = () => {
	const emailRef = useRef();
	const [error, setError] = useState("");
	const [instructions, setInstructions] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async function (e) {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			await sendPasswordResetEmail(auth, emailRef.current.value);
			console.log("mail sent");
			setInstructions("Please check your inbox for further instructions");
		} catch (err) {
			console.error(err);
			setError(err.message);
			e.target.reset();
		}
		setLoading(false);
	};
	
	return (
		<div className="h-100 py-5">
			<div style={{ maxWidth: "400px" }} className="card mx-auto">
				<form className="mx-4 card-body" onSubmit={handleSubmit}>
					<h3 className="text-start card-title pt-4 pb-3">Password Reset</h3>
					{error && <div className="p-2 alert alert-danger" role="alert">
						<i className="bi bi-exclamation-triangle-fill mx-1"></i>{error}
					</div>}
					{instructions && <div className="p-2 alert alert-warning" role="alert">
						<i className="bi bi-info-circle-fill mx-1"></i>
	                    { instructions }
					</div>}
					<input
						type="email"
						className={"form-control my-3" + (error&&" is-invalid") + (instructions&&" is-valid")}
						placeholder="email"
						ref={emailRef}
						required
					/>
					<div className="d-grid mt-4">
						<button type="submit" disabled={loading} className="btn btn-primary">
							{loading && <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true"></span>}
							Reset Password
						</button>
					</div>
					<div className="mt-3 text-center text-muted">
						<span>
							Want a new account?
							<Link to="/signup" className="link-primary text-decoration-none"> SignUp</Link>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ForgetPassword;