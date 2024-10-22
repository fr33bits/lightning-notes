import { signOut } from 'firebase/auth';

import { auth } from '../firebase-config';

import { useUser } from '../context/UserContext';
import { useStream } from '../context/StreamContext';

import Cookies from 'universal-cookie'
const cookies = new Cookies();

export const Header = () => {
    const { setUserID, setLoading } = useUser()
    const { setSelectedStream } = useStream()

    const logout = async () => {
        await signOut(auth)
        cookies.remove("auth-token")
        cookies.remove("user_id")
        setUserID(null)
        setSelectedStream(null)
    }
    
    return (
        <div className="sidebar-header gradient">
            <div className='sidebar-header-service-name service-name'>
                Lightning Notes
            </div>
            <div className="sidebar-header-button" onClick={() => setSelectedStream(null)} title='New stream'>
                <div className="sidebar-header-button-icon">
                    <span className="material-symbols-outlined">
                        add
                    </span>
                </div>
            </div>
            <div className="sidebar-header-button" title='Log out'>
                <div className="sidebar-header-button-icon" onClick={logout}>
                    <span className="material-symbols-outlined">
                        logout
                    </span>
                </div>
            </div>
        </div>
    )
}