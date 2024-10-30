import React, { createContext, useContext, useEffect, useState } from 'react'

const ViewContext = createContext(null)

export const ViewProvider = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev)
    }

    let values = {
        isSidebarVisible,
        setIsSidebarVisible,
        toggleSidebar
    }

    return (
        <ViewContext.Provider value={values}>
            {children}
        </ViewContext.Provider>
    )
}

export const useView = () => useContext(ViewContext)