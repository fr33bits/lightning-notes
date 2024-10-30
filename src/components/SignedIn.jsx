import { useState } from 'react'

import { Sidebar } from './Sidebar.jsx'
import { Settings } from './Settings.jsx'
import { MainView } from './MainView.jsx'

import { useView } from '../context/ViewContext'

export const SignedIn = () => {
    const [showSettings, setShowSettings] = useState(false)
    const values = useView()
    const isSidebarVisible = values?.isSidebarVisible ?? true

    return (
        <div className="signed_in_view">
            {isSidebarVisible ? <Sidebar/> : null }
            <MainView/>
            {showSettings ? <Settings setShowSettings={setShowSettings} /> : null}
        </div >
    )
}