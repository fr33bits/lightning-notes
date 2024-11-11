import { useState, useEffect, useRef } from 'react'
import { getStreamNotes, getUser, getAllUserNotes, getAllUserDeletedNotes } from '../functions/firebaseCalls.js'

import { Note } from './Note.jsx'

import { useStream } from '../context/StreamContext.js'
import { useUser } from '../context/UserContext.js'

export const StreamNotes = () => {
    const { selectedStream } = useStream()
    const { user } = useUser()
    const [notes, setNotes] = useState([])

    const notesEndRef = useRef(null)

    useEffect(() => {
        if (!selectedStream.pseudo) {
            getStreamNotes(selectedStream.id, setNotes)
        } else if (selectedStream.name === "_all") {
            getAllUserNotes(user.id, setNotes)
        } else if (selectedStream.name === "_trash") {
            getAllUserDeletedNotes(user.id, setNotes)
        }
    }, [selectedStream])

    useEffect(() => {
        if (notesEndRef.current) {
            notesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [notes]);

    return (
        <div className='notes-container'>
            <div className='notes'>
                {notes.map((note, index) => (
                    <Note
                        key={index}
                        note={note}
                        index={index}
                        author={getUser(note.author_id)}
                    />
                ))}
                <div ref={notesEndRef}></div>
            </div>
        </div>
    )
}