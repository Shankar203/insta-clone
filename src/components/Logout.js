import { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Logout = () => {
    const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

    signOut(auth)
        .then(() => setSuccess(true))
        .catch((err) => setError(err.message));

	return (
		<div className="d-inline-block py-5 fs-5">
			{error && <div className="alert alert-danger" role="alert">
				<i class="bi bi-exclamation-triangle-fill mx-1"></i> {error}
			</div>}
			{success && <div className="alert alert-success" role="alert">
				<i class="bi bi-check-circle-fill mx-1"></i>
				Logged out Successfully!
				<Link to="/signup" className="alert-link"> Sign Up?</Link>
			</div>}
		</div>
	);
};

export default Logout;