import { getStreamName } from '../functions/data.js'
import { leaveStream } from '../functions/firebaseCalls.js'

import { useUser } from '../context/UserContext.js'
import { useStream } from '../context/StreamContext.js'

export const StreamHeader = () => {
    const { user } = useUser()
    const { selectedStream, setShowStreamSettings } = useStream()

    return (
        <div>
            <div className="header">
                <div className='header-item' style={{ float: 'left' }}>
                    <span className="material-symbols-outlined leave-stream-icon" title="Add user to stream" onClick={() => setShowStreamSettings(true)}>
                        settings
                    </span>
                </div>
                <div className="header-item stream-name">{getStreamName(selectedStream.name)}</div>
                {/* TODO: order of these float: right divs unclear */}
                {
                    selectedStream.reserved ? null :
                    <div className='header-item' style={{ float: 'right' }}>
                            <span className="material-symbols-outlined leave-stream-icon" title="Leave stream" onClick={() => leaveStream(selectedStream, user.id)}>
                                group_remove
                            </span>
                        </div>
                }
            </div>
            {/* <div className='header-background'></div> */}
        </div>
    )
}