import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const ThirdPartyAuth = () => {
    const navigate = useNavigate();
    const { by } = useParams();
    const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

    
    useEffect(() => {
        const provider =
            by == "google"
            ? new GoogleAuthProvider()
                : by == "facebook"
                ? new FacebookAuthProvider()
                    : by == "twitter"
                    ? new TwitterAuthProvider()
                        : null;
        signInWithPopup(auth, provider)
        .then(() => {
            setSuccess(true);
            navigate("/");
        })
        .catch((err) => setError(err.message));
	}, [by]);

    return ( 
        <div className="d-inline-block py-5 fs-5">
        {error && <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill mx-1"></i> {error}
        </div>}
        {success && <div className="alert alert-success" role="alert">
            <i className="bi bi-check-circle-fill mx-1"></i>
            Logged in Successfully! by {by}
            <Link to="/signup" className="alert-link"> Sign Up?</Link>
        </div>}
    </div>
     );
}
 
export default ThirdPartyAuth;