import { getStreamName } from '../functions/data.js'
import { leaveStream } from '../functions/firebaseCalls.js'

import { useUser } from '../context/UserContext.js'
import { useStream } from '../context/StreamContext.js'

export const StreamHeader = () => {
    const { user } = useUser()
    const { selectedStream, setShowStreamSettings } = useStream()

    let buttonRight
    if (selectedStream.reserved) {
        buttonRight = (
            <div className="button button-medium button-hover-dark" title="Hide stream">
                <span
                    className="material-symbols-outlined"
                    onClick={() => leaveStream(selectedStream, user.id)}
                >
                    hide
                </span>
            </div>
        )
    } else if (selectedStream.admin_ids.length > 1) {
        buttonRight = (
            <div className="button button-medium button-hover-dark" title="Leave stream">
                <span
                    className="material-symbols-outlined"
                    onClick={() => leaveStream(selectedStream, user.id)}
                >
                    group_remove
                </span>
            </div>
        )
    } else {
        buttonRight = (
            <div className="button button-medium button-hover-dark" title="Delete stream">
                <span
                    className="material-symbols-outlined"
                >
                    delete
                </span>
            </div>
        )
    }

    return (
        <div>
            <div className="header">
                <div className="stream-header-buttons-left buttons-container">
                    <div className="button-container">
                        <div className='button button-medium button-hover-dark' title="Toogle sidebar">
                            <span className="material-symbols-outlined">
                                view_sidebar
                            </span>
                        </div>
                    </div>
                    <div className="button-container">
                        <div className='button button-medium button-hover-dark' title="Add user to stream">
                            <span className="material-symbols-outlined" onClick={() => setShowStreamSettings(true)}>
                                settings
                            </span>
                        </div>
                    </div>
                </div>
                <div className="stream-name">{getStreamName(selectedStream.name)}</div>
                <div className="stream-header-buttons-right buttons-container">
                    <div className='button-container'>
                        {buttonRight}
                    </div>
                    <div className='button-container'>
                        <div className="button button-medium button-hover-dark" title="Delete all messages in the stream">
                            <span
                                className="material-symbols-outlined"
                            >
                                clear_all
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='header-background'></div> */}
        </div>
    )
}