import { useEffect, useState, useRef } from 'react'

import { addDoc, collection, onSnapshot, serverTimestamp, where, query, orderBy, doc, getDocs, updateDoc, arrayRemove } from 'firebase/firestore'

import { auth, db } from '../firebase-config.js'

import { getStreamName } from '../functions/data.js'
import { getUser } from '../functions/firebaseCalls.js'

import '../styles/Stream.css'
import { Note } from './Note.jsx'

const StreamSettings = ({ selectedStream, setSelectedStream, setShowStreamSettings, authenticatedUser }) => { // takes a lot of things after NewStream.jsx
    const [name, setName] = useState(selectedStream.name)
    const [members, setMembers] = useState(selectedStream.member_ids)
    const [memberValidity, setMemberValidity] = useState([false]) // set to false just in case one of the users deleted their account while this window is open (though this would probably be caught upstream anyway)

    const generateBoolArray = (admin_ids, member_ids) => {
        let boolArray = []
        member_ids.forEach((member_id, index) => {
            boolArray.push(admin_ids.includes(member_id) ? true : false)
        })
        return boolArray
    }
    const [admins, setAdmins] = useState(generateBoolArray(selectedStream.admin_ids, selectedStream.member_ids))
    const [error, setError] = useState(null)

    const streamRef = doc(db, 'streams', selectedStream.id)
    const updateStream = async (event) => {
        event.preventDefault()
        const getAdminList = () => {
            let adminList = []
            admins.forEach((admin, index) => {
                if (admin)
                    adminList.push(members[index])
            })
            return adminList
        }
        const updatedStreamData = {
            name: name,
            member_ids: members,
            admin_ids: getAdminList()
        }

        updateDoc(streamRef, updatedStreamData)
            .then(() => {
                // TODO: to posodabljanje ni elegantno in bi se moglo izvesti upstream
                let prevSelectedStream = { ...selectedStream }
                prevSelectedStream.name = name
                prevSelectedStream.member_ids = members
                prevSelectedStream.admin_ids = getAdminList()
                setSelectedStream(prevSelectedStream)
                setShowStreamSettings(false)
            })
            .catch((error) => {
                setError(error)
            })
    }

    const usersRef = collection(db, 'users')
    useEffect(() => { // validates for all members at once
        const validateMembers = async (members) => {
            const newMemberValidity = Array(members.length).fill(false)
            for (let i = 0; i < members.length; i++) {
                const checkValidityForSpecificMember = async (user_id_local) => {
                    // check the user isn't the currently authenticated user
                    if (authenticatedUser.id_local === user_id_local && memberAlreadyAdded(user_id_local, i)) return false

                    // check that the user has already been previously entered (the first instance of the user returns as valid)
                    for (let j = 0; j < i; j++) {
                        if (members[i] === members[j]) {
                            return false
                        }
                    }

                    // check that the user actually exists in the system
                    const q = query(usersRef, where("id_local", "==", user_id_local))
                    const querySnapshot = await getDocs(q)
                    const users = querySnapshot.docs.map(doc => doc.data())
                    return users.length > 0
                }
                newMemberValidity[i] = await checkValidityForSpecificMember(members[i])
            }
            setMemberValidity(newMemberValidity)
        }
        validateMembers(members)
    }, [members]) // ? so kakšni problemi zaradi končne spremembe identifikatorjev

    const formComplete = () => {
        return name.length > 0 && memberValidity.every(value => value === true) && !admins.every(value => value === false)
    }

    const memberAlreadyAdded = (member, index) => {
        if (member === "") return null

        for (let j = 0; j < index; j++) {
            if (member === members[j]) {
                return true
            }
        }
        return null
    }

    return (
        <div className='card-container card-container-float card-container-blur' onClick={(e) => { if (e.target !== e.currentTarget) return; setShowStreamSettings(false) }}>
            <div className='card' onClick={() => null}>
                {!selectedStream.admin_ids.includes(authenticatedUser.id_local) ?
                    <p className='caption' style={{ color: 'red', textAlign: 'center' }}>You are not an admin of this stream. You can only view but not change the stream name and its members.</p>
                    : null
                }
                <form>
                    <div className='form-field'>
                        <label htmlFor='streamName'>Stream name</label>
                        <input
                            name='streamName'
                            className='form-field-input'
                            placeholder='Stream name'
                            defaultValue={selectedStream.name}
                            onChange={(e) => { setName(e.target.value) }}
                            disabled={!selectedStream.admin_ids.includes(authenticatedUser.id_local)}
                        />
                    </div>
                    <div>
                        <div>
                            <h4>Members</h4>
                        </div>
                        <div>
                            <p className='caption'>You cannot remove yourself as a member of this stream here. If you want to remove yourself from this stream, please use the 'Leave stream' button.</p>
                            {selectedStream.admin_ids.includes(authenticatedUser.id_local) ?
                                <div>
                                    <p className='caption'>You cannot remove all other members from the stream as the stream must have at least two members. All other members can however leave the stream themselves.</p>
                                    <p className='caption'>Using the fields below you can also add other users to the stream using their ID (which ends with an @ sign followed by the service name).</p>
                                    <p className='caption'>Lightning Notes uses randomly generated unique identifiers for addressing in order to prevent spam. To add a user to the stream, ask them to provide you their identifier, which is displayed in the bottom left corner.</p>
                                </div>
                                : null
                            }
                        </div>
                        <div>
                            <div>
                                {members.map((member, index) => (
                                    <div key={index} className='form-field'>
                                        <label htmlFor={'user' + index}>
                                            User {index + 1}
                                            {member === authenticatedUser.id_local && !memberAlreadyAdded(member, index) ? <span className='pill pill-you'>You</span> : null}
                                            {selectedStream.admin_ids.includes(member) && !memberAlreadyAdded(member, index) ? <span className='pill pill-admin'>Admin</span> : null}
                                        </label>
                                        {/* TODO: fix the fact that pressing enter creates more null elements: likely simulates button press? */}
                                        {/* A separate div is needed below the label, otherwise the icon won't behave like an inline-blook */}
                                        <div className='form-field-input-container'>
                                            <input
                                                name={'user' + index}
                                                className={memberValidity[index] ? 'field-valid form-field-input' : 'field-invalid form-field-input'}
                                                placeholder='Global user ID'
                                                value={member}
                                                onChange={(e) => {
                                                    const newMembers = [...members] // spread needed to make sure that the array is actually copied instead of pasting a reference
                                                    newMembers[index] = e.target.value
                                                    setMembers(newMembers)
                                                }}
                                                disabled={
                                                    !selectedStream.admin_ids.includes(authenticatedUser.id_local) ||
                                                    member === authenticatedUser.id_local && !memberAlreadyAdded(member, index)
                                                }
                                            />
                                            {selectedStream.admin_ids.includes(authenticatedUser.id_local) ? admins[index] ?
                                                <div
                                                    className='form-field-input-side-button-container'
                                                    title="Remove admin privileges"
                                                    onClick={() => setAdmins((prevAdmins) => prevAdmins.map((admin, i) => (i === index ? false : admin)))}>
                                                    <span className="material-symbols-outlined">
                                                        remove_moderator
                                                    </span>
                                                </div> :
                                                <div
                                                    className='form-field-input-side-button-container'
                                                    title="Make user an admin"
                                                    onClick={() => setAdmins((prevAdmins) => prevAdmins.map((admin, i) => (i === index ? true : admin)))}>
                                                    <span className="material-symbols-outlined">
                                                        add_moderator
                                                    </span>
                                                </div>
                                                : null
                                            }
                                            {selectedStream.admin_ids.includes(authenticatedUser.id_local) && (member !== authenticatedUser.id_local || memberAlreadyAdded(member, index)) ?
                                                <div
                                                    className='form-field-input-side-button-container'
                                                    title="Remove user"
                                                    onClick={() => {
                                                        setMembers([...members.slice(0, index), ...members.slice(index + 1)])
                                                        setAdmins([...admins.slice(0, index), ...admins.slice(index + 1)]) // !!! ne začne pri 1
                                                    }}
                                                >
                                                    <div
                                                        style={{ display: members.length > 0 ? 'inline-block' : 'none' }}
                                                        className="material-symbols-outlined"

                                                    >
                                                        cancel
                                                    </div>
                                                </div>
                                                : null
                                            }
                                        </div>
                                        {memberAlreadyAdded(member, index) ?
                                            member === authenticatedUser.id_local ?
                                                <p className='caption' style={{ color: 'red' }}>You cannot add yourself!</p> :
                                                <p className='caption' style={{ color: 'red' }}>This user has already been added above!</p>
                                            : null
                                        }
                                    </div>
                                ))}
                            </div>
                            {admins.every(value => value === false) ? <p className='caption' style={{ color: 'red', textAlign: 'center' }}>The stream must have at least one admin!</p> : null}
                            {selectedStream.admin_ids.includes(authenticatedUser.id_local) ?
                                <div className='form-button'>
                                    {/* !!! For some reason this is already pushed to the list of members even without the button being clicked */}
                                    <button type='button' onClick={(e) => { // setting the button type to 'button' (instead of not setting the button type, which defaults to submit) has the same effect as e.preventDefault()
                                        let newMembers = [...members] // spread necessary, otherwise new members don't show up (see above)
                                        newMembers.push("");
                                        setMembers(newMembers)

                                        let newAdmins = [...admins]
                                        newAdmins.push(false);
                                        setAdmins(newAdmins)
                                    }}
                                    >
                                        Add member
                                    </button>
                                </div>
                                : null
                            }
                        </div>
                    </div>
                    {!selectedStream.admin_ids.includes(authenticatedUser.id_local) ?
                        <div className='form-button'>
                            <button type='button' onClick={() => setShowStreamSettings(false)}>Close</button>
                        </div>
                        :
                        <div>
                            {error ? <p className='form-error-message'>{error}</p> : null}
                            <div className='form-button'>
                                <button type='submit' disabled={!formComplete()} onClick={(e) => { updateStream(e) }}>Save</button>
                            </div>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}

export const Stream = ({ selectedStream, setSelectedStream, authenticatedUser, setShowStreamSettings, showStreamSettings }) => {
    const messagesRef = collection(db, 'messages')
    const [messages, setMessages] = useState([])

    const [newMessage, setNewMessage] = useState("")

    const messagesEndRef = useRef(null)

    useEffect(() => {
        const queryStreamMesssages = query(
            messagesRef,
            where("stream_id", "==", selectedStream.id),
            orderBy('created_at')
        )
        const unsubscribe = onSnapshot(queryStreamMesssages, (snapshot) => {
            let queriedMessages = []
            snapshot.forEach((doc) => {
                queriedMessages.push({ ...doc.data(), id: doc.id }) // if the id already existed, it would not be added
            })
            setMessages(queriedMessages)
        })

        return () => unsubscribe() // TODO: poglej, zakaj je to pomembno
    }, [selectedStream])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSubmit = async (event) => {
        // !!! console.log("tuki dela auth:" + auth.currentUser.uid) (in res dela)
        event.preventDefault()
        if (newMessage === "") {
            return
        } else {
            await addDoc(messagesRef, {
                text: newMessage,
                created_at: serverTimestamp(),
                sender_id: authenticatedUser.id_local,
                stream_id: selectedStream.id
            })
            setNewMessage("")
        }
    }

    const leaveStream = async () => {
        const docRef = doc(db, "streams", selectedStream.id)
        const confirmation = window.confirm(`Are you sure you want to exit the stream "${selectedStream.name}"?`)
        if (confirmation) {
            try {
                await updateDoc(docRef, {
                    member_ids: arrayRemove(authenticatedUser.id_local),
                    admin_ids: arrayRemove(authenticatedUser.id_local)
                })
            } catch (error) {
                console.error("Error leaving stream: ", error)
            }
        }
    }

    return (
        <div className="stream">
            {showStreamSettings ?
                <StreamSettings
                    selectedStream={selectedStream}
                    setSelectedStream={setSelectedStream}
                    setShowStreamSettings={setShowStreamSettings}
                    authenticatedUser={authenticatedUser}
                /> :
                null
            }
            <div className='header-background'></div>
            <div className="header">
                <div className='header-item' style={{ float: 'left' }}>
                    <span className="material-symbols-outlined leave-stream-icon" title="Add user to stream" onClick={() => setShowStreamSettings(true)}>
                        settings
                    </span>
                </div>
                <div className="header-item stream-name">{getStreamName(selectedStream.name)}</div>
                {/* TODO: order of these float: right divs unclear */}
                {
                    selectedStream.reserved ? null :
                        <div className='header-item' style={{ float: 'right' }}>
                            <span className="material-symbols-outlined leave-stream-icon" title="Leave stream" onClick={() => leaveStream()}>
                                group_remove
                            </span>
                        </div>
                }
            </div>

            {/* Message */}
            <div className='messages-container'>
                <div className='messages'>
                    {messages.map((message, index) => (
                        <Note 
                            key={index}
                            message={message}
                            index={index}
                            author={getUser(message.sender_id)}
                        />
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
            </div>

            {/* Message form */}
            <div className='new-message-form-container-background'>
                <div className='new-message-form-container'>
                    <form onSubmit={handleSubmit} className="new-message-form">
                        <input
                            onChange={(e) => setNewMessage(e.target.value)}
                            value={newMessage}
                            className="new-message-input"
                            placeholder="Type a note..."
                        />
                        <button
                            type="submit"
                            className="add-note-button"
                            title="Add note"
                            style={{ padding: '0px 12px', fontSize: '25px' }}
                        >
                            {/* <span class="material-symbols-outlined">add</span> */}
                            +
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}