import React, { useState, useEffect } from 'react'
import '../styles/Sidebar.css'
import firebase from 'firebase/compat/app';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase-config.js'
import { addDoc, collection, onSnapshot, serverTimestamp, where, query, orderBy, doc, getDoc, getDocs, limit } from 'firebase/firestore'

import { getStreamName } from '../functions/data.js';

import Cookies from 'universal-cookie'
const cookies = new Cookies();

const Avatars = ({ stream_member_ids, authenticatedUser }) => {
    const [members, setMembers] = useState([]) // excludes the authenticated user

    useEffect(() => {
        const getPhotos = async () => {
            const usersRef = collection(db, 'users')
            const getUser = async (user_id) => {
                const q = query(usersRef, where("id_local", "==", user_id))
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map(doc => doc.data());
                return users[0]
            }
            const member_ids = stream_member_ids.filter(element => element !== authenticatedUser.id_local)
            const membersTemp = []
            for (let i = 0; i < member_ids.length; i++) {
                const memberTemp = await getUser(member_ids[i])
                membersTemp.push(memberTemp)
            }
            setMembers(membersTemp)
        }
        getPhotos()
    }, [stream_member_ids])

    return (
        <div className='stream-icon-container'>
            {members.length === 0 ? (<span className="material-symbols-outlined group-icon">
                groups
            </span>) : null}
            {members?.length > 0 ?
                (<img src={members[0]?.photo_url} alt="Avatar" className='sidebar-stream-item-pfp' />) : null}
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
                const q = query(usersRef, where("id_local", "==", user_id))
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
            <div className='sidebar-stream-item-pfp-container'>
                <Avatars stream_member_ids={stream.member_ids} authenticatedUser={authenticatedUser} />
            </div>
            <div className='sidebar-stream-item-text'>
                <div className='sidebar-stream-item-header' title={"Stream ID: " + stream.id}>
                    {getStreamName(stream.name)}
                </div>
                {lastMessageUser?.name ?
                    <div className='sidebar-stream-item-last-message'>
                        {lastMessageUser?.id_local === authenticatedUser.id_local ? 
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
            where("member_ids", "array-contains", authenticatedUser.id_local),
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