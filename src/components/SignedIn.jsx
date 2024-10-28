import { useState } from 'react'

import { Sidebar } from './Sidebar.jsx'
import { Settings } from './Settings.jsx'
import { MainView } from './MainView.jsx'

export const SignedIn = () => {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <div className="signed_in_view">
            <Sidebar/>
            <MainView/>
            {showSettings ? <Settings setShowSettings={setShowSettings} /> : null}
        </div >
    )
}