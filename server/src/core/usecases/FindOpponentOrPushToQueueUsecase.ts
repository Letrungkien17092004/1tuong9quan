import { WaitingQueueItem } from "../entities/index.js";
import { IWaitingQueueItemRepository } from "../interface/repositories/index.js"

export default class FindOpponentOrPushToQueueUsecase {
    private waitingQueueRepo: IWaitingQueueItemRepository

    constructor(waitingQueueRepo: IWaitingQueueItemRepository) {
        this.waitingQueueRepo = waitingQueueRepo
    }

    /**
     * get an opponent from Waiting queue, if no have then push to waiting queue
     * @returns 
     */
    async excute(options: { socketId: string, playerId: string }): Promise<WaitingQueueItem | undefined> {
        const alreadyInQueue = await this.waitingQueueRepo.alreadyInQueue(options.playerId)
        if (alreadyInQueue) { throw new Error("you are in queue") }
        const opponent = await this.waitingQueueRepo.popItem()
        if (opponent) {
            return opponent
        }

        await this.waitingQueueRepo.pushItem(options.socketId, options.playerId)
        return undefined
    }
}