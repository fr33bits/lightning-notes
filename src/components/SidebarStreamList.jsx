import { useEffect, useState } from 'react';

import { useUser } from "../context/UserContext";

import { StreamListItem } from './SidebarStreamListItem';
import { getUserStreams } from '../functions/firebaseCalls';

export const StreamList = () => {
    const { user } = useUser();

    const [streamListLoading, setStreamListLoading] = useState(true)
    const [userDefinedStreams, setUserDefinedStreams] = useState([])
    const [inboxStream, setInboxStream] = useState(null)
    const [unsortedStream, setUnsortedStream] = useState(null)
    const [universalClipboardStream, setUniversalClipboardStream] = useState(null)

    useEffect(() => {
        getUserStreams(user.id, setStreamListLoading, setUserDefinedStreams, setInboxStream, setUnsortedStream, setUniversalClipboardStream)
    }, []);

    if (!streamListLoading) {
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
                <div className='reserved-user_defined-separator'>
                </div>
                {/* USER DEFINED STREAMS */}
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
}