import React, { createContext, useContext, useEffect, useState } from 'react'

const StreamContext = createContext(null)

export const StreamProvider = ({ children }) => {
    const [selectedStream, setSelectedStream] = useState(null)
    const [showStreamSettings, setShowStreamSettings] = useState(false)

    useEffect(() => {
        if (!selectedStream) { // if a stream is deselected, stream settings are automatically hidden
            setShowStreamSettings(false)
        }
    }, [selectedStream])

    let values = {
        selectedStream,
        setSelectedStream,
        showStreamSettings,
        setShowStreamSettings
    }

    return (
        <StreamContext.Provider value={values}>
            {children}
        </StreamContext.Provider>
    )
}

export const useStream = () => useContext(StreamContext)