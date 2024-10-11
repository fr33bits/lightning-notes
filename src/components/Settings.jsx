import React, { useState, useEffect } from 'react'

import '../styles/Settings.css'

export const Settings = ({ authenticatedUser, setShowSettings }) => {
    return (
        <div className='background' onClick={() => setShowSettings(false)}>
            <div className='floating-card'>
                <div>
                    <img src={authenticatedUser.photo_url} alt="" className='pfp'/>
                </div>
                <div className='user-name'>
                    {authenticatedUser.name}
                </div>
                <div className='local-id'>
                    {authenticatedUser.id}
                </div>
            </div>
        </div>
    )
}