import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase-config';

import { useUser } from "../context/UserContext";

import { StreamListItem } from './SidebarStreamListItem';

export const StreamList = ({ selectedStream, setSelectedStream }) => {
    const { user, loading } = useUser();

    const streamsRef = collection(db, 'streams')
    const [streams, setStreams] = useState([])

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
            setStreams(queriedStreams)
        })

        return () => unsubscribe()
    }, [user]); // TODO: should really be changed every time a new message queue is created, no?

    return (
        <div className='sidebar-stream-list'>
            {streams.map((stream) => (
                <StreamListItem
                    key={stream.id}
                    stream={stream}
                    selectedStream={selectedStream}
                    setSelectedStream={setSelectedStream}
                />
            ))}
        </div>
    )
}