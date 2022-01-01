import { Link } from "react-router-dom";

const Navbar = ({ currentUser }) => {
	return (
		<div>
			{/* top_nav-all_screens */}
			<nav className="navbar navbar-expand-md navbar-light bg-white sticky-top">
				<div className="container-sm">
					<Link className="navbar-brand" to="/">
						<img
							src="https://uxwing.com/wp-content/themes/uxwing/download/10-brands-and-social-media/instagram-text.svg"
							alt="logo"
							width={100}
						/>
					</Link>
					<ul className="navbar-nav fs-5 gap-3">
						<div className="collapse navbar-collapse gap-2">
							<li className="nav-item">
								<Link className="nav-link" to="/" title="home">
									<i className="bi bi-house-door" />
								</Link>
							</li>
							<li className="nav-item">
								<button
									type="button"
									title="new post"
									className="btn nav-link"
									data-bs-toggle="modal"
									data-bs-target="#create"
								>
									<i className="bi bi-plus-square fs-5"></i>
								</button>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/explore" title="explore">
									<i className="bi bi-compass" />
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/favourites" title="favourites">
									<i className="bi bi-heart" />
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/chat" title="chat">
									<i className="bi bi-send" />
								</Link>
							</li>
						</div>
						<li className="nav-item">
							{currentUser && (
								<Link className="nav-link" to={"/" + currentUser.uid} title="profile">
									<i className="bi bi-person-circle" />
								</Link>
							)}
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
						<Link className="nav-link" to="/" title="home">
							<i className="bi bi-house-door" />
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/chat" title="chat">
							<i className="bi bi-send" />
						</Link>
					</li>
					<li className="nav-item">
						<button
							type="button"
							className="btn nav-link"
							data-bs-toggle="modal"
							data-bs-target="#create"
						>
							<i className="bi bi-plus-square fs-5"></i>
						</button>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/favourites" title="favourites">
							<i className="bi bi-heart" />
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/explore" title="explore">
							<i className="bi bi-compass" />
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
