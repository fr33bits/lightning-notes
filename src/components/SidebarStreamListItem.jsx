import { useState, useEffect } from "react"

import { getStreamName } from "../functions/data"
import { lastNoteInStream, getUser } from "../functions/firebaseCalls"

import { useUser } from "../context/UserContext"
import { useStream } from "../context/StreamContext"

import { StreamIcon } from "./StreamIcon"

import '../styles/SidebarStreamListItem.css'

export const StreamListItem = ({ stream, reservedStream, pseudoStream, pseudoStreamName }) => {
    const values = useStream()
    const selectedStream = values?.selectedStream || null
    const setSelectedStream = values.setSelectedStream
    const { user } = useUser();

    const [lastNote, setLastNote] = useState(null)

    useEffect(() => {
        if (!pseudoStream) {
            lastNoteInStream(stream.id, setLastNote)
        }
    }, []);

    const selectStream = () => {
        setSelectedStream(stream ?? { name: pseudoStreamName, reserved: true, pseudo: true});
    }

    return (
        <div
            className={`sidebar-stream_list-item ${
                selectedStream &&
                ((!selectedStream.pseudo && selectedStream.id === stream?.id) || 
                (selectedStream.pseudo && selectedStream.name === pseudoStreamName)) ?
                'sidebar-stream_list-item-selected' : ''}`}
            onClick={selectStream}
        >
            <div className='sidebar-stream_list-item-icon-container'>
                <StreamIcon
                    reserved_stream={reservedStream}
                    stream_name={pseudoStreamName ?? stream.name}
                    stream_icon_uri={stream?.icon_uri}
                    group_stream={stream?.member_ids > 1}
                />
            </div>
            <div className='sidebar-stream_list-item-text'>
                <div className='sidebar-stream_list-item-header' title={stream?.id ? "Stream ID: " + stream.id : null}>
                    {getStreamName(pseudoStreamName ?? stream.name)}
                </div>
                {lastNote ?
                    <div className='sidebar-stream_list-item-last-note'>
                        {lastNote?.author?.id === user.id ?
                            null :
                            lastNote?.author?.name.split(' ')[0] + ": "
                        }
                        {lastNote?.text}
                    </div>
                    : null
                }
            </div>
        </div>
    )
}