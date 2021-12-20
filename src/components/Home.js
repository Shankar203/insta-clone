import { collection, limit, onSnapshot, getDocs, orderBy, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const Home = () => {
	const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [postsLimit, setPostsLimit] = useState(6);

	useEffect(async () => {
		try {
			setLoading(true);
			const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(postsLimit));
			const snap = await getDocs(q);
			const newPosts = snap.docs.map(post => {
				return {...post.data(), id:post.id};
			})
			setLoading(false);
			setPosts(newPosts);
			console.log("new posts: ", newPosts);
		} catch (err) {
			setLoading(false);
			setError(err.message);
			console.error(err);
		}
	}, [postsLimit])

	// ifinite scrolling
	window.onscroll = () => {
		const st = document.documentElement['scrollTop'];
		const sh = document.documentElement['scrollHeight'];
		const ch = document.documentElement['clientHeight'];
		const scrollPercent = st / (sh-ch) * 100;
		if (scrollPercent >= 100 && posts.length>=postsLimit) setPostsLimit(oldLimit => oldLimit + 6);
	}

	return (
		<div className="container-md">
			{error && <div className="alert alert-danger" role="alert">
				<i className="bi bi-exclamation-triangle-fill mx-1"></i> {error}
			</div>}
			{posts &&
				posts.map((post, index) => (
					<div className="text-start card my-3" style={{ maxWidth: 600 }} key={post.id}>
						<div className="card-header p-3 bg-white d-flex">
							<img
								className="rounded-circle"
								width={32}
								height={32}
								src="https://www.clipartmax.com/png/full/171-1717870_prediction-clip-art.png"
								alt="profile-pic"
							/>
							<h5 className="mx-3 mt-1">{post.uid}</h5>
						</div>
						<img height="750px" src={post.link} className="card-img-top" />
						<div className="card-body">
							<div>
								<button className="card-link btn p-0 fs-4">
									<i className="bi bi-heart" />
								</button>
								<button className="card-link btn p-0 fs-4">
									<i className="bi bi-chat" />
								</button>
								<button className="card-link btn p-0 fs-4">
									<i className="bi bi-share" />
								</button>
							</div>
							<div className="card-title mb-2">
								<b>{post.likes.length}</b>
							</div>
							<p className="card-text">
								{post.comments[0]["comment"]}
								<br />
								<sub className="text-muted">{window.moment(post.createdAt.toDate()).fromNow()}</sub>
							</p>
						</div>
						<Link to="" className="card-footer card-link bg-white text-decoration-none link-secondary">
							Add a comment...
						</Link>
					</div>
				))}
			{loading &&
				<div className="text-start card my-3" style={{ maxWidth: 600 }}>
					<div className="placeholder-wave"><div style={{ height: 350 }} className="card-img-top bg-secondary placeholder"></div></div>
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
						<br/>
						<p className="card-text placeholder-glow">
							<span className="placeholder col-4" />
						</p>
					</div>
				</div>
			}
		</div>
	);
};

export default Home;
