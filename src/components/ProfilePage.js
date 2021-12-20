import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";

const ProfilePage = ({ currentUser }) => {
	const { uid } = useParams();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [userCred, setUserCred] = useState();
    const [posts, setPosts] = useState([]);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);

	useEffect(async () => {
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
		}
	}, [uid]);

	useEffect(async () => {
		try {
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
                    post = { ...post.data(), id: post.id};
                    return post;
                })
            );
            setPosts(newPosts);
			setFollowers(newFollowers);
			setFollowing(newFollowing);
			setLoading(false);
		} catch (err) {
			console.error(err);
		}
	}, [userCred]);

	return (
		<div style={{ maxWidth: 800 }} className="card my-3 mx-auto">
			{userCred && (
				<>
					<div className="row row-cols-2 g-2 justify-content-center">
						<div className="col-sm-3 my-3">
							<img
								width={128}
								height={128}
								className="rounded-circle"
								src={userCred.profilePicURL || "https://pic.onlinewebfonts.com/svg/img_24787.png"}
								alt="profile-pic"
							/>
						</div>
						<div className="form-floating col-9 my-3 px-3 d-none d-sm-block text-start">
							<div className="fs-3 fw-bold">{userCred.name || userCred.email}</div>
							<br />
							<div className="fs-5 d-flex gap-3">
								<div>
									<b>{userCred.posts.length}</b> Posts
								</div>
								<div>
									<b>{userCred.followers.length}</b> Followers
								</div>
								<div>
									<b>{userCred.following.length}</b> Following
								</div>
							</div>
							<sub className="text-muted">{uid}</sub>
						</div>
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
									<b>{userCred.posts.length}</b> Posts
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
									<b>{userCred.followers.length}</b> Followers
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
									<b>{userCred.following.length}</b> Following
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
							<div class="row row-cols-3">
								{posts.length >= 0 &&
									posts.slice(0, 15).map((post) => (
										<div class="col p-1" key={post.id}>
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
										<div class="col placeholder-glow p-1">
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
										key={follower.id}
									>
										<div className="row">
											<div className="col-2">
												<img
													width={45}
													height={45}
													className="rounded-circle"
													src={
														follower.profilePicURL ||
														"https://pic.onlinewebfonts.com/svg/img_24787.png"
													}
													alt="profile-pic"
												/>
											</div>
											<div className="col-7 text-start d-grid align-items-center">
												<h5>{follower.name}</h5>
											</div>
											<div className="col-3 d-grid align-items-center">
												{following.map((f) => f.id).includes(follower.id) ? (
													<button
														className="btn btn-outline-danger"
														onClick={(e) => unfollow(uid, follower.id, e)}
													>
														Unfollow
													</button>
												) : (
													<button
														className="btn btn-primary"
														onClick={(e) => follow(uid, follower.id, e)}
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
										key={follower.id}
									>
										<div className="row">
											<div className="col-2">
												<img
													width={45}
													height={45}
													className="rounded-circle"
													src={
														follower.profilePicURL ||
														"https://pic.onlinewebfonts.com/svg/img_24787.png"
													}
													alt="profile-pic"
												/>
											</div>
											<div className="col-7 text-start d-grid align-items-center">
												<h5>{follower.name}</h5>
											</div>
											<div className="col-3 d-grid align-items-center">
												<button
													className="btn btn-outline-danger"
													onClick={(e) => unfollow(uid, follower.id, e)}
												>
													Unfollow
												</button>
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

async function follow(from, to, e) {
    e.target.disabled = true;
    from = doc(db, "users", from);
    to = doc(db, "users", to);
    await updateDoc(from, {
        following: arrayUnion(to)
    })
    await updateDoc(to, {
        followers: arrayUnion(from)
    })
    e.target.disabled = false;
}

async function unfollow(from, to, e) {
    e.target.disabled = true;
    from = doc(db, "users", from);
    to = doc(db, "users", to);
    console.log(to);
    await updateDoc(from, {
        following: arrayRemove(to)
    })
    await updateDoc(to, {
        followers: arrayRemove(from)
    })
    e.target.disabled = false;
}

export default ProfilePage;
