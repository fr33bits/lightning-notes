import { useState } from 'react'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../firebase-config'

import { useUser } from '../context/UserContext'
import { useStream } from '../context/StreamContext'

const messagesRef = collection(db, 'messages')

export const NoteComposer = () => {
    const { user } = useUser()
    const values = useStream()
    const selectedStream = values?.selectedStream || null

    const [newMessage, setNewMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (newMessage === "") {
            return
        } else {
            await addDoc(messagesRef, {
                text: newMessage,
                created_at: serverTimestamp(),
                author_id: user.id,
                stream_id: selectedStream.id
            })
            setNewMessage("")
        }
    }

    return (
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
    )
}