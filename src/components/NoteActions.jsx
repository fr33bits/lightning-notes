import { useState } from 'react';

import { deleteNote, setNoteFavorite } from '../functions/firebaseCalls.js'

import '../styles/NoteActions.css'

export const NoteActions = ({ note }) => {
    const [editingMode, setEditingMode] = useState(false)

    return (
        <div className="note-actions">
            <div className='note-action-container' onClick={() => deleteNote(note.id)}>
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