import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyA2yp_IuHeoyzxkbkJADIEk_k2dgwbMAzY",
    authDomain: "frontend-c6720.firebaseapp.com",
    projectId: "frontend-c6720",
    storageBucket: "frontend-c6720.appspot.com",
    messagingSenderId: "775455038080",
    appId: "1:775455038080:web:9d95757d584e793d2be465",
    measurementId: "G-Q84JMNEJ45"
};

initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

// const addUser = async function(user){
//     try {
//         user = {
//             email: user['email'],
//             password: user['password'],
//             createdAt: serverTimestamp()
//         }
//         const userRef = await addDoc(collection(db, "users"), user);
//         console.log(userRef);
//     } catch (err) {
//         console.log(err);
//     }
// }

// export {addUser}

// q = query(colRef, where(...), orderBy('createdAt'))
// onSnapshot(q, (snapshot) => {
//     let users = []
//     snapshot.docs.forEach((doc) => {
//         users.push({...doc.data(), id: doc.id})
//     });
//     console.log(users);
// })
