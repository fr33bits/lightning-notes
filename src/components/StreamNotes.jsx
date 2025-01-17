import { useState, useEffect, useRef } from 'react'
import { getStreamNotes, getAllUserNotes, getAllUserTrashNotes } from '../functions/firebaseCalls.js'

import { Note } from './Note.jsx'

import { useStream } from '../context/StreamContext.js'
import { useUser } from '../context/UserContext.js'

import '../styles/StreamNotes.css'

export const StreamNotes = () => {
    const { selectedStream } = useStream()
    const { user } = useUser()
    const [notes, setNotes] = useState([])

    const notesEndRef = useRef(null)

    useEffect(() => {
        let unsubscribeFunction // this prevents, for example, the getAllUserNotes() function from being triggered again after the _all (pseudo)stream is deselected and a new note is created in a different stream
        if (selectedStream.pseudo && selectedStream.name === "_all") {
            unsubscribeFunction = getAllUserNotes(user.id, setNotes)
        } else if (selectedStream.pseudo && selectedStream.name === "_trash") {
            unsubscribeFunction = getAllUserTrashNotes(user.id, setNotes)
        } else {
            unsubscribeFunction = getStreamNotes(selectedStream.id, setNotes)
        }
        return unsubscribeFunction
    }, [selectedStream])

    useEffect(() => {
        if (notesEndRef.current) {
            notesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [notes]);

    return (
        <div
            className={`notes-container
                ${selectedStream.pseudo ? '' : 'notes-container-composer-padding'}
            `}
        >
            <div className="notes">
                <div className="notes-frame">
                    {notes.map((note, index) => (
                        <Note
                            key={index}
                            note={note}
                        />
                    ))}
                </div>
                <div ref={notesEndRef}></div>
            </div>
        </div>
    )
}