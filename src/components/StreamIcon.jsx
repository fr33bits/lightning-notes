import '../styles/StreamIcon.css'

export const StreamIcon = ({ reserved_stream, stream_name, stream_icon_uri, group_stream }) => {
    let icon
    if (reserved_stream) {
        if (stream_name === '_unsorted') {
            icon = <span className="material-symbols-outlined icon-filled">scatter_plot</span>
        } else if (stream_name === '_inbox') {
            icon = <span className="material-symbols-outlined icon-filled">inbox</span>
        } else if (stream_name === '_all') {
            icon = <span className="material-symbols-outlined icon-filled">all_inbox</span>
        } else if (stream_name === '_universal_clipboard') {
            icon = <span className="material-symbols-outlined icon-filled">content_paste</span>
        } else if (stream_name === '_trash') {
            icon = <span className="material-symbols-outlined icon-filled">delete</span>
        }
    } else if (stream_icon_uri) {
        icon = <img src={stream_icon_uri} className='sidebar-stream_list-item-custom-icon' />
    } else if (group_stream) {
        icon = <span className="material-symbols-outlined icon-filled">groups</span>
    } else {
        icon = <span className="material-symbols-outlined icon-filled">folder</span>
    }

    return (
        <div className='stream-icon-container'>
            {icon}
        </div>
    )
}