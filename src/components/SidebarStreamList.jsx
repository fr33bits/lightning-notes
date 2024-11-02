import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase-config';

import { useUser } from "../context/UserContext";

import { StreamListItem } from './SidebarStreamListItem';
import { separateStreams } from '../functions/data';

export const StreamList = ({ selectedStream, setSelectedStream }) => {
    const { user, loading } = useUser();

    const streamsRef = collection(db, 'streams')
    const [userDefinedStreams, setUserDefinedStreams] = useState([])
    const [inboxStream, setInboxStream] = useState(null)
    const [unsortedStream, setUnsortedStream] = useState(null)
    const [universalClipboardStream, setUniversalClipboardStream] = useState(null)

    useEffect(() => {
        const queryStreamList = query(
            streamsRef,
            where("member_ids", "array-contains", user.id),
        )

        const unsubscribe = onSnapshot(queryStreamList, (snapshot) => {
            let queriedStreams = []
            snapshot.forEach((doc) => {
                queriedStreams.push({ ...doc.data(), id: doc.id })
            })

            const { queriedUserDefinedStreams, queriedInboxStream, queriedUnsortedStream, queriedUniversalClipboardStream } = separateStreams(queriedStreams)
            setUserDefinedStreams(queriedUserDefinedStreams)
            setInboxStream(queriedInboxStream)
            setUnsortedStream(queriedUnsortedStream)
            setUniversalClipboardStream(queriedUniversalClipboardStream)

        })

        return () => unsubscribe()
    }, []);

    return (
        <div className='sidebar-stream-list'>
            {/* RESERVED STREAMS: _unsorted, _inbox and _universal_clipboard streams and _all and _trash pseudostreams */}
            {universalClipboardStream && !universalClipboardStream.disabled ?
                <StreamListItem
                reservedStream={true}
                pseudoStream={false}
                key={universalClipboardStream.id}
                stream={universalClipboardStream}
                /> : null
            }
            <StreamListItem
                reservedStream={true}
                pseudoStream={true}
                key={"_id_all"}
                pseudoStreamName={"_all"}
            />
            {inboxStream && !inboxStream.disabled ?
                <StreamListItem
                    reservedStream={true}
                    pseudoStream={false}
                    key={inboxStream.id}
                    stream={inboxStream}
                /> : null
            }
            {inboxStream && !unsortedStream.disabled ?
                <StreamListItem
                    reservedStream={true}
                    pseudoStream={false}
                    key={unsortedStream.id}
                    stream={unsortedStream}
                /> : null
            }
            <StreamListItem
                reservedStream={true}
                pseudoStream={true}
                key={"_id_trash"}
                pseudoStreamName={"_trash"}
            />
            {userDefinedStreams?.map((userDefinedStream) => (
                <StreamListItem
                    pseudoStream={false}
                    key={userDefinedStream.id}
                    stream={userDefinedStream}
                    reservedStream={userDefinedStream.resereved}
                />
            ))}
        </div>
    )
}