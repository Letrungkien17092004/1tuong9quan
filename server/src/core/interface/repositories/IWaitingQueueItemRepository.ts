import { WaitingQueueItem } from "../../entities/index.js"

export default interface IWaitingQueueItemRepository {
    popItem(): Promise<WaitingQueueItem | undefined>
    pushItem(socketId: string, playerId: string): Promise<void>
    removeItem(playerId: string): Promise<void>
    alreadyInQueue(playerId: string): Promise<boolean>
}