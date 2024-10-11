import React, { useState, useEffect } from 'react'
import '../styles/Sidebar.css'
import firebase from 'firebase/compat/app';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase-config.js'
import { addDoc, collection, onSnapshot, serverTimestamp, where, query, orderBy, doc, getDoc, getDocs, limit } from 'firebase/firestore'

import { getStreamName } from '../functions/data.js';

import Cookies from 'universal-cookie'
const cookies = new Cookies();

const StreamIcon = ({ reserved_stream, stream_name, stream_icon_uri, group_stream }) => {
    let icon
    if (reserved_stream) {
        if (stream_name === '_unsorted') {
            icon = <span className="material-symbols-outlined group-icon-google">scatter_plot</span>
        } else if (stream_name === '_inbox') {
            icon = <span className="material-symbols-outlined group-icon-google">inbox</span>
        } else if (stream_name === '_all') {
            icon = <span className="material-symbols-outlined group-icon-google">all_inbox</span>
        }
    } else if (stream_icon_uri) {
        icon = <img src={stream_icon_uri} className='sidebar-stream-item-icon' />
    } else if (group_stream) {
        icon = <span className="material-symbols-outlined group-icon-google">groups</span>
    } else {
        icon = <span className="material-symbols-outlined group-icon-google">folder</span>
    }

    return (
        <div className='stream-icon-container'>
            {icon}
        </div>
    )
}

const StreamListItem = ({ stream, setSelectedStream, setIsStreamSelected, authenticatedUser, setShowStreamSettings }) => {
    const [lastMessage, setLastMessage] = useState(null)
    const [lastMessageUser, setLastMessageUser] = useState(null)

    useEffect(() => {
        if (lastMessage) {
            const usersRef = collection(db, 'users')
            const getUser = async (user_id) => {
                const q = query(usersRef, where("id", "==", user_id))
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map(doc => doc.data());
                setLastMessageUser(users[0]);
            }
            getUser(lastMessage.sender_id)
        }
    }, [lastMessage])

    useEffect(() => {
        const getLastMessage = async () => {

            const messagesRef = collection(db, "messages")
            const queryMessagesList = query(
                messagesRef,
                where("stream_id", "==", stream.id),
                orderBy('created_at', "desc"),
                limit(1)
            )

            const unsubscribe = onSnapshot(queryMessagesList, async (snapshot) => {
                let queriedMessages = []
                snapshot.forEach((doc) => {
                    queriedMessages.push({ ...doc.data(), id: doc.id })
                })
                let queriedLastMessage = queriedMessages[0]
                setLastMessage(queriedLastMessage)
            })

            return () => unsubscribe()
        }
        getLastMessage()
    }, [stream]);

    const selectStream = () => {
        setSelectedStream(stream);
        setIsStreamSelected(true)
        setShowStreamSettings(false)
    }

    return (
        <div className='sidebar-stream-item' onClick={selectStream}>
            <div className='sidebar-stream-item-icon-container'>
                <StreamIcon
                    reserved_stream={stream.reserved}
                    stream_name={stream.name}
                    stream_icon_uri={stream.icon_uri}
                    group_stream={stream.member_ids > 1}
                />
            </div>
            <div className='sidebar-stream-item-text'>
                <div className='sidebar-stream-item-header' title={"Stream ID: " + stream.id}>
                    {getStreamName(stream.name)}
                </div>
                {lastMessageUser?.name ?
                    <div className='sidebar-stream-item-last-message'>
                        {lastMessageUser?.id === authenticatedUser.id ? 
                            'You' :
                            lastMessageUser?.name.split(' ')[0]
                        }
                        : {lastMessage?.text}
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

const StreamList = ({ setSelectedStream, setIsStreamSelected, authenticatedUser, setShowStreamSettings }) => {
    const streamsRef = collection(db, 'streams')
    const [streams, setStreams] = useState([])

    // !!! extremely bad performance memory-wise
    // onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //         const uid = user.uid;
    //         const queryStreamList = query(
    //             streamsRef,
    //             where("member_ids", "array-contains", uid),
    //         )

    //         const unsubscribe = onSnapshot(queryStreamList, (snapshot) => {
    //             let queriedStreams = []
    //             snapshot.forEach((doc) => {
    //                 queriedStreams.push({ ...doc.data(), id: doc.id })
    //             })
    //             setStreams(queriedStreams)
    //         })

    //         return () => unsubscribe()
    //     } else {
    //         console.log("User is signed out!!!")
    //     }
    // });

    // const getLastMessage = async (stream_id) => {
    //     const documentsRef = collection(db, "messages")
    //     const q = query(documentsRef, where("stream_id", "==", stream_id), orderBy('created_at'))
    //     const querySnapshot = await getDocs(q)
    //     const messages = querySnapshot.docs.map(doc => doc.data());
    //     return messages[0];
    // }

    useEffect(() => {
        const queryStreamList = query(
            streamsRef,
            where("member_ids", "array-contains", authenticatedUser.id),
        )

        const unsubscribe = onSnapshot(queryStreamList, (snapshot) => {
            let queriedStreams = []
            snapshot.forEach((doc) => {
                queriedStreams.push({ ...doc.data(), id: doc.id })
            })
            setStreams(queriedStreams)
        })

        return () => unsubscribe()
    }, [authenticatedUser]); // TODO: should really be changed every time a new message queue is created, no?

    return (
        <div className='sidebar-stream-item-list'>
            {streams.map((stream) => (
                <StreamListItem
                    key={stream.id}
                    stream={stream}
                    setSelectedStream={setSelectedStream}
                    setIsStreamSelected={setIsStreamSelected}
                    authenticatedUser={authenticatedUser}
                    setShowStreamSettings={setShowStreamSettings}
                />
            ))}
        </div>
    )
}

const Header = ({ setIsAuthenticated, setSelectedStream, setIsStreamSelected }) => {
    const logout = async () => { // async!!!
        await signOut(auth)
        cookies.remove("auth-token")
        setIsAuthenticated(false)
        setSelectedStream("")
        setIsStreamSelected(false)
    }

    return (
        <div className="sidebar-header gradient">
            <div className='sidebar-header-service-name service-name'>
                Lightning Notes
            </div>
            <div className="sidebar-header-button" onClick={() => setIsStreamSelected(false)} title='New stream'>
                <div className="sidebar-header-button-icon">
                    <span className="material-symbols-outlined">
                        add
                    </span>
                </div>
            </div>
            <div className="sidebar-header-button" title='Log out'>
                <div className="sidebar-header-button-icon" onClick={logout}>
                    <span className="material-symbols-outlined">
                        logout
                    </span>
                </div>
            </div>
        </div>
    )
}

export const Sidebar = ({ setIsAuthenticated, setSelectedStream, setIsStreamSelected, authenticatedUser, setShowStreamSettings }) => {
    return (
        <div className="sidebar sidebar-streamlist">
            <Header
                setIsAuthenticated={setIsAuthenticated}
                setSelectedStream={setSelectedStream}
                setIsStreamSelected={setIsStreamSelected}
            />
            <StreamList
                setSelectedStream={setSelectedStream}
                setIsStreamSelected={setIsStreamSelected}
                authenticatedUser={authenticatedUser}
                setShowStreamSettings={setShowStreamSettings}
            />
        </div>
    )
}