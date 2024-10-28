import { useStream } from '../context/StreamContext';

export const Header = () => {
    const { setSelectedStream } = useStream()
    return (
        <div className="sidebar-header gradient">
            <div className='sidebar-header-service-name service-name'>
                Lightning Notes
            </div>
            <div className='sidebar-header-buttons buttons-container'>
                <div className="button-container" onClick={() => setSelectedStream(null)} title='New stream'>
                    <div className="button button-medium button-hover-light">
                        <span className="material-symbols-outlined">
                            add
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}