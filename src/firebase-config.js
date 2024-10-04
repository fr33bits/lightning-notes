// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBfgEtGPCWh0fWzI6qNCwijy2Rnld3XhfE",
    authDomain: "lightning-notes.firebaseapp.com",
    projectId: "lightning-notes",
    storageBucket: "lightning-notes.firebasestorage.app",
    messagingSenderId: "253023108628",
    appId: "1:253023108628:web:79ddac21fed02290d6f101"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)