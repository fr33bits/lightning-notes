import { useUser } from "../context/UserContext"
import { copyToClipboard } from "../functions/utils"

export const Footer = () => {
    const {user, loading } = useUser()
    return (
        <div className='sidebar sidebar-bottom'>
            <img src={user.photo_url} alt="" className='pfp' />
            <div style={{ display: 'inline-block' }} className='sidebar-bottom-text'>
                <div className='user-name'>
                    {user.name}
                </div>
                <div
                    className='local-id'
                    title="Click to copy to clipboard"
                    data-toggle="tooltip" data-placement="top"
                    onClick={() => copyToClipboard(user.id)}
                >
                    {user.id}
                </div>
            </div>
            {/* <span class="material-symbols-outlined" height='25'>
                settings
            </span> */}
        </div>
    )
}