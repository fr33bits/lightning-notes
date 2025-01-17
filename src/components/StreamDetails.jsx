import { useState, useEffect } from 'react'
import { addDoc, collection, onSnapshot, serverTimestamp, where, query, orderBy, doc, getDocs, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase-config'

import { useUser } from '../context/UserContext'
import { useStream } from '../context/StreamContext'

export const StreamDetails = ({ mode }) => { // takes a lot of things after NewStream.jsx
    const { user } = useUser()
    const { selectedStream, setSelectedStream, setShowStreamSettings } = useStream()

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
                const checkValidityForSpecificMember = async (user_id) => {
                    // check the user isn't the currently authenticated user
                    if (user.id === user_id && memberAlreadyAdded(user_id, i)) return false

                    // check that the user has already been previously entered (the first instance of the user returns as valid)
                    for (let j = 0; j < i; j++) {
                        if (members[i] === members[j]) {
                            return false
                        }
                    }

                    // check that the user actually exists in the system
                    const q = query(usersRef, where("id", "==", user_id))
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
                {!selectedStream.admin_ids.includes(user.id) ?
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
                            disabled={!selectedStream.admin_ids.includes(user.id)}
                        />
                    </div>
                    <div>
                        <div>
                            <h4>Members</h4>
                        </div>
                        <div>
                            <p className='caption'>You cannot remove yourself as a member of this stream here. If you want to remove yourself from this stream, please use the 'Leave stream' button.</p>
                            {selectedStream.admin_ids.includes(user.id) ?
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
                                            {member === user.id && !memberAlreadyAdded(member, index) ? <span className='pill pill-you'>You</span> : null}
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
                                                    !selectedStream.admin_ids.includes(user.id) ||
                                                    member === user.id && !memberAlreadyAdded(member, index)
                                                }
                                            />
                                            {selectedStream.admin_ids.includes(user.id) ? admins[index] ?
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
                                            {selectedStream.admin_ids.includes(user.id) && (member !== user.id || memberAlreadyAdded(member, index)) ?
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
                                            member === user.id ?
                                                <p className='caption' style={{ color: 'red' }}>You cannot add yourself!</p> :
                                                <p className='caption' style={{ color: 'red' }}>This user has already been added above!</p>
                                            : null
                                        }
                                    </div>
                                ))}
                            </div>
                            {admins.every(value => value === false) ? <p className='caption' style={{ color: 'red', textAlign: 'center' }}>The stream must have at least one admin!</p> : null}
                            {selectedStream.admin_ids.includes(user.id) ?
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
                    {!selectedStream.admin_ids.includes(user.id) ?
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