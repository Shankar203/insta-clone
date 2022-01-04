import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";


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

async function likePost(uid, postId, e) {
    e.target.disabled = true;
    const user = doc(db, "users", uid);
    const post = doc(db, "posts", postId);
    if (e.target.id === "fill") {
        e.target.className = "bi bi-heart";
        e.target.id = "empty";
        await updateDoc(post, {
            likes: arrayRemove(user)
        })
        await updateDoc(user, {
            likes: arrayRemove(post)
        })
    }else if (e.target.id === "empty") {
        e.target.className = "bi bi-heart-fill text-danger";
        e.target.id = "fill";
        await updateDoc(post, {
            likes: arrayUnion(user)
        })
        await updateDoc(user, {
            likes: arrayUnion(post)
        })
    }
    e.target.disabled = false;
}

export { follow, unfollow, likePost };