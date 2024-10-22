import { Stream } from './Stream.jsx'
import { NewStream } from './NewStream.jsx'

import { useStream } from '../context/StreamContext.js'

export const MainView = () => {
    const values = useStream()
    const selectedStream = values?.selectedStream || null

    let view;
    if (selectedStream) {
        view = <Stream />
    } else {
        view = <NewStream />
    }
    return (
        <div className='main_view'>
            {view}
        </div>
    )
}