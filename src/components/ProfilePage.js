import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { follow, unfollow } from "./toggle";

const ProfilePage = ({ currentUser }) => {
	const { uid } = useParams();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [userCred, setUserCred] = useState();
	const [loginCred, setLoginCred] = useState();
    const [posts, setPosts] = useState([]);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	
	useEffect(() => {
		try {
			onSnapshot(doc(db, "users", uid), (user) => {
				if (user.exists()) {
					user = { id: user.id, ...user.data() };
					setUserCred(user);
					console.log(user);
				} else {
					setError("No such user");
				}
			});
		} catch (err) {
			console.error(err);
			setError(err);
			setUserCred(null);
			setLoading(false);
		}
	}, [uid]);

	useEffect(async () => {
		try {
			if (userCred) {
				setLoading(true);
				const newFollowers = await Promise.all(
					userCred.followers.map(async (follower) => {
						follower = await getDoc(follower);
						follower = { ...follower.data(), id: follower.id };
						return follower;
					})
				);
				const newFollowing = await Promise.all(
					userCred.following.map(async (follower) => {
						follower = await getDoc(follower);
						follower = { ...follower.data(), id: follower.id };
						return follower;
					})
				);
				const newPosts = await Promise.all(
					userCred.posts.map(async (post) => {
						post = await getDoc(post);
						post = { ...post.data(), id: post.id };
						return post;
					})
				);
				setPosts(newPosts);
				setFollowers(newFollowers);
				setFollowing(newFollowing);
				setLoading(false);
			}
		} catch (err) {
			console.error(err);
			setLoading(false);
		}
	}, [userCred]);

	useEffect(() => {
		try {
			if (currentUser) {
				onSnapshot(doc(db, "users", currentUser.uid), (user) => {
					user = { id: user.id, ...user.data() };
					setLoginCred(user);
				});
			}
		} catch (err) {
			console.error(err);
			setLoginCred(null);
		}
	}, [currentUser]);
		
		return (
			<div style={{ maxWidth: 850 }} className="card my-3 mx-auto">
				{error && (
					<div className="alert alert-danger my-0" role="alert">
						<i className="bi bi-exclamation-triangle-fill mx-1"></i> {error}
					</div>
				)}
				{userCred && loginCred && currentUser && (
					<>
						<div className="row row-cols-2 g-2 justify-content-center">
							<div className="col-sm-3 my-3 text-center">
								<img
									width={128}
									height={128}
									className="rounded-circle"
									src={
										userCred.profilePicURL ||
										`https://ui-avatars.com/api/name=${
											userCred.name || "no name"
										}/?background=random`
									}
									alt="profile-pic"
								/>
							</div>
							<div className="form-floating col-8 my-3 px-3 d-none d-sm-block text-start">
								<div className="fs-3 fw-bold">
									{userCred.name || userCred.email}{" "}
									{currentUser.uid === userCred.id && (
										<Link
											type="button"
											to="/profile/edit"
											className="btn btn-outline-secondary btn-sm"
										>
											Edit Profile
										</Link>
									)}
									{currentUser.uid !== userCred.id && (loginCred.following.map((f) => f.id).includes(userCred.id) ? (
										<button
											className="btn btn-outline-danger btn-sm"
											onClick={(e) => unfollow(currentUser.uid, userCred.id, e)}
										>
											Unfollow
										</button>
									) : (
										<button
											className="btn btn-primary btn-sm"
											onClick={(e) => follow(currentUser.uid, userCred.id, e)}
											disabled={currentUser.uid === userCred.id}
										>
											Follow
										</button>
									))}
								</div>
								<br />
								<div className="fs-5 d-flex gap-3">
									<div>
										<b>{userCred.posts && userCred.posts.length}</b> Posts
									</div>
									<div>
										<b>{userCred.followers && userCred.followers.length}</b> Followers
									</div>
									<div>
										<b>{userCred.following && userCred.following.length}</b> Following
									</div>
								</div>
								<sub className="text-muted">{uid}</sub>
							</div>
							<div className="col-1 my-3 fs-3 d-none d-sm-block">
								{currentUser.uid === userCred.id && (
									<Link className="link-secondary" to="/logout">
										<i className="bi bi-box-arrow-right"></i>
									</Link>
								)}
							</div>
						</div>
						<div className="my-3 mx-2 text-start d-flex justify-content-between d-sm-none">
							<div className="fw-bold p-1">
								{userCred.name || userCred.email} <Link type="button" to="/profile/edit" className="btn btn-outline-secondary btn-sm py-0">Edit Profile</Link>
							</div>
							<Link className="link-secondary" to="/logout">
								<i className="bi bi-box-arrow-right fs-4 p-1"></i>
							</Link>
						</div>
						<nav>
							<ul className="nav nav-tabs justify-content-evenly justify-content-sm-start">
								<li className="nav-item">
									<Link
										className="nav-link active"
										id="posts"
										data-bs-toggle="list"
										to="#posts-content"
										role="tab"
										aria-controls="posts-content"
									>
										<b>{userCred.posts && userCred.posts.length}</b> Posts
									</Link>
								</li>
								<li className="nav-item">
									<Link
										className="nav-link"
										id="followers"
										data-bs-toggle="list"
										to="#followers-content"
										role="tab"
										aria-controls="followers-content"
									>
										<b>{userCred.followers && userCred.followers.length}</b> Followers
									</Link>
								</li>
								<li className="nav-item">
									<Link
										className="nav-link"
										id="following"
										data-bs-toggle="list"
										to="#following-content"
										role="tab"
										aria-controls="following-content"
									>
										<b>{userCred.following && userCred.following.length}</b> Following
									</Link>
								</li>
							</ul>
						</nav>
						<div className="tab-content">
							{/* posts */}
							<div
								className="tab-pane fade show active p-3"
								id="posts-content"
								role="tabpanel"
								aria-labelledby="posts"
							>
								<div className="row row-cols-3">
									{posts.length > 0 &&
										posts.slice(0, 15).map((post) => (
											<div className="col p-1" key={post.id + "posts"}>
												<Link to={"/p/" + post.id}>
													<img
														height={200}
														width={"100%"}
														className="rounded"
														src={post.link}
														alt="postPic"
													/>
												</Link>
											</div>
										))}
									{loading &&
										Array(3).fill(
											<div className="col placeholder-glow p-1">
												<span
													style={{ height: 200, width: "100%" }}
													className="rounded placeholder"
												></span>
											</div>
										)}
								</div>
							</div>
							{/* followers */}
							<div
								className="tab-pane fade py-3"
								id="followers-content"
								role="tabpanel"
								aria-labelledby="followers"
							>
								{followers.length > 0 &&
									followers.slice(0, 15).map((follower) => (
										<div
											className="card mx-auto m-2 p-2 bg-light"
											style={{ maxWidth: 500 }}
											key={follower.id + "followers"}
										>
											<div className="row">
												<div className="col-2">
													<img
														width={45}
														height={45}
														className="rounded-circle"
														src={
															follower.profilePicURL ||
															`https://ui-avatars.com/api/name=${
																follower.name || "no name"
															}/?background=random`
														}
														alt="profile-pic"
													/>
												</div>
												<div className="col-7 text-start d-grid align-items-center">
													<h5>{follower.name}</h5>
												</div>
												<div className="col-3 d-grid align-items-center">
													{loginCred.following.map((f) => f.id).includes(follower.id) ? (
														<button
															className="btn btn-outline-danger"
															onClick={(e) => unfollow(currentUser.uid, follower.id, e)}
														>
															Unfollow
														</button>
													) : (
														<button
															className="btn btn-primary"
															onClick={(e) => follow(currentUser.uid, follower.id, e)}
															disabled={currentUser.uid === follower.id}
														>
															Follow
														</button>
													)}
												</div>
											</div>
										</div>
									))}
								{loading && (
									<div className="card mx-auto m-2 p-2 bg-light" style={{ maxWidth: 500 }}>
										<div className="row">
											<div className="col-2 placeholder-glow">
												<span
													style={{ width: 45, height: 45 }}
													className="rounded-circle placeholder"
												></span>
											</div>
											<div className="col-7 text-start d-grid align-items-center">
												<h5 className="placeholder-wave">
													<span className="placeholder col-12" />
												</h5>
											</div>
											<div className="col-3 text-start d-grid align-items-center">
												<h5 className="placeholder-wave">
													<span className="placeholder col-10" />
												</h5>
											</div>
										</div>
									</div>
								)}
							</div>
							{/* following */}
							<div
								className="tab-pane fade py-3"
								id="following-content"
								role="tabpanel"
								aria-labelledby="following"
							>
								{following.length > 0 &&
									following.slice(0, 15).map((follower) => (
										<div
											className="card mx-auto m-2 p-2 bg-light"
											style={{ maxWidth: 500 }}
											key={follower.id + "following"}
										>
											<div className="row">
												<div className="col-2">
													<img
														width={45}
														height={45}
														className="rounded-circle"
														src={
															follower.profilePicURL ||
															`https://ui-avatars.com/api/name=${
																follower.name || "no name"
															}/?background=random`
														}
														alt="profile-pic"
													/>
												</div>
												<div className="col-7 text-start d-grid align-items-center">
													<h5>{follower.name}</h5>
												</div>
												<div className="col-3 d-grid align-items-center">
													{loginCred.following.map((f) => f.id).includes(follower.id) ? (
														<button
															className="btn btn-outline-danger"
															onClick={(e) => unfollow(currentUser.uid, follower.id, e)}
														>
															Unfollow
														</button>
													) : (
														<button
															className="btn btn-primary"
															onClick={(e) => follow(currentUser.uid, follower.id, e)}
															disabled={currentUser.uid === follower.id}
														>
															Follow
														</button>
													)}
												</div>
											</div>
										</div>
									))}
								{loading && (
									<div className="card mx-auto m-2 p-2 bg-light" style={{ maxWidth: 500 }}>
										<div className="row">
											<div className="col-2 placeholder-glow">
												<span
													style={{ width: 45, height: 45 }}
													className="rounded-circle placeholder"
												></span>
											</div>
											<div className="col-7 text-start d-grid align-items-center">
												<h5 className="placeholder-wave">
													<span className="placeholder col-12" />
												</h5>
											</div>
											<div className="col-3 text-start d-grid align-items-center">
												<h5 className="placeholder-wave">
													<span className="placeholder col-10" />
												</h5>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		);
};

export default ProfilePage;
