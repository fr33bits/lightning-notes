import { useState } from 'react';

import { markNoteAsInTrash, deleteNote, setNoteFavorite } from '../functions/firebaseCalls.js'

import '../styles/NoteActions.css'

export const NoteActions = ({ note }) => {
    const [editingMode, setEditingMode] = useState(false)

    const trashDeleteAction = () => {
        if (note.trash) {
            deleteNote(note.id)
        } else {
            markNoteAsInTrash(note.id)
        }
    }

    return (
        <div className="note-actions">
            <div className='note-action-container' onClick={trashDeleteAction}>
                <div className="note-action note-action-favorite">
                    <span
                        className="material-symbols-outlined">
                        delete
                    </span>
                </div>
            </div>
            <div
                className={`note-action-container ${note.favorite ? 'show-anyway' : ''}`}
                onClick={() => setNoteFavorite(note.id, !note.favorite)}
            >
                <div className="note-action note-action-favorite">
                    <span
                        className={`material-symbols-outlined
                        ${note.favorite ? 'icon-filled favorite-highlight' : ''}
                    `}>
                        star
                    </span>
                </div>
            </div>
        </div>
    )
}