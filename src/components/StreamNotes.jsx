import { useState, useEffect, useRef } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { getUser } from '../functions/firebaseCalls.js'
import { db } from '../firebase-config.js'

import { Note } from './Note.jsx'

import { useStream } from '../context/StreamContext.js'

export const StreamNotes = () => {
    const { selectedStream } = useStream()

    const messagesRef = collection(db, 'messages')
    const [messages, setMessages] = useState([])

    const messagesEndRef = useRef(null)

    useEffect(() => {
        const queryStreamMesssages = query(
            messagesRef,
            where("stream_id", "==", selectedStream.id),
            orderBy('created_at')
        )
        const unsubscribe = onSnapshot(queryStreamMesssages, (snapshot) => {
            let queriedMessages = []
            snapshot.forEach((doc) => {
                queriedMessages.push({ ...doc.data(), id: doc.id }) // if the id already existed, it would not be added
            })
            setMessages(queriedMessages)
        })

        return () => unsubscribe() // TODO: poglej, zakaj je to pomembno
    }, [selectedStream])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className='messages-container'>
            <div className='messages'>
                {messages.map((message, index) => (
                    <Note
                        key={index}
                        message={message}
                        index={index}
                        author={getUser(message.author_id)}
                    />
                ))}
                <div ref={messagesEndRef}></div>
            </div>
        </div>
    )
}