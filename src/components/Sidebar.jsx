import '../styles/Sidebar.css'

import { Header } from './SidebarHeader.jsx';
import { StreamList } from './SidebarStreamList.jsx';
import { UserTile } from './SidebarUserTile.jsx';

export const Sidebar = () => {
    return (
        <div className='sidebar-container'>
            <div className="sidebar sidebar-top">
                <Header/>
                <StreamList/>
            </div>
            <div className='sidebar sidebar-bottom'>
                <UserTile/>
            </div>
        </div>
    )
}