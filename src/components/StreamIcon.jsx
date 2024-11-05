export const StreamIcon = ({ reserved_stream, stream_name, stream_icon_uri, group_stream }) => {
    let icon
    if (reserved_stream) {
        if (stream_name === '_unsorted') {
            icon = <span className="material-symbols-outlined group-icon-google">scatter_plot</span>
        } else if (stream_name === '_inbox') {
            icon = <span className="material-symbols-outlined group-icon-google">inbox</span>
        } else if (stream_name === '_all') {
            icon = <span className="material-symbols-outlined group-icon-google">all_inbox</span>
        } else if (stream_name === '_universal_clipboard') {
            icon = <span className="material-symbols-outlined group-icon-google">content_paste</span>
        } else if (stream_name === '_trash') {
            icon = <span className="material-symbols-outlined group-icon-google">delete</span>
        }
    } else if (stream_icon_uri) {
        icon = <img src={stream_icon_uri} className='sidebar-stream_list-item-icon' />
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