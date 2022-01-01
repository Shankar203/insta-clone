import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";

const EditProfile = ({ currentUser }) => {
	const navigate = useNavigate();
	const nameRef = useRef();
	const emailRef = useRef();
	const mobileRef = useRef();
	const genderRef = useRef();
	const bioRef = useRef();
	const imageRef = useRef();
	const imageFileRef = useRef();
	const [uid, setUid] = useState();
	const [createdAt, setCreatedAt] = useState();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(async () => {
		try {
			var user = await getDoc(doc(db, "users", currentUser.uid));
			user = { id: user.id, ...user.data() };
			imageRef.current.src = user.profilePicURL || `https://ui-avatars.com/api/name=${user.name ||"no name"}/?background=random`;
			nameRef.current.value = user.name || null;
			emailRef.current.value = user.email || null;
			mobileRef.current.value = user.mobile || null;
			genderRef.current.value = user.gender || null;
			bioRef.current.value = user.bio || null;
			setUid(user.id);
			setCreatedAt(user.createdAt.toDate().toString());
		} catch (err) {
			console.error(err);
		}
	}, [currentUser]);

	const handleSubmit = async function (e) {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			var profilePicURL = imageRef.current.src;
			if (imageFileRef.current.files.length>0) {
				const file = imageFileRef.current.files[0];
				const fileType = file.type.split("/");
				const fileSize = file.size / 2 ** 20;
				if (fileType[0] != "image") throw new Error("allowed file types image*");
				if (fileSize > 4) throw new Error("file size cant exceed 4MB*");
				const profilePic = ref(storage, "profilePics/"+uid+"."+fileType[1]);
				profilePicURL = await getDownloadURL(profilePic);
				await uploadBytes(profilePic, file);
			}
			await updateDoc(doc(db, "users", currentUser.uid), {
				profilePicURL: profilePicURL,
				name: nameRef.current.value,
				email: emailRef.current.value,
				mobile: mobileRef.current.value,
				gender: genderRef.current.value,
				bio: bioRef.current.value,
			});
			setSuccess(true);
			navigate("/" + uid);
		} catch (err) {
			console.error(err);
			setError(err.message);
			setLoading(false);
		}
	};
	return (
		<div style={{ maxWidth: 750 }} className="card my-3 mx-auto">
			<form className="mx-4 card-body" onSubmit={handleSubmit}>
				<div className="row row-cols-2 g-2 justify-content-center">
					<div className="col-sm-3 my-3">
						<img
							width={128}
							height={128}
							className="rounded-circle"
							src="https://ui-avatars.com/api/name=no name/?background=random"
							alt="profile-pic"
							ref={imageRef}
						/>
						<input
							type="file"
							id="upload"
							accept="image/*"
							className="d-none"
							ref={imageFileRef}
							onChange={(e) => {
								imageRef.current.src = window.URL.createObjectURL(e.target.files[0]);
							}}
						/>
						<label htmlFor="upload">
							<i
								style={{ top:"115px",marginLeft:"-30px", height: "32px", width: "32px", cursor: "pointer" }}
								className="bi bi-pencil-square bg-light rounded-circle border p-1 position-absolute"
							></i>
						</label>
					</div>
					<div className="form-floating col-9 my-4 px-3 d-none d-sm-block text-start">
						<div className="fs-3 fw-bold">{uid}</div>
						<sub>{createdAt}</sub>
					</div>
				</div>
				{error && (
					<div className="p-2 alert alert-danger" role="alert">
						<i className="bi bi-exclamation-triangle-fill mx-1"></i>
						{error}
					</div>
				)}
				{success && (
					<div className="p-2 alert alert-success" role="alert">
						<i className="bi bi-check-circle-fill mx-1"></i> Success
					</div>
				)}
				<div className="form-floating mb-2">
					<input
						type="text"
						className="form-control"
						id="name"
						placeholder="Ironman"
						ref={nameRef}
						disabled={loading}
					/>
					<label htmlFor="name">Name</label>
				</div>
				<div className="form-floating mb-2">
					<input
						type="email"
						className="form-control"
						id="email"
						placeholder="tony@gmail.com"
						ref={emailRef}
						disabled={loading}
					/>
					<label htmlFor="email">Email Address</label>
				</div>
				<div className="form-floating mb-2">
					<input
						type="tel"
						className="form-control"
						id="mobile"
						placeholder="7935"
						ref={mobileRef}
						disabled={loading}
					/>
					<label htmlFor="mobile">Phone Number</label>
				</div>
				<div className="form-floating mb-2">
					<select
						className="form-select"
						id="gender"
						aria-label="Floating label select example"
						ref={genderRef}
						disabled={loading}
					>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
					<label htmlFor="gender">Gender</label>
				</div>
				<div className="form-floating mb-2">
					<textarea
						className="form-control"
						id="bio"
						style={{ height: 100 }}
						placeholder="Tell us something about you..."
						ref={bioRef}
						disabled={loading}
					/>
					<label htmlFor="bio">Bio</label>
				</div>
				<div className="float-end my-2">
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading && (
							<span
								className="spinner-grow spinner-grow-sm mx-1"
								role="status"
								aria-hidden="true"
							></span>
						)}
						Save
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditProfile;
