import Cookies from 'universal-cookie'
import { signInWithGoogle } from '../functions/firebaseCalls.js'

import '../styles/Auth.css'

export const Auth = ({ setIsAuthenticated, setAuthenticatedUser }) => {
    const cookies = new Cookies();

    const signInGoogle = async () => {
        const result = await signInWithGoogle()
        cookies.set("auth-token", result.authToken)
        setAuthenticatedState(result.authenticatedUser)
    }

    const setAuthenticatedState = (authenticatedUser) => {
        setAuthenticatedUser(authenticatedUser)
        setIsAuthenticated(true)
        cookies.set("auth-user", authenticatedUser)
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
                        <button onClick={signInGoogle} className="auth-card-item google-sign-in-button">
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