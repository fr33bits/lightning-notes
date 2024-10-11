import { signInWithPopup } from 'firebase/auth'
import { collection, where, query, doc, getDoc, getDocs, serverTimestamp, addDoc } from "firebase/firestore";

import { auth, provider, db } from '../firebase-config.js'

const usersRef = collection(db, 'users')
const streamsRef = collection(db, "streams")

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider)
        var authenticatedUser = await getUserByAuthID(result.user.reloadUserInfo.localId); // if no user with this ID exists, an empty array is returned
        if (!authenticatedUser) { // the user with this ID does not exist and must thus be added to the database
            authenticatedUser = await addUser(result.user.reloadUserInfo)
        }

        return { authenticatedUser, authToken: result.user.refreshToken }
    } catch (err) {
        console.error(err);
    }
}

export const getUserByAuthID = async (auth_id) => {
    try {
        const q = query(usersRef, where("auth_id", "==", auth_id))
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0]
            const userData = {id: user.id, ...user.data()}
            return userData
        } else {
            // console.log("A user with this auth_id does not exist!")
            return null
        }
    } catch (err) {
        console.error(err)
    }
}

export const getUser = async (user_id) => {
    try {
        const docRef = doc(db, 'users', user_id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return {id: docSnap.id, ...docSnap.data()}
        } else {
            // console.log("A user with this ID does not exist!")
            return null;
        }
    } catch (err) {
        console.error(err)
    }
}

export const addUser = async (user) => {
    // user.preventDefault()
    try {
        var userData = {
            // The Firestore user document ID is created by Firestore itself and is not the same as the Firebase Authentication user ID; it is retrived from the docRef object and incorporated into the userData object later
            auth_id: user.localId, // this is the ID user by Firebase Authentication and must be stored here to link those records with these user records
            created_at: serverTimestamp(),
            name: user.displayName,
            email: user.email,
            email_verified: user.emailVerified,
            photo_url: user.photoUrl,
            last_login: user.lastLoginAt,
            last_refresh: user.lastRefreshAt
        }
        const docRef = await addDoc(usersRef, userData)
        const docSnap = await getDoc(docRef) // to ensure that in the returned data, created_at is resolved
        userData = {id: docSnap.id, ...docSnap.data()}
        await createReservedStreams(userData)
        return userData;
    } catch (err) {
        console.error(err)
    }
}

export const createReservedStreams = async (user) => {
    createUnsortedStream(user)
    createInboxStream(user)
}

export const createUnsortedStream = async (user) => {    
    try {
        const streamData = {
            reserved: true,
            name: "_unsorted",
            created_at: serverTimestamp(),
            created_by: user.id,
            member_ids: [user.id],
            admin_ids: [user.id],
            disabled: false,
            deleted: false
        }

        const docRef = await addDoc(streamsRef, streamData)
    } catch (err) {
        console.error(err)
    }
}

export const createInboxStream = async (user) => {    
    try {
        const streamData = {
            reserved: true,
            name: "_inbox",
            created_at: serverTimestamp(),
            created_by: user.id,
            member_ids: [user.id],
            admin_ids: [user.id],
            disabled: false,
            deleted: false
        }

        const docRef = await addDoc(streamsRef, streamData)
    } catch (err) {
        console.error(err)
    }
}