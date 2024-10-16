import { Stream } from './Stream.jsx'
import { NewStream } from './NewStream.jsx'

export const MainView = ({selectedStream, setSelectedStream}) => {
    let view;
    if (selectedStream) {
        view = (
            <Stream
                selectedStream={selectedStream}
            />
        )
    } else {
        view = (
            <NewStream
                setSelectedStream={setSelectedStream}
            />
        )
    }
    return (
        <div className='main_view'>
            {view}
        </div>
    )
}