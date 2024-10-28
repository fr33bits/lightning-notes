import '../styles/Sidebar.css'

import { Header } from './SidebarHeader.jsx';
import { StreamList } from './SidebarStreamList.jsx';
import { UserTile } from './SidebarUserTile.jsx';

export const Sidebar = ({ selectedStream, setSelectedStream, setShowStreamSettings }) => {
    return (
        <div className='sidebar-container'>
            <div className="sidebar sidebar-top">
                <Header
                    setSelectedStream={setSelectedStream}
                />
                <StreamList
                    selectedStream={selectedStream}
                    setSelectedStream={setSelectedStream}
                    setShowStreamSettings={setShowStreamSettings}
                />
            </div>
            <div className='sidebar sidebar-bottom'>
                <UserTile/>
            </div>
        </div>
    )
}