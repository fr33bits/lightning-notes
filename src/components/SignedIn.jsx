import { useState } from 'react'

import { Sidebar } from './Sidebar.jsx'
import { Settings } from './Settings.jsx'
import { MainView } from './MainView.jsx'

export const SignedIn = () => {
    const [selectedStream, setSelectedStream] = useState(null)
    const [showSettings, setShowSettings] = useState(false)

    return (
        <div className="signedInView">
            <Sidebar
                selectedStream={selectedStream}
                setSelectedStream={setSelectedStream}
                setShowSettings={setShowSettings}
                className='sidebar'
            />
            <MainView
                selectedStream={selectedStream}
                setSelectedStream={setSelectedStream}
            />
            {showSettings ? <Settings setShowSettings={setShowSettings} /> : null}
        </div >
    )
}