import { useState, useEffect } from "react"
import { query, where, orderBy, limit, onSnapshot, collection } from "firebase/firestore"
import { db } from "../firebase-config"

import { getStreamName } from "../functions/data"
import { lastNoteInStream, getUser } from "../functions/firebaseCalls"

import { useUser } from "../context/UserContext"
import { useStream } from "../context/StreamContext"

import { StreamIcon } from "./StreamIcon"

const notesRef = collection(db, "notes")

export const StreamListItem = ({ stream, reservedStream, pseudoStream, pseudoStreamName }) => {
    const values = useStream()
    const selectedStream = values?.selectedStream || null
    const setSelectedStream = values.setSelectedStream
    const { user } = useUser();

    const [lastNote, setLastNote] = useState(null)

    useEffect(() => {
        if (!pseudoStream) {
            // console.log("TRIGGERERD!")
            lastNoteInStream(stream.id, setLastNote)
        }
    }, [stream]); // ! removed [stream]

    // useEffect(() => {
    //     console.log("lastNote: ", lastNote)
    // }, [lastNote])

    const selectStream = () => {
        setSelectedStream(stream);
    }

    return (
        <div className='sidebar-stream-item' onClick={selectStream}>
            <div className='sidebar-stream-item-icon-container'>
                <StreamIcon
                    reserved_stream={reservedStream}
                    stream_name={pseudoStreamName ?? stream.name}
                    stream_icon_uri={stream?.icon_uri}
                    group_stream={stream?.member_ids > 1}
                />
            </div>
            <div className='sidebar-stream-item-text'>
                <div className='sidebar-stream-item-header' title={"Stream ID: " + stream?.id}>
                    {getStreamName(pseudoStreamName ?? stream.name)}
                </div>
                {lastNote ?
                    <div className='sidebar-stream-item-last-note'>
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