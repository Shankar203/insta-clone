import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../firebase";

const NewPost = ({ currentUser }) => {
	const navigate = useNavigate();
	const closeRef = useRef();
	const fileRef = useRef();
	const descriptionRef = useRef();
	const [error, setError] = useState("");
	const [progress, setProgress] = useState(0);
	const [loading, setLoading] = useState(false);

	const handleSubmit = function (e) {
		e.preventDefault();
		const file = fileRef.current.files[0];
		const fileType = file.type.split("/");
		const fileSize = file.size / 2 ** 20;
		setLoading(true);
		try {
			if (!["image", "video"].includes(fileType[0])) throw new Error("allowed file types image/video*");
			if (fileSize > 12) throw new Error("file size cant exceed 12MB*");
			const post = ref(storage, "posts/"+currentUser.uid+"/"+file.name);
			const uploadTask = uploadBytesResumable(post, file);
			uploadTask.on(
				"state_changed",
				(snap) => {
					const percent = (snap.bytesTransferred / snap.totalBytes) * 100;
					setProgress(percent);
				},
				(err) => {
					console.error(err);
					setError(err.message);
					setLoading(false);
					e.target.reset();
				},
				async () => {
					const link = await getDownloadURL(post);
					const p = {
						user: doc(db, "users", currentUser.uid),
						link: link,
						description: descriptionRef.current.value,
						likes: [],
						createdAt: serverTimestamp()
					};
					const postObj = await addDoc(collection(db, "posts"), p);
					await updateDoc(doc(db, "users", currentUser.uid), {
						posts: arrayUnion(doc(db, "posts", postObj.id))
					})
					console.log("posted details: " + postObj);
					setLoading(false);
					navigate("/p/"+postObj.id);
				}
			);
		} catch (err) {
			console.error(err);
			setError(err.message);
			setLoading(false);
			e.target.reset();
		}
	};

	return (
		<div
			className="modal fade"
			id="create"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			tabIndex={-1}
			aria-labelledby="staticBackdropLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="staticBackdropLabel">
							Create new post
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
							ref={closeRef}
						/>
					</div>
					<div className="modal-body pt-sm-5 pb-0">
						<div className="m-5 w-50 mx-auto ">
							<svg color="#262626" fill="#262626" viewBox="0 0 97.6 77.3">
								<path
									d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
									fill="currentColor"
								/>
								<path
									d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
									fill="currentColor"
								/>
								<path
									d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
									fill="currentColor"
								/>
							</svg>
						</div>
						<form onSubmit={handleSubmit}>
							{error && (
								<div className="p-2 alert alert-danger" role="alert">
									<i className="bi bi-exclamation-triangle-fill mx-1"></i>
									{error}
								</div>
							)}
							{(progress===100 && !loading) && (
								<div className="p-2 alert alert-success" role="alert">
									<i className="bi bi-check-circle-fill mx-1"></i> Posted Successfully
								</div>
							)}
							<input
								type="file"
								className={"form-control" + (error && " is-invalid")}
								accept="image/*, video/*"
								required
								ref={fileRef}
								disabled={loading || progress===100}
							/>
							<textarea
								className={"form-control my-2" + (error && " is-invalid")}
								maxLength={300}
								placeholder="Leave a comment here"
								required
								ref={descriptionRef}
								disabled={loading || progress===100}
							></textarea>
							{progress===0 || <div className="progress">
								<div
									className="progress-bar progress-bar-striped progress-bar-animated"
									role="progressbar"
									aria-valuenow={progress}
									aria-valuemin={0}
									aria-valuemax={100}
									style={{ width: progress + "%" }}
								></div>
							</div>}
							<div className="modal-footer py-2 mt-4">
								{/* <button
									type="button"
									className="btn btn-outline-danger"
									data-bs-dismiss="modal"
									onClick={() => uploadTask.cancel()}
								>Cancel
								</button> */}
								<button type="submit" disabled={loading || progress===100} className="btn btn-primary">
									{loading && (
										<span
											className="spinner-grow spinner-grow-sm mx-1"
											role="status"
											aria-hidden="true"
										></span>
									)}
									Post
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewPost;