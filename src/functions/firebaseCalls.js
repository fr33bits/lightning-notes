import { collection, where, query, getDocs } from "firebase/firestore";

import { db } from '../firebase-config.js'

const usersRef = collection(db, 'users')

export const getUser = async (user_id) => {
    const q = query(usersRef, where("id_local", "==", user_id))
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data());
    return users;
}