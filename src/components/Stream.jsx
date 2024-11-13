import { StreamHeader } from './StreamHeader.jsx'
import { StreamDetails } from './StreamDetails.jsx'
import { StreamNotes } from './StreamNotes.jsx'
import { NoteComposer } from './NoteComposer.jsx'

import '../styles/Stream.css'

import { useStream } from '../context/StreamContext.js'

export const Stream = () => {
    const { selectedStream, showStreamSettings } = useStream()

    return (
        <div className="stream">
            {showStreamSettings ?
                <StreamDetails
                    mode="settings"
                /> :
                null
            }
            <StreamHeader />
            <StreamNotes />
            {!selectedStream.pseudo ? <NoteComposer /> : null}
        </div>
    )
}