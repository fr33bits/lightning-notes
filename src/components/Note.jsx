import { useState, useEffect } from 'react';
import { firestoreTimestampToDate } from '../functions/data'
import { getUser } from '../functions/firebaseCalls'

import '../styles/Note.css'

export const Note = ({note}) => {
    const [author, setAuthor] = useState(null)
    useEffect(() => {
        // TODO: this is not a listener (could have a listener for all different authors for all notes)
        async function fetchAuthor() {
            setAuthor(await getUser(note.author_id))
        }
        fetchAuthor()
    }, [])

    return (
        <div className='note-row'>
            <div
                id={note.id}
                key={note.id}
            >
                <div className='note-metadata-row'>
                    <div className='note-timestamp'>
                        {firestoreTimestampToDate(note.created_at)}
                    </div>
                    <div
                        className='note-author-name'
                    >
                        {author?.name}
                    </div>
                </div>
                <div
                    className='note-text'
                    title={'Note ID: ' + note.id}
                >
                    {/* Style needed to push the note text to the right even though the parent div is already pushed to the right */}
                    {note.text}
                </div>
                {/* <div className='note-timestamp'>
                        {note?.created_at?.seconds ? getDate(note.created_at.seconds) : null}
                    </div> */}
            </div>
        </div>
    )
}