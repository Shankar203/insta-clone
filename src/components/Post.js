import { query, addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { likePost } from "./toggle";

const Post = ({ currentUser }) => {
	const { postId } = useParams();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [post, setPost] = useState();
	const [author, setAuthor] = useState();
	const [comments, setComments] = useState([]);

	useEffect(async () => {
		try {
			onSnapshot(doc(db, "posts", postId), (post) => {
				if (post.exists()) {
					post = { id: post.id, ...post.data() };
					setPost(post);
					console.log(post);
				} else {
					setError("No such post");
				}
			});
			const qc = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
			onSnapshot(qc, async (newComments) => {
				newComments = await Promise.all(
					newComments.docs.map(async (newComment) => {
						newComment = { ...newComment.data(), id: newComment.id };
						const user = await getDoc(newComment.user);
						newComment = { ...user.data(), ...newComment };
						return newComment;
					})
				);
				setComments(newComments);
			});
		} catch (err) {
			console.error(err);
			setError(err.message);
			setPost(null);
		}
	}, [postId]);

	useEffect(async () => {
		try {
			if (post) {
				setLoading(true);
				let author = await getDoc(post.user);
				author = { ...author.data(), id: author.id };
				setAuthor(author);
				setLoading(false);
			}
		} catch (err) {
			console.error(err);
			setError(err.message);
			setComments([]);
			setLoading(false);
		}
	}, [post]);

	return (
		<div className="py-3 container-sm">
			{error && (
				<div className="alert alert-danger my-0" role="alert">
					<i className="bi bi-exclamation-triangle-fill mx-1"></i> {error}
				</div>
			)}
			{post && currentUser && (
				<div style={{ maxWidth: "1050px" }} className="bg-white rounded shadow row mx-auto">
					{author && (
						<div className="card-header p-3 bg-white d-flex d-sm-none">
							<Link to={"/" + author.id}>
								<img
									className="rounded-circle"
									width={40}
									height={40}
									src={
										author.profilePicURL ||
										`https://ui-avatars.com/api/name=${author.name || "no name"}/?background=random`
									}
									alt="profile-pic"
								/>
							</Link>
							<div className="mx-3">
								<Link to={"/" + author.id} className="link-dark text-decoration-none">
									<h5>{author.name}</h5>
								</Link>
								<sub className="text-muted float-start">
									{post.likes.length +
										" likes, " +
										window.moment(post.createdAt.toDate()).fromNow()}
								</sub>
							</div>
						</div>
					)}
					<img height="650px" width="100%" className="col-7 p-0 d-none d-sm-block" src={post.link} alt="postPic" />
					<img height="400px" width="100%" className="p-0 d-sm-none" src={post.link} alt="postPic" />
					<div className="col-sm-5 card">
						{author && (
							<div className="card-header p-3 bg-white d-none d-sm-flex">
								<Link to={"/" + author.id}>
									<img
										className="rounded-circle"
										width={40}
										height={40}
										src={
											author.profilePicURL ||
											`https://ui-avatars.com/api/name=${
												author.name || "no name"
											}/?background=random`
										}
										alt="profile-pic"
									/>
								</Link>
								<div className="mx-3">
									<Link to={"/" + author.id} className="link-dark text-decoration-none">
										<h5>{author.name}</h5>
									</Link>
									<sub className="text-muted float-start">
										{post.likes.length +
											" likes, " +
											window.moment(post.createdAt.toDate()).fromNow()}
									</sub>
								</div>
							</div>
						)}
						<div style={{ height: "450px" }} className="p-2 card-body overflow-auto">
							{author && (
								<div className="d-flex my-2 p-2 bg-light rounded-3 gap-2" key={author.id}>
									<Link to={"/" + author.id}>
										<img
											width={35}
											height={35}
											className="rounded-circle"
											src={
												author.profilePicURL ||
												`https://ui-avatars.com/api/name=${
													author.name || "no name"
												}/?background=random`
											}
											alt="profile-pic"
										/>
									</Link>
									<div className="text-start">
										<Link to={"/" + author.id} className="link-dark text-decoration-none">
											<b>{author.name}</b>
										</Link>
										<br />
										{post.description}
										<br />
										<sub className="text-muted">
											{window.moment(post.createdAt.toDate()).fromNow()}
										</sub>
									</div>
								</div>
							)}
							{comments &&
								comments.map((comment) => (
									<div className="d-flex my-2 p-2 bg-light rounded-3 gap-2" key={comment.id}>
										<Link to={"/" + comment.user.id}>
											<img
												width={35}
												height={35}
												className="rounded-circle"
												src={
													comment.profilePicURL ||
													`https://ui-avatars.com/api/name=${
														comment.name || "no name"
													}/?background=random`
												}
												alt="profile-pic"
											/>
										</Link>
										<div className="text-start">
											<Link to={"/" + comment.user.id} className="link-dark text-decoration-none">
												<b>{comment.name}</b>
											</Link>
											<br />
											{comment.comment}
											<br />
											<sub className="text-muted">
												{comment.createdAt && window.moment(comment.createdAt.toDate()).fromNow()}
											</sub>
										</div>
									</div>
								))}
						</div>
						<div className="card-footer bg-white d-grid justify-content-start text-start">
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

							<input
								type="text"
								placeholder="Add a comment..."
								className="border-0 mt-2"
								onKeyUp={(e) => addComment(e, post.id, currentUser.uid)}
								onFocus={(e) => (e.target.style.outline = "none")}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

async function addComment(e, id, uid) {
	if (e.keyCode === 13) {
		const c = {
			comment: e.target.value,
			user: doc(db, "users", uid),
			createdAt: serverTimestamp(),
		};
		const commentObj = await addDoc(collection(db, "posts", id, "comments"), c);
		console.log(commentObj);
		e.target.value = "";
	}
}

export default Post;
