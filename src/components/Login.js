const Login = () => {
	return (
		<div style={{ maxWidth: "400px" }} className="card my-5 mx-auto">
			<img width="175px" className="mx-auto py-5" src={"https://uxwing.com/wp-content/themes/uxwing/download/10-brands-and-social-media/instagram-text.svg"} />
			<form className="mx-4 card-body">
				<div className="d-grid">
					<button type="link" className="btn btn-primary btn-sm">
						<i className="bi bi-facebook" /> Continue with Facebook
					</button>
				</div>
				<div className="my-3 row justify-content-around">
					<hr className="col-4 mt-3" /> or <hr className="col-4 mt-3" />
				</div>
				<input type="email" className="form-control mb-3" id="email" required placeholder="email" />
				<input
					type="password"
					className="form-control"
					id="password"
					minLength={6}
					required
					placeholder="password"
				/>
				<div className="text-end my-2">
					<a href="#" className="link-primary text-decoration-none">
						<span>Forgot password?</span>
					</a>
				</div>
				<div className="d-grid">
					<button type="submit" className="btn btn-primary">
						Log In
					</button>
				</div>
				<div className="mt-4 text-center text-muted">
					<span>
						Don't have an account?
						<a href="#" className="link-primary text-decoration-none"> Sign Up</a>
					</span>
				</div>
			</form>
		</div>
	);
};

export default Login;
