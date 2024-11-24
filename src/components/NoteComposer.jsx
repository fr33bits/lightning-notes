import { useState } from 'react'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../firebase-config'

import { useUser } from '../context/UserContext'
import { useStream } from '../context/StreamContext'

import '../styles/NoteComposer.css'

const notesRef = collection(db, 'notes')

export const NoteComposer = () => {
    const { user } = useUser()
    const {selectedStream} = useStream()

    const [newNote, setNewNote] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (newNote === "") {
            return
        } else {
            await addDoc(notesRef, {
                text: newNote,
                created_at: serverTimestamp(),
                author_id: user.id,
                stream_id: selectedStream.id
            })
            setNewNote("")
        }
    }

    return (
        <>
            <div className='new-note-form-container-background'></div>
            <div className='new-note-form-container'>
                <form onSubmit={handleSubmit} className="new-note-form">
                    <input
                        onChange={(e) => setNewNote(e.target.value)}
                        value={newNote}
                        className="new-note-input"
                        placeholder="Type a note..."
                    />
                    <button
                        type="submit"
                        className="add-note-button"
                        title="Add note"
                        style={{ padding: '0px 12px', fontSize: '25px' }}
                    >
                        {/* <span className="material-symbols-outlined">add</span> */}
                        +
                    </button>
                </form>
            </div>
        </>
    )
}