import { useState, useEffect } from 'react';
import { firestoreTimestampToDate } from '../functions/data'
import { getUser } from '../functions/firebaseCalls'

import { NoteActions } from './NoteActions'

import '../styles/Note.css'

export const Note = ({ note }) => {
    const [author, setAuthor] = useState(null)
    useEffect(() => {
        // TODO: this is not a listener (could have a listener for all different authors for all notes)
        async function fetchAuthor() {
            setAuthor(await getUser(note.author_id))
        }
        fetchAuthor()
    }, [])

    return (
        <div
            id={note.id}
            key={note.id}
            className='note-row'
        >
            {/* could also relatively easily be added below the note-bubble */}
            <div className='note-metadata'>
                <div className='note-metadata-timestamp'>
                    {firestoreTimestampToDate(note.created_at)}
                </div>
                <div
                    className='note-metadata-author-name'
                >
                    {author?.name}
                </div>
            </div>

            <div className='note-bubble'>
                <div className='note'>
                    <div
                        className='note-text'
                        title={'Note ID: ' + note.id}
                    >
                        {note.text}
                    </div>
                </div>
                <div className='note-bubble-spacer'></div>
                <div className="note-actions-container-container">
                    <div
                        className={`note-actions-container
                            ${note.favorite ? 'show-anyway' : ''}
                        `}
                    >
                        <NoteActions note={note} />
                    </div>
                </div>
            </div>
        </div>
    )
}