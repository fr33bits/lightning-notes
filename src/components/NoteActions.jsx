import { useState } from 'react';

import '../styles/NoteActions.css'

export const NoteActions = ({ note }) => {
    const [editingMode, setEditingMode] = useState(false)

    return (
        <div className="note-actions">
            <div className='note-action-container'>
                <div className="note-action note-action-favorite">
                    <span
                        className="material-symbols-outlined">
                        delete
                    </span>
                </div>
            </div>
            <div className={`note-action-container ${note.favorite ? 'show-anyway' : ''}`}>
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