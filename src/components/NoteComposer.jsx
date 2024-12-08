import { useState } from 'react'

import { useUser } from '../context/UserContext'
import { useStream } from '../context/StreamContext'

import { createNote } from '../functions/firebaseCalls'

import '../styles/NoteComposer.css'

export const NoteComposer = () => {
    const { user } = useUser()
    const {selectedStream} = useStream()

    const [noteText, setNoteText] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        const result = await createNote(noteText, user.id, selectedStream.id)
        if (result) {
            setNoteText("")
        }
    }

    return (
        <>
            <div className='new-note-form-container-background'></div>
            <div className='new-note-form-container'>
                <form onSubmit={handleSubmit} className="new-note-form">
                    <input
                        onChange={(e) => setNoteText(e.target.value)}
                        value={noteText}
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