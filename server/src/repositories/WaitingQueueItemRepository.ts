import { WaitingQueueItem } from "../core/entities/index.js";
import { IWaitingQueueItemRepository } from "../core/interface/repositories/index.js"

export default class WaitingQueueItemRepository implements IWaitingQueueItemRepository {
    private queue: WaitingQueueItem[] = []

    async pushItem(socketId: string, playerId: string): Promise<void> {
        const newItem = new WaitingQueueItem({ socketId, playerId });
        this.queue.push(newItem);
    }

    async alreadyInQueue(playerId: string): Promise<boolean> {
        return this.queue.some(item => item.playerId === playerId);
    }

    async removeItem(playerId: string): Promise<void> {
        this.queue = this.queue.filter(item => item.playerId !== playerId);
    }

    async getFirst(): Promise<WaitingQueueItem | undefined> {
        const result = this.queue[0];
        return result ? result.clone() : undefined
    }

    async getQueueLength(): Promise<number> {
        return this.queue.length;
    }
}