import { db, auth } from "./initialize";
import { createUserWithEmailAndPassword } from "firebase/auth";

const signUp = async function (user) {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, user['email'], user['password']);
        return userCred;
    } catch (err) {
        console.error(err);
        return err.message;
    }
}

export { signUp };