import { auth, provider, db } from '../firebase-config.js'
import { signInWithPopup } from 'firebase/auth'

import { addDoc, collection, serverTimestamp, where, getDocs, query } from 'firebase/firestore'

import '../styles/Auth.css'
import { getUser } from '../functions/firebaseCalls'

import Cookies from 'universal-cookie'
const cookies = new Cookies();

export const Auth = ({ setIsAuthenticated, setAuthenticatedUser }) => {
    const usersRef = collection(db, 'users')
    const streamsRef = collection(db, "streams")

    const createUnsortedChannel = async (user) => {
        try {
            const streamData = {
                reserved: true,
                name: "_unsorted",
                created_at: serverTimestamp(),
                created_by: user.localId,
                member_ids: [user.localId],
                admin_ids: [user.localId]
            }

            const docRef = await addDoc(streamsRef, streamData)
        } catch (err) {
            console.error(err)
        }
    }

    const addUser = async (user) => {
        // user.preventDefault()
        try {
            const userData = {
                id_local: user.localId,
                created_at: serverTimestamp(),
                name: user.displayName,
                email: user.email,
                email_verified: user.emailVerified,
                photo_url: user.photoUrl,
                last_login: user.lastLoginAt,
                last_refresh: user.lastRefreshAt
            }
            await addDoc(usersRef, userData)
            await createUnsortedChannel(user)
            return userData;
        } catch (err) {
            console.error(err)
        }
    }

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider)

            var authenticatedUser = await getUser(result.user.reloadUserInfo.localId); // if no user with this ID exists, an empty array is returned
            if (authenticatedUser.length == 0) { // the user with this ID does not exist and must thus be added to the database
                authenticatedUser = await addUser(result.user.reloadUserInfo)
            } else {
                authenticatedUser = authenticatedUser[0] // converts the initial array to a single element
            }

            console.log(authenticatedUser)

            cookies.set("auth-token", result.user.refreshToken)
            cookies.set("auth-user", authenticatedUser)
            setAuthenticatedUser(authenticatedUser)
            setIsAuthenticated(true)
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='auth-container'>
            <div className='service-name auth-service-name'>
                Lightning Notes
            </div>
            <div className="auth gradient">
                <div className='auth-card-container'>
                    <div className='auth-card'>
                        {/* <div className='auth-card-item login-text'>
                            Log in to Lightning Notes
                        </div> */}
                        <button onClick={signInWithGoogle} className="auth-card-item google-sign-in-button">
                            <img
                                src="https://raw.githubusercontent.com/firebase/firebaseui-web/5ff6fde2324d95d976e35ef1986ac5f241d3774e/image/google.svg"
                                alt="Google logo"
                                className="google-logo"
                            />
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}