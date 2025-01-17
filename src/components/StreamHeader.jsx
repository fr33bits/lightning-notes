import { getStreamName } from '../functions/data.js'
import { leaveStream } from '../functions/firebaseCalls.js'

import { useUser } from '../context/UserContext.js'
import { useStream } from '../context/StreamContext.js'
import { useView } from '../context/ViewContext.js'

import { StreamIcon } from './StreamIcon.jsx'

import '../styles/StreamHeader.css'

export const StreamHeader = () => {
    const { user } = useUser()
    const { selectedStream, setShowStreamSettings } = useStream()
    const { toggleSidebar } = useView()

    let buttonRight
    if (selectedStream.reserved) {
        buttonRight = (
            <div className="button button-medium button-hover-dark" title="Hide stream">
                <span
                    className="material-symbols-outlined"
                >
                    hide_source
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
        <>
            <div className='header-background'></div>
            <div className="header">
                <div className="header-inner">

                    <div className="stream-header-buttons-left buttons-container">
                        <div className="button-container">
                            <div
                                className='button button-medium button-hover-dark'
                                title="Toogle sidebar"
                                onClick={toggleSidebar}
                            >
                                <span className="material-symbols-outlined">
                                    view_sidebar
                                </span>
                            </div>
                        </div>
                        <div className="button-container">
                            <div
                                className='button button-medium button-hover-dark'
                                title="Add user to stream"
                                onClick={() => setShowStreamSettings(true)}
                            >
                                <span className="material-symbols-outlined">
                                    settings
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='stream-header-name-icon-container'>
                        <div className='stream-header-icon-container'>
                            <StreamIcon
                                reserved_stream={selectedStream.reserved}
                                stream_name={selectedStream.name}
                                stream_icon_uri={selectedStream?.icon_uri}
                                group_stream={selectedStream.member_ids > 1}
                            />
                        </div>
                        <div className='stream-header-name'>
                            {getStreamName(selectedStream.name)}
                        </div>
                    </div>
                    <div className="stream-header-buttons-right buttons-container">
                        <div className='button-container'>
                            {buttonRight}
                        </div>
                        <div className='button-container'>
                            <div className="button button-medium button-hover-dark" title="Delete all notes in the stream">
                                <span
                                    className="material-symbols-outlined"
                                >
                                    clear_all
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}