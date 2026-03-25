

export default class WaitingQueueItem {
    socketId: string
    playerId: string

    constructor({ socketId, playerId }: { socketId: string, playerId: string }) {
        this.socketId = socketId
        this.playerId = playerId
    }

    clone(): WaitingQueueItem {
        const copy = new WaitingQueueItem({
            socketId: this.socketId,
            playerId: this.playerId
        })

        return copy
    }
}