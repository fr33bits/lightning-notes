import { getDate } from '../functions/data'
import { getUser } from '../functions/firebaseCalls'

export const Note = ({message, author}) => {
    const { format } = require('date-fns');

    // USER DATA
    // const [senders, setSenders] = useState([])
    // useEffect(() => {
    //     const fetchSenders = async () => {
    //         const uniqueSenderIDs = []
    //         for (let i = 0; i < messages.length; i++) {
    //             const author_id = messages[i].author_id
    //             if (!uniqueSenderIDs.includes(author_id)) {
    //                 uniqueSenderIDs.push(author_id)
    //             }
    //         }

    //         const usersRef = collection(db, 'users')
    //         async function getUser(user_id) {
    //             const q = query(usersRef, where("id", "==", user_id))
    //             const querySnapshot = await getDocs(q);
    //             const users = querySnapshot.docs.map(doc => doc.data());
    //             return users[0]
    //         }

    //         const streamSenders = []
    //         for (let i = 0; i < uniqueSenderIDs.length; i++) {
    //             const data = await getUser(uniqueSenderIDs[i])
    //             streamSenders[uniqueSenderIDs[i]] = data
    //         }
    //         setSenders(streamSenders)
    //     }

    //     fetchSenders()
    // }, [messages])

    return (
        <div className='message-row'>
            <div
                id={message.id}
                key={message.id}
            >
                <div className='note-metadata-row'>
                    <div className='note-timestamp'>

                    </div>
                    {/* <div
                        className='note-author-name'
                    >
                        {getUser(message.author_id)}
                    </div> */}
                </div>
                <div
                    className='message-text'
                    title={'Message ID: ' + message.id
                        + '\n' + getDate(message.created_at)
                    }
                >
                    {/* Style needed to push the message text to the right even though the parent div is already pushed to the right */}
                    {message.text}
                </div>
                {/* <div className='message-timestamp'>
                        {message?.created_at?.seconds ? getDate(message.created_at.seconds) : null}
                    </div> */}
            </div>
        </div>
    )
}