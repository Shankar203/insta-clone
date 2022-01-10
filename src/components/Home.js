import { collection, limit, getDocs, orderBy, query, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { likePost } from "./toggle";

const Home = ({ currentUser }) => {
	const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [postsLimit, setPostsLimit] = useState(6);

	useEffect(async () => {
		try {
			setLoading(true);
			const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(postsLimit));
			const snap = await getDocs(q);
			const newPosts = await Promise.all(
				snap.docs.map(async post => {
					post = {...post.data(), id: post.id};
					const user = await getDoc(post.user);
					return { ...user.data(), ...post };
				})
			);
			setLoading(false);
			setPosts(newPosts);
			console.log("new posts: ", newPosts);
		} catch (err) {
			setLoading(false);
			setError(err.message);
			console.error(err);
		}
	}, [postsLimit]);

	// ifinite scrolling
	window.onscroll = () => {
		const st = document.documentElement['scrollTop'] || document.body['scrollTop'];
		const sh = document.documentElement['scrollHeight'] || document.body['scrollHeight'];
		const ch = document.documentElement['clientHeight'] || document.body['clientHeight'];
		const scrollPercent = st / (sh-ch) * 100;
		if (scrollPercent >= 95 && posts.length>=postsLimit) setPostsLimit(oldLimit => oldLimit + 3);
	}

	return (
		<div className="container-md">
			{error && (
				<div className="alert alert-danger" role="alert">
					<i className="bi bi-exclamation-triangle-fill mx-1"></i> {error}
				</div>
			)}
			{(posts && currentUser) &&
				posts.map((post, index) => (
					<div className="text-start card my-3" style={{ maxWidth: 600 }} key={post.id}>
						<div className="card-header p-3 bg-white d-flex">
							<Link to={post.user.id}>
								<img
									className="rounded-circle"
									width={35}
									height={35}
									src={
										post.profilePicURL ||
										`https://ui-avatars.com/api/name=${post.name || "no name"}/?background=random`
									}
									alt="profile-pic"
								/>
							</Link>
							<Link to={post.user.id} className="link-dark text-decoration-none">
								<h5 className="mx-3 mt-1">{post.name}</h5>
							</Link>
						</div>
						<Link to={"/p/" + post.id}>
							<img height="750px" src={post.link} className="card-img-top d-none d-sm-block" />
							<img height="400px" src={post.link} className="card-img-top d-sm-none" />
						</Link>
						<div className="card-body">
							<div>
								<button
									className="card-link btn p-0 fs-4"
									onClick={(e) => likePost(currentUser.uid, post.id, e)}
								>
									<i
										className={
											post.likes.map((p) => p.id).includes(currentUser.uid)
												? "bi bi-heart-fill text-danger"
												: "bi bi-heart"
										}
										id={post.likes.map((p) => p.id).includes(currentUser.uid) ? "fill" : "empty"}
									/>
								</button>
								<button className="card-link btn p-0 fs-4">
									<i className="bi bi-chat" />
								</button>
								<button
									className="card-link btn p-0 fs-4"
									onClick={(e) => navigator.clipboard.writeText(document.URL)}
								>
									<i className="bi bi-share" />
								</button>
							</div>
							<div className="card-title mb-2">
								<b>{post.likes.length + " likes"}</b>
							</div>
							<p className="card-text">
								{post.description}
								<br />
								<sub className="text-muted">{window.moment(post.createdAt.toDate()).fromNow()}</sub>
							</p>
						</div>
						<Link
							to={"/p/" + post.id}
							className="card-footer card-link bg-white text-decoration-none link-secondary"
						>
							Add a comment...
						</Link>
					</div>
				))}
			{loading && (
				<div className="text-start card my-3" style={{ maxWidth: 600 }}>
					<div className="placeholder-wave">
						<div style={{ height: 350 }} className="card-img-top bg-secondary placeholder"></div>
					</div>
					<div className="card-body">
						<h4 className="card-title placeholder-glow">
							<span className="placeholder col-3" />
						</h4>
						<p className="card-text placeholder-glow">
							<span className="placeholder col-10" />
							<span className="placeholder col-9" />
						</p>
						<sub className="card-text placeholder-glow">
							<span className="placeholder col-3" />
						</sub>
						<br />
						<p className="card-text placeholder-glow">
							<span className="placeholder col-4" />
						</p>
					</div>
				</div>
			)}
			<div style={{ height: "30px", width: "100%" }} className="d-sm-none"></div>
		</div>
	);
};

export default Home;
