const Navbar = () => {
	return (
		<div>
			{/* top_nav-all_screens */}
			<nav className="navbar navbar-expand-md navbar-light bg-white sticky-top">
				<div className="container-sm">
					<a className="navbar-brand" href="#">
						<img
							src="https://uxwing.com/wp-content/themes/uxwing/download/10-brands-and-social-media/instagram-text.svg"
							alt="logo"
							width={100}
						/>
					</a>
					<ul className="navbar-nav fs-5 gap-3">
						<div className="collapse navbar-collapse gap-2">
							<li className="nav-item">
								<a className="nav-link" href="#">
									<i className="bi bi-house-door" />
								</a>
							</li>
							<li className="nav-item">
								<button
									type="button"
									class="btn nav-link"
									data-bs-toggle="modal"
									data-bs-target="#create"
								>
									<i class="bi bi-plus-square fs-5"></i>
								</button>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									<i className="bi bi-compass" />
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									<i className="bi bi-heart" />
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									<i className="bi bi-send" />
								</a>
							</li>
						</div>
						<li className="nav-item">
							<a className="nav-link" href="#">
								<i className="bi bi-person-circle" />
							</a>
						</li>
					</ul>
				</div>
			</nav>
			{/* bottom_nav-small_screens */}
			<nav
				style={{ height: "40px" }}
				className="navbar navbar-expand navbar-light bg-white fixed-bottom d-sm-none border-top"
			>
				<ul className="container-fluid navbar-nav fs-5">
					<li className="nav-item">
						<a className="nav-link" href="#">
							<i className="bi bi-house-door" />
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							<i className="bi bi-send" />
						</a>
					</li>
					<li className="nav-item">
						<button
							type="button"
							class="btn nav-link"
							data-bs-toggle="modal"
							data-bs-target="#create"
						>
							<i class="bi bi-plus-square fs-5"></i>
						</button>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							<i className="bi bi-heart" />
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">
							<i className="bi bi-compass" />
						</a>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
