import { useState, useEffect, useRef } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { getUser } from '../functions/firebaseCalls.js'
import { db } from '../firebase-config.js'

import { Note } from './Note.jsx'

import { useStream } from '../context/StreamContext.js'

export const StreamNotes = () => {
    const { selectedStream } = useStream()

    const notesRef = collection(db, 'notes')
    const [notes, setNotes] = useState([])

    const notesEndRef = useRef(null)

    useEffect(() => {
        const queryStreamMesssages = query(
            notesRef,
            where("stream_id", "==", selectedStream.id),
            orderBy('created_at')
        )
        const unsubscribe = onSnapshot(queryStreamMesssages, (snapshot) => {
            let queriedNotes = []
            snapshot.forEach((doc) => {
                queriedNotes.push({ ...doc.data(), id: doc.id }) // if the id already existed, it would not be added
            })
            setNotes(queriedNotes)
        })

        return () => unsubscribe() // TODO: poglej, zakaj je to pomembno
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