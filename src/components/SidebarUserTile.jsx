import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';

import { useUser } from '../context/UserContext';
import { useStream } from '../context/StreamContext';

import { copyToClipboard } from "../functions/utils"

import Cookies from 'universal-cookie'
const cookies = new Cookies();

export const UserTile = () => {
    const { user, setUserID, loading, setLoading } = useUser()
    const { setSelectedStream } = useStream()

    const logout = async () => {
        await signOut(auth)
        cookies.remove("auth-token")
        cookies.remove("user_id")
        setUserID(null)
        setSelectedStream(null)
    }
    return (
        <div className="user_tile">
            <div className="user_tile-info">
                <div className='user_tile-info-pfp'>
                    <img src={user.photo_url} alt="" className='pfp' />
                </div>
                <div style={{ display: 'inline-block' }} className='user_tile-info-text'>
                    <div className='user_tile-info-display_name'>
                        {user.name}
                    </div>
                    <div className='user_tile-info-user_id-container'>
                        <div
                            className='user_tile-info-user_id'
                            title="Click to copy to clipboard"
                            data-toggle="tooltip" data-placement="top"
                            onClick={() => copyToClipboard(user.id)}
                        >
                            {user.id}
                        </div>
                    </div>
                </div>
            </div>
            <div className="user_tile-buttons buttons-container">
                <span className="button-container">
                    <div className="button button-medium button-hover-dark" onClick={logout} title="Log out">
                        <span className="material-symbols-outlined" height='25'>
                            logout
                        </span>
                    </div>
                </span>
                <span className="button-container">
                    <div className="button button-medium button-hover-dark" title="Settings">
                        <span className="material-symbols-outlined" height='25'>
                            settings
                        </span>
                    </div>
                </span>
            </div>
        </div>
    )
}