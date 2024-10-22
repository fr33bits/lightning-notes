import { useState, useEffect } from "react"
import { collection, query, where, getDocs, orderBy, limit, onSnapshot } from "firebase/firestore"

import { db } from "../firebase-config"
import { getStreamName } from "../functions/data"

import { useUser } from "../context/UserContext"
import { useStream } from "../context/StreamContext"

const StreamIcon = ({ reserved_stream, stream_name, stream_icon_uri, group_stream }) => {
    let icon
    if (reserved_stream) {
        if (stream_name === '_unsorted') {
            icon = <span className="material-symbols-outlined group-icon-google">scatter_plot</span>
        } else if (stream_name === '_inbox') {
            icon = <span className="material-symbols-outlined group-icon-google">inbox</span>
        } else if (stream_name === '_all') {
            icon = <span className="material-symbols-outlined group-icon-google">all_inbox</span>
        }
    } else if (stream_icon_uri) {
        icon = <img src={stream_icon_uri} className='sidebar-stream-item-icon' />
    } else if (group_stream) {
        icon = <span className="material-symbols-outlined group-icon-google">groups</span>
    } else {
        icon = <span className="material-symbols-outlined group-icon-google">folder</span>
    }

    return (
        <div className='stream-icon-container'>
            {icon}
        </div>
    )
}

export const StreamListItem = ({ stream }) => {
    const values = useStream()
    const selectedStream = values?.selectedStream || null
    const setSelectedStream = values.setSelectedStream
    const { user } = useUser();

    const [lastMessage, setLastMessage] = useState(null)
    const [lastMessageUser, setLastMessageUser] = useState(null)

    useEffect(() => {
        if (lastMessage) {
            const usersRef = collection(db, 'users')
            const getUser = async () => {
                const q = query(usersRef, where("id", "==", user.id))
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map(doc => doc.data());
                setLastMessageUser(users[0]);
            }
            getUser(lastMessage.author_id)
        }
    }, [lastMessage])

    useEffect(() => {
        const getLastMessage = async () => {

            const messagesRef = collection(db, "messages")
            const queryMessagesList = query(
                messagesRef,
                where("stream_id", "==", stream.id),
                orderBy('created_at', "desc"),
                limit(1)
            )

            const unsubscribe = onSnapshot(queryMessagesList, async (snapshot) => {
                let queriedMessages = []
                snapshot.forEach((doc) => {
                    queriedMessages.push({ ...doc.data(), id: doc.id })
                })
                let queriedLastMessage = queriedMessages[0]
                setLastMessage(queriedLastMessage)
            })

            return () => unsubscribe()
        }
        getLastMessage()
    }, [stream]);

    const selectStream = () => {
        setSelectedStream(stream);
    }

    return (
        <div className='sidebar-stream-item' onClick={selectStream}>
            <div className='sidebar-stream-item-icon-container'>
                <StreamIcon
                    reserved_stream={stream.reserved}
                    stream_name={stream.name}
                    stream_icon_uri={stream.icon_uri}
                    group_stream={stream.member_ids > 1}
                />
            </div>
            <div className='sidebar-stream-item-text'>
                <div className='sidebar-stream-item-header' title={"Stream ID: " + stream.id}>
                    {getStreamName(stream.name)}
                </div>
                {lastMessageUser?.name ?
                    <div className='sidebar-stream-item-last-message'>
                        {lastMessageUser?.id === user.id ?
                            'You' :
                            lastMessageUser?.name.split(' ')[0]
                        }
                        : {lastMessage?.text}
                    </div>
                    : null
                }
            </div>
        </div>
    )
}