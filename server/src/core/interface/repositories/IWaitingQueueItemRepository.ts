import { WaitingQueueItem } from "../../entities/index.js"

export default interface IWaitingQueueItemRepository {
    pushItem(socketId: string, playerId: string): Promise<void>
    removeItem(playerId: string): Promise<void>
    alreadyInQueue(playerId: string): Promise<boolean>
    getFirst(): Promise<WaitingQueueItem | undefined>
}