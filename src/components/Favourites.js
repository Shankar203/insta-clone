import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react/cjs/react.development";
import { db } from "../firebase";

const Favourites = ({ currentUser }) => {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [favourites, setFavourites] = useState([]);

	useEffect(() => {
		try {
			if (currentUser) {
				onSnapshot(doc(db, "users", currentUser.uid), async (user) => {
					const favs = await Promise.all(
						user.data().likes.map(async (fav) => {
							fav = await getDoc(fav);
                            fav = { ...fav.data(), id: fav.id };
							return fav;
						})
					);
                    setFavourites(favs);
                    setLoading(false);
					console.log(favs);
				});
			}
		} catch (err) {
			console.error(err);
			setError(err.message);
			setLoading(false);
		}
	}, [currentUser]);

	return (
		<div style={{maxWidth: 950 }} className="container-sm p-2">
			{error && (
				<div className="alert alert-danger my-0" role="alert">
					<i className="bi bi-exclamation-triangle-fill mx-1"></i> {error}
				</div>
			)}
			<div className="row row-cols-3">
				{favourites.length > 0 &&
					favourites.map((favourite) => (
						<div className="col p-1" key={favourite.id}>
							<Link to={"/p/" + favourite.id}>
								<img
									height={250}
									width={"100%"}
									className="rounded"
									src={favourite.link}
									alt="favouritePic"
								/>
							</Link>
						</div>
					))}
				{loading &&
					Array(3).fill(
						<div className="col placeholder-glow p-1">
							<span style={{ height: 250, width: "100%" }} className="rounded placeholder"></span>
						</div>
					)}
			</div>
		</div>
	);
};

export default Favourites;
