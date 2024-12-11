import { useState } from 'react';

import { getPriorityLevelName } from '../functions/data.js'
import { markNoteAsInTrash, deleteNote, setNoteFavorite, setNotePriority } from '../functions/firebaseCalls.js'

import '../styles/NoteActions.css'

export const NoteActions = ({ note }) => {
    const [textEditingMode, setTextEditingMode] = useState(false)
    const [priorityEditingMode, setPriorityEditingMode] = useState(false)

    const trashDeleteAction = () => {
        if (note.trash) {
            deleteNote(note.id)
        } else {
            markNoteAsInTrash(note.id)
        }
    }

    const changePriority = (priority) => {
        setPriorityEditingMode(false)
        if (priority !== note.priority) {
            setNotePriority(note.id, priority)
        }
    }

    // Views
    let view
    if (priorityEditingMode) {
        view = (
            <>
                <div
                    className={`note-action-container show-anyway`}
                    onClick={() => changePriority(0)}
                    title="Remove priority"
                >
                    <div className="note-action">
                        <span
                            className={
                                `material-symbols-outlined
                                priority-none
                                ${note.priority == 0 ? 'priority-none-highlight icon-filled' : ''}`
                            }
                        >
                            priority_high
                        </span>
                    </div>
                </div >
                <div
                    className={`note-action-container show-anyway`}
                    onClick={() => changePriority(1)}
                    title={`${getPriorityLevelName(1, true)} priority`}
                >
                    <div className="note-action">
                        <span
                            className={
                                `material-symbols-outlined
                                priority-low
                                ${note.priority == 1 ? 'priority-low-highlight icon-filled' : ''}`
                            }
                        >
                            priority_high
                        </span>
                    </div>
                </div >
                <div
                    className={`note-action-container show-anyway`}
                    onClick={() => changePriority(2)}
                    title={`${getPriorityLevelName(2, true)} priority`}
                >
                    <div className="note-action">
                        <span
                            className={
                                `material-symbols-outlined
                                priority-medium
                                ${note.priority == 2 ? 'priority-medium-highlight icon-filled' : ''}`
                            }
                        >
                            priority_high
                        </span>
                    </div>
                </div >
                <div
                    className={`note-action-container show-anyway`}
                    onClick={() => changePriority(3)}
                    title={`${getPriorityLevelName(3, true)} priority`}
                >
                    <div className="note-action">
                        <span
                            className={
                                `material-symbols-outlined
                                priority-high
                                ${note.priority == 3 ? 'priority-high-highlight icon-filled' : ''}`
                            }
                        >
                            priority_high
                        </span>
                    </div>
                </div >
            </>
        )
    } else if (textEditingMode) {
        view = (
            <>

            </>
        )
    } else { // not in any editing mode
        view = (
            <>
                {/* DELETE */}
                <div
                    className='note-action-container'
                    onClick={trashDeleteAction}
                    title={note.trash ? 'Permanently delete note' : 'Move note to trash'}
                >
                    <div className="note-action">
                        <span
                            className="material-symbols-outlined">
                            delete
                        </span>
                    </div>
                </div>

                {/* PRIORITY */}
                <div
                    className={`note-action-container ${note.priority ? 'show-anyway' : ''}`}
                    onClick={() => setPriorityEditingMode(true)}
                    title={note.priority ? `${getPriorityLevelName(note.priority, true)} priority` : 'Set priority'}
                >
                    <div className="note-action">
                        <span
                            className={
                                `material-symbols-outlined
                                priority-${getPriorityLevelName(note.priority, false)}
                                ${note.priority
                                    ? `priority-${getPriorityLevelName(note.priority, false)}-highlight`
                                    : ''
                                }
                                ${note.priority ? 'icon-filled' : ''}`
                            }
                        >
                            priority_high
                        </span>
                    </div>
                </div>

                {/* FAVORITE */}
                <div
                    className={`note-action-container ${note.favorite ? 'show-anyway' : ''}`}
                    onClick={() => setNoteFavorite(note.id, !note.favorite)}
                    title={note.favorite ? 'Unfavorite' : 'Favorite'}
                >
                    <div className="note-action">
                        <span
                            className={`material-symbols-outlined
                        ${note.favorite ? 'icon-filled favorite-highlight' : ''}
                    `}>
                            star
                        </span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="note-actions">
            {view}
        </div>
    )
}