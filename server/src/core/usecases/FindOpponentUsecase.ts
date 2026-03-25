import { WaitingQueueItem } from "../entities/index.js";
import { IWaitingQueueItemRepository } from "../interface/repositories/index.js"

export default class FindOpponentUsecase {
    private waitingQueueRepo: IWaitingQueueItemRepository

    constructor(waitingQueueRepo: IWaitingQueueItemRepository) {
        this.waitingQueueRepo = waitingQueueRepo
    }

    /**
     * get an opponent from Waiting queue, if no have then push to waiting queue
     * @returns 
     */
    async excute(options: { socketId: string, playerId: string }): Promise<WaitingQueueItem | undefined> {
        const opponent = await this.waitingQueueRepo.getFirst()
        if (opponent) {
            return opponent
        }

        await this.waitingQueueRepo.pushItem(options.socketId, options.playerId)
        return undefined
    }
}