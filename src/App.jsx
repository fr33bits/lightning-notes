import React, { useEffect, useState, useRef } from 'react'
import './App.css' // somehow styles from other CSS files are also availible

import { auth, db } from './firebase-config.js'
import { doc, getDoc, query, where, getDocs, collection, onSnapshot } from 'firebase/firestore'

import { copyToClipboard } from './functions/utils.js'

import { Auth } from './components/Auth.jsx'
import { Stream } from './components/Stream.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { NewStream } from './components/NewStream.jsx'
import { Settings } from './components/Settings.jsx'


import Cookies from 'universal-cookie'
const cookies = new Cookies()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(cookies.get("auth-token"))
  const [authenticatedUser, setAuthenticatedUser] = useState(cookies.get("auth-user")) // user (ID) is stored in a cookie so as to not be lost on refresh
  // TODO: erase after log-out
  const [selectedStream, setSelectedStream] = useState(null)
  const [isStreamSelected, setIsStreamSelected] = useState(false)

  const [showSettings, setShowSettings] = useState(false)

  const [showStreamSettings, setShowStreamSettings] = useState(false)

  // !!! auth.currentUser.uid is not accessible here for some reason
  // const user_id = cookies.get("auth-user")
  // useEffect(() => { // other user data is fetched upon every refresh; this is also necessary because auth does not have all the details on a user
  //   const getSetUser = async () => {
  //     if (isAuthenticated) {
  //       const usersRef = collection(db, 'users')
  //       const q = query(usersRef, where("id", "==", user_id))
  //       const querySnapshot = await getDocs(q);
  //       const users = querySnapshot.docs.map(doc => doc.data());
  //       setAuthenticatedUser(users[0])
  //     }
  //   }
  //   getSetUser()
  // }, []) // only runs once and after refresh

  // !!! tried to have selected stream details update in real time but didn't get it working
  // useEffect(() => {
  //   if (selectedStream?.id) {
  //     const streamRef = doc(db, 'streams', selectedStream.id)
  
  //     const unsubscribe = onSnapshot(streamRef, (docSnapshot) => {
  //       if (docSnapshot.exists()) {
  //         setSelectedStream(docSnapshot.data())
  //         console.log("changed!")
  //       } else {
  //         console.log("The selected stream no longer exists!")
  //       }
  //     })
  //     return () => unsubscribe()
  //   }
  // });

  if (!isAuthenticated) {
    return (
      <div className="App">
        <Auth setIsAuthenticated={setIsAuthenticated} setAuthenticatedUser={setAuthenticatedUser} />
      </div>
    )
  } else {
    return (
      <div className="signedInView">
        <div className='sidebars'>
          <Sidebar
            setIsAuthenticated={setIsAuthenticated}
            setSelectedStream={setSelectedStream}
            setIsStreamSelected={setIsStreamSelected}
            authenticatedUser={authenticatedUser}
            setShowStreamSettings={setShowStreamSettings}
            className='sidebar'
          />
          <div className='sidebar sidebar-bottom'>
            <img src={authenticatedUser.photo_url} alt="" className='pfp' />
            <div style={{ display: 'inline-block' }} className='sidebar-bottom-text'>
              <div className='user-name'>
                {authenticatedUser.name}
              </div>
              <div
                className='local-id'
                title="Click to copy to clipboard"
                data-toggle="tooltip" data-placement="top"
                onClick={() => copyToClipboard(authenticatedUser.id)}
              >
                {authenticatedUser.id}
              </div>
            </div>
            {/* <span class="material-symbols-outlined" height='25'>
              settings
            </span> */}
          </div>
        </div>

        <div className='main_view'>
          {isStreamSelected
            ? <Stream selectedStream={selectedStream} setSelectedStream={setSelectedStream} authenticatedUser={authenticatedUser} showStreamSettings={showStreamSettings} setShowStreamSettings={setShowStreamSettings} />
            : <NewStream setSelectedStream={setSelectedStream} selectedStream={selectedStream} isStreamSelected={isStreamSelected} setIsStreamSelected={setIsStreamSelected} authenticatedUser={authenticatedUser} />
          }
        </div>
        {showSettings ? <Settings authenticatedUser={authenticatedUser} setShowSettings={setShowSettings} /> : null}
      </div >
    )
  }
}

export default App;
