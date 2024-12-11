const { format } = require('date-fns');

export function getStreamName(streamName) {
    // The "stream" "All" is not really technically a stream per se; rather it is the aggregation of all other streams the user is a part of
    switch (streamName) {
        case '_unsorted':
            return "Unsorted"
        case '_inbox':
            return "Inbox"
        case '_universal_clipboard':
            return "Universal clipboard"
        case '_trash':
            return "Trash"
        case '_all':
            return "All"
        default:
            return streamName
    }
}

export function getPriorityLevelName(priority_level, capizalization) {
    let priority_level_name;
    switch (priority_level) {
        case 0:
            priority_level_name = "none"
            break
        case 1:
            priority_level_name = "low"
            break
        case 2:
            priority_level_name = "medium"
            break
        case 3:
            priority_level_name = "high"
            break
        default:
            priority_level_name = "UNDEFINED_PRIORITY_LEVEL"
    }
    if (capizalization) {
        return priority_level_name.toUpperCase()
    } else {
        return priority_level_name
    }
}

function firestoreTimestampToJSDate(firestore_timestamp) {
    const milliseconds = firestore_timestamp?.seconds * 1000 + firestore_timestamp?.nanoseconds / 1000000;
    const javascriptDate = new Date(milliseconds);
    return javascriptDate
}

export function firestoreTimestampToDate(firestore_timestamp) {
    const JSDate = firestoreTimestampToJSDate(firestore_timestamp)
    return format(JSDate, "dd MMMM yyyy HH:mm:ss")
}

export function separateStreams(streams) {
    const queriedUserDefinedStreams = streams.filter(stream => !stream.reserved)
    const queriedInboxStream = streams.find(stream => stream.name === "_inbox")
    const queriedUnsortedStream = streams.find(stream => stream.name === "_unsorted")
    const queriedUniversalClipboardStream = streams.find(stream => stream.name === "_universal_clipboard")
    return { queriedUserDefinedStreams, queriedInboxStream, queriedUnsortedStream, queriedUniversalClipboardStream }
}