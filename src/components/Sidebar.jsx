import '../styles/Sidebar.css'

import { Header } from './SidebarHeader.jsx';
import { StreamList } from './SidebarStreamList.jsx';
import { Footer } from './SidebarFooter.jsx';

export const Sidebar = ({ selectedStream, setSelectedStream, setShowStreamSettings }) => {
    return (
        <div className='sidebars'>
            <div className="sidebar sidebar-streamlist">
                <Header
                    setSelectedStream={setSelectedStream}
                />
                <StreamList
                    selectedStream={selectedStream}
                    setSelectedStream={setSelectedStream}
                    setShowStreamSettings={setShowStreamSettings}
                />
                <Footer />
            </div>
        </div>
    )
}