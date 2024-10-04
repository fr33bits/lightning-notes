export function getStreamName(streamName) {
    // The "stream" "All" is not really technically a stream per se; rather it is the aggregation of all other streams the user is a part of
    switch (streamName) {
        case '_unsorted':
            return "Unsorted"
        case '_inbox':
            return "Inbox"
        default:
            return streamName
    }
}