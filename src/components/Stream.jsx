import { StreamHeader } from './StreamHeader.jsx'
import { StreamDetails } from './StreamDetails.jsx'
import { StreamNotes } from './StreamNotes.jsx'
import { NoteComposer } from './NoteComposer.jsx'

import '../styles/Stream.css'

export const Stream = ({ selectedStream, setSelectedStream, setShowStreamSettings, showStreamSettings }) => {
    return (
        <div className="stream">
            {showStreamSettings ?
                <StreamDetails
                    mode="settings"
                    selectedStream={selectedStream}
                    setSelectedStream={setSelectedStream}
                    setShowStreamSettings={setShowStreamSettings}
                /> :
                null
            }
            <StreamHeader selectedStream={selectedStream} />
            <StreamNotes selectedStream={selectedStream} />
            <NoteComposer selectedStream={selectedStream} />
        </div>
    )
}